'use client';

import React, { useState } from 'react';
import { Landmark, Banknote, CreditCard, MapPin } from 'lucide-react';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Controller } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { registerBankAccount } from '@/services/bank-account-api-service';

// Regras FIAT para filtro dinâmico
const fiatRules = [
  {
    country: 'Brazil',
    symbol: 'BRL',
    paymentMethod: 'PIX',
    min: null,
    max: null,
  },
  {
    country: 'Mexico',
    symbol: 'MXN',
    paymentMethod: 'SPEI',
    min: null,
    max: 3000000,
  },
  {
    country: 'United States',
    symbol: 'USD',
    paymentMethod: 'FedNow',
    min: null,
    max: null,
  },
];

// VisuallyHidden utility for accessibility (Radix style)
const VisuallyHidden: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <span
    style={{
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: '1px',
      margin: '-1px',
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      width: '1px',
      whiteSpace: 'nowrap',
    }}
  >
    {children}
  </span>
);

// ISO 3166-1 alpha-2 codes
const countries = [
  { value: 'BR', label: 'Brazil', paymentMethod: 'PIX', symbol: 'BRL' },
  { value: 'MX', label: 'Mexico', paymentMethod: 'SPEI', symbol: 'MXN' },
  {
    value: 'US',
    label: 'United States',
    paymentMethod: 'FedNow',
    symbol: 'USD',
  },
];

export type BankAccountForm = {
  id?: string;
  asset: string;
  name: string;
  bank_name: string;
  branch: string;
  account: string;
  country: string;
  instant_payment: string;
  instant_payment_type: string;
  city: string;
  postal_code: string;
  state: string;
  street_line: string;
};

interface BankAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: BankAccountForm | null;
  onSuccess?: () => void;
}

export function BankAccountModal({
  open,
  onOpenChange,
  initialData,
  onSuccess,
}: BankAccountModalProps) {
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
    getValues,
    setValue,
    watch,
  } = useForm<BankAccountForm>({
    defaultValues: initialData || {
      asset: '',
      name: '',
      bank_name: '',
      branch: '',
      account: '',
      country: '',
      instant_payment: '',
      instant_payment_type: '',
      city: '',
      postal_code: '',
      state: '',
      street_line: '',
    },
  });

  // Watch country for auto-fill
  const selectedCountry = watch('country');

  // Preenche apenas asset e instant_payment_type, nunca outros campos!
  React.useEffect(() => {
    const countryObj = countries.find((c) => c.value === selectedCountry);
    if (countryObj) {
      setValue('asset', countryObj.symbol);
      setValue('instant_payment_type', countryObj.paymentMethod);
    } else {
      setValue('asset', '');
      setValue('instant_payment_type', '');
    }
    // Nunca preenche bank_name, endereço, etc!
  }, [selectedCountry, setValue]);

  // Mutação real para registrar conta bancária
  const mutation = useMutation({
    mutationFn: async (data: BankAccountForm) => {
      const payload = {
        asset: data.asset,
        name: data.name,
        bank_name: data.bank_name,
        branch: data.branch,
        country: data.country,
        account: data.account,
        instant_payment: data.instant_payment,
        instant_payment_type: data.instant_payment_type,
        city: data.city,
        postal_code: data.postal_code,
        state: data.state,
        street_line: data.street_line,
      };
      return await registerBankAccount(payload);
    },

    onSuccess: (result) => {
      if (result?.id) {
        queryClient.invalidateQueries({ queryKey: ['bankAccounts'] });
        toast.success('Conta bancária salva!');
        onOpenChange(false);
        reset();
        onSuccess?.();
      } else if (result?.message) {
        toast.error(result.message);
      } else {
        toast.error('Erro inesperado ao registrar conta bancária.');
      }
    },
    
    onError: (error) => {
      if (error?.message) {
        toast.error(error.message);
      } else {
        toast.error('Erro ao salvar conta bancária');
      }
    },
  });

  // Step logic
  const [step, setStep] = useState(0);
  // For validation on last step
  const { trigger, formState } = useForm<BankAccountForm>();

  // Steps como componentes independentes para inputs isolados
  const StepFiat = () => {
    return (
      <div className="space-y-4">
        {/* Country */}
        <div className='relative'>
          <Label className='text-sm font-semibold text-gray-700 mb-2 block'>Country *</Label>
          <Controller
            name='country'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <div className='relative'>
                <select
                  {...field}
                  className='w-full pl-4 pr-10 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-all duration-300 shadow-sm appearance-none bg-white text-gray-900 font-medium hover:border-gray-300'
                  required
                >
                  <option value=''>Select your country</option>
                  {countries.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <div className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2'>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <title>Dropdown</title>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            )}
          />
        </div>
        
        {/* Symbol (asset) - auto-filled */}
        <div className='relative'>
          <Label className='text-sm font-semibold text-gray-700 mb-2 block'>Currency Symbol *</Label>
          <Controller
            name='asset'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <div className="relative">
                <Input
                  {...field}
                  className='w-full pl-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 font-medium cursor-not-allowed'
                  required
                  disabled
                  placeholder="Auto-filled based on country"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <title>Auto-filled</title>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            )}
          />
        </div>
        
        <div className='relative'>
          <Label className='text-sm font-semibold text-gray-700 mb-2 block'>Payment Method *</Label>
          <Controller
            name='instant_payment_type'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <div className="relative">
                <Input
                  {...field}
                  className='w-full pl-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 font-medium cursor-not-allowed'
                  required
                  disabled
                  placeholder="Auto-filled based on country"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <title>Auto-filled</title>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            )}
          />
        </div>
      </div>
    );
  };

  const StepAccountDetails = () => {
    return (
      <div className="space-y-4">
        {/* Account Nickname */}
        <div className='relative'>
          <Label className='text-sm font-semibold text-gray-700 mb-2 block'>Account Name *</Label>
          <Controller
            name='name'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder='E.g.: Main Account, Investments Account, etc'
                className='w-full pl-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-all duration-300 shadow-sm bg-white'
                required
              />
            )}
          />
        </div>
        
        {/* Instant Payment Key */}
        <div className='relative'>
          <Label className='text-sm font-semibold text-gray-700 mb-2 block'>
            {(() => {
              const country = getValues('country');
              if (country === 'BR') return 'PIX Key *';
              if (country === 'MX') return 'SPEI Account *';
              if (country === 'US') return 'FedNow Routing Number *';
              return 'Instant Payment Number *';
            })()}
          </Label>
          <Controller
            name='instant_payment'
            control={control}
            rules={{ required: true }}
            render={({ field }) => {
              const country = getValues('country');
              let placeholder = '';
              if (country === 'BR') placeholder = 'E.g.: 11999999999, CPF, email, CNPJ...';
              else if (country === 'MX') placeholder = 'E.g.: 123456789012345678';
              else if (country === 'US') placeholder = 'E.g.: 021000021';
              else placeholder = 'Enter the instant payment identifier';
              return (
                <Input
                  {...field}
                  placeholder={placeholder}
                  className='w-full pl-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-all duration-300 shadow-sm bg-white'
                  required
                />
              );
            }}
          />
        </div>
        
        {/* Bank */}
        <div className='relative'>
          <Label className='text-sm font-semibold text-gray-700 mb-2 block'>Bank *</Label>
          <Controller
            name='bank_name'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder='Bank name'
                className='w-full pl-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-all duration-300 shadow-sm bg-white'
                required
              />
            )}
          />
        </div>
        
        {/* Branch and Account */}
        <div className='flex flex-col sm:flex-row gap-4'>
          <div className='flex-1'>
            <Label className='text-sm font-semibold text-gray-700 mb-2 block'>Branch</Label>
            <Controller
              name='branch'
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder='Branch'
                  className='w-full pl-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-all duration-300 shadow-sm bg-white'
                />
              )}
            />
          </div>
          <div className='flex-1'>
            <Label className='text-sm font-semibold text-gray-700 mb-2 block'>Account Number *</Label>
            <Controller
              name='account'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder='Account number'
                  className='w-full pl-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-all duration-300 shadow-sm bg-white'
                  required
                />
              )}
            />
          </div>
        </div>
      </div>
    );
  };

  const StepAddress = () => {
    return (
      <div className="space-y-4">
        {/* Address Row 1 */}
        <div className='flex flex-col sm:flex-row gap-4'>
          <div className='flex-1'>
            <Label className='text-sm font-semibold text-gray-700 mb-2 block'>City *</Label>
            <Controller
              name='city'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder='City'
                  className='w-full pl-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-all duration-300 shadow-sm bg-white'
                  required
                />
              )}
            />
          </div>
          <div className='flex-1'>
            <Label className='text-sm font-semibold text-gray-700 mb-2 block'>State *</Label>
            <Controller
              name='state'
              control={control}
              rules={{ required: true }}
              render={({ field }) => {
                const country = getValues('country');
                if (country === 'US') {
                  const subdivisions = [
                    { code: 'AL', name: 'Alabama' },
                    { code: 'AK', name: 'Alaska' },
                    { code: 'AZ', name: 'Arizona' },
                    { code: 'AR', name: 'Arkansas' },
                    { code: 'CA', name: 'California' },
                    { code: 'CO', name: 'Colorado' },
                    { code: 'CT', name: 'Connecticut' },
                    { code: 'DE', name: 'Delaware' },
                    { code: 'FL', name: 'Florida' },
                    { code: 'GA', name: 'Georgia' },
                    { code: 'HI', name: 'Hawaii' },
                    { code: 'ID', name: 'Idaho' },
                    { code: 'IL', name: 'Illinois' },
                    { code: 'IN', name: 'Indiana' },
                    { code: 'IA', name: 'Iowa' },
                    { code: 'KS', name: 'Kansas' },
                    { code: 'KY', name: 'Kentucky' },
                    { code: 'LA', name: 'Louisiana' },
                    { code: 'ME', name: 'Maine' },
                    { code: 'MD', name: 'Maryland' },
                    { code: 'MA', name: 'Massachusetts' },
                    { code: 'MI', name: 'Michigan' },
                    { code: 'MN', name: 'Minnesota' },
                    { code: 'MS', name: 'Mississippi' },
                    { code: 'MO', name: 'Missouri' },
                    { code: 'MT', name: 'Montana' },
                    { code: 'NE', name: 'Nebraska' },
                    { code: 'NV', name: 'Nevada' },
                    { code: 'NH', name: 'New Hampshire' },
                    { code: 'NJ', name: 'New Jersey' },
                    { code: 'NM', name: 'New Mexico' },
                    { code: 'NY', name: 'New York' },
                    { code: 'NC', name: 'North Carolina' },
                    { code: 'ND', name: 'North Dakota' },
                    { code: 'OH', name: 'Ohio' },
                    { code: 'OK', name: 'Oklahoma' },
                    { code: 'OR', name: 'Oregon' },
                    { code: 'PA', name: 'Pennsylvania' },
                    { code: 'RI', name: 'Rhode Island' },
                    { code: 'SC', name: 'South Carolina' },
                    { code: 'SD', name: 'South Dakota' },
                    { code: 'TN', name: 'Tennessee' },
                    { code: 'TX', name: 'Texas' },
                    { code: 'UT', name: 'Utah' },
                    { code: 'VT', name: 'Vermont' },
                    { code: 'VA', name: 'Virginia' },
                    { code: 'WA', name: 'Washington' },
                    { code: 'WV', name: 'West Virginia' },
                    { code: 'WI', name: 'Wisconsin' },
                    { code: 'WY', name: 'Wyoming' },
                    { code: 'DC', name: 'District of Columbia' },
                    { code: 'AS', name: 'American Samoa' },
                    { code: 'GU', name: 'Guam' },
                    { code: 'MP', name: 'Northern Mariana Islands' },
                    { code: 'PR', name: 'Puerto Rico' },
                    { code: 'UM', name: 'United States Minor Outlying Islands' },
                    { code: 'VI', name: 'Virgin Islands, U.S.' },
                  ];
                  return (
                    <div className='relative'>
                      <select
                        {...field}
                        className='w-full pl-4 pr-10 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-all duration-300 shadow-sm appearance-none bg-white text-gray-900 font-medium hover:border-gray-300'
                        required
                      >
                        <option value=''>Select state</option>
                        {subdivisions.map((opt) => (
                          <option key={opt.code} value={opt.code}>
                            {opt.name}
                          </option>
                        ))}
                      </select>
                      <div className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2'>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <title>Dropdown</title>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  );
                }
                // Para outros países, campo texto
                return (
                  <Input
                    {...field}
                    placeholder='State'
                    className='w-full pl-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-all duration-300 shadow-sm bg-white'
                    required
                  />
                );
              }}
            />
          </div>
        </div>
        
        {/* Address Row 2 */}
        <div className='flex flex-col sm:flex-row gap-4'>
          <div className='flex-1'>
            <Label className='text-sm font-semibold text-gray-700 mb-2 block'>Postal Code *</Label>
            <Controller
              name='postal_code'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder='Postal code'
                  className='w-full pl-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-all duration-300 shadow-sm bg-white'
                  required
                />
              )}
            />
          </div>
          <div className='flex-1'>
            <Label className='text-sm font-semibold text-gray-700 mb-2 block'>Street Address *</Label>
            <Controller
              name='street_line'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder='Street, number, complement'
                  className='w-full pl-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-all duration-300 shadow-sm bg-white'
                  required
                />
              )}
            />
          </div>
        </div>
      </div>
    );
  };

  const StepOverview = () => {
    return (
      <div className='space-y-4'>
        {/* FIAT Card */}
        <div className='rounded-xl bg-gradient-to-br from-primary/5 via-white to-primary/10 border border-primary/20 shadow-md p-4'>
          <div className='flex items-center gap-2 mb-3'>
            <Landmark className='w-5 h-5 text-primary' />
            <span className='font-bold text-primary'>FIAT Setup</span>
          </div>
          <div className='grid grid-cols-2 gap-3 text-sm'>
            <div>
              <span className="text-gray-600 font-medium">Country:</span>
              <div className="font-bold text-gray-900">{getValues('country')}</div>
            </div>
            <div>
              <span className="text-gray-600 font-medium">Currency:</span>
              <div className="font-bold text-gray-900">{getValues('asset')}</div>
            </div>
            <div className="col-span-2">
              <span className="text-gray-600 font-medium">Payment Method:</span>
              <div className="font-bold text-gray-900">{getValues('instant_payment_type')}</div>
            </div>
          </div>
        </div>
        
        {/* Account Details Card */}
        <div className='rounded-xl bg-gradient-to-br from-blue-500/5 via-white to-blue-600/10 border border-blue-500/20 shadow-md p-4'>
          <div className='flex items-center gap-2 mb-3'>
            <Banknote className='w-5 h-5 text-blue-600' />
            <span className='font-bold text-blue-600'>Account Details</span>
          </div>
          <div className='grid grid-cols-2 gap-3 text-sm'>
            <div>
              <span className="text-gray-600 font-medium">Name:</span>
              <div className="font-bold text-gray-900">{getValues('name')}</div>
            </div>
            <div>
              <span className="text-gray-600 font-medium">Bank:</span>
              <div className="font-bold text-gray-900">{getValues('bank_name')}</div>
            </div>
            <div>
              <span className="text-gray-600 font-medium">Branch:</span>
              <div className="font-bold text-gray-900">{getValues('branch') || 'N/A'}</div>
            </div>
            <div>
              <span className="text-gray-600 font-medium">Account:</span>
              <div className="font-bold text-gray-900">{getValues('account')}</div>
            </div>
            <div className="col-span-2">
              <span className="text-gray-600 font-medium">Instant Payment:</span>
              <div className="font-bold text-gray-900">{getValues('instant_payment')}</div>
            </div>
          </div>
        </div>
        
        {/* Address Card */}
        <div className='rounded-xl bg-gradient-to-br from-purple-500/5 via-white to-purple-600/10 border border-purple-500/20 shadow-md p-4'>
          <div className='flex items-center gap-2 mb-3'>
            <MapPin className='w-5 h-5 text-purple-600' />
            <span className='font-bold text-purple-600'>Address</span>
          </div>
          <div className='grid grid-cols-2 gap-3 text-sm'>
            <div>
              <span className="text-gray-600 font-medium">City:</span>
              <div className="font-bold text-gray-900">{getValues('city')}</div>
            </div>
            <div>
              <span className="text-gray-600 font-medium">State:</span>
              <div className="font-bold text-gray-900">{getValues('state')}</div>
            </div>
            <div>
              <span className="text-gray-600 font-medium">Postal Code:</span>
              <div className="font-bold text-gray-900">{getValues('postal_code')}</div>
            </div>
            <div>
              <span className="text-gray-600 font-medium">Street:</span>
              <div className="font-bold text-gray-900">{getValues('street_line')}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const onSubmit = (data: BankAccountForm) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className='w-full max-w-lg min-w-[320px] md:min-w-[480px] max-h-[90vh] min-h-[500px] flex flex-col justify-between p-0 border-0 shadow-2xl bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-3xl'
        style={{
          boxSizing: 'border-box',
          border: '1px solid rgba(30, 163, 171, 0.1)',
        }}
      >
        <DialogHeader className='px-8 pt-8 pb-4'>
          {/* Modern Header - only show when not on review step */}
          {step < 3 && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 mb-4">
                <Landmark className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {initialData ? 'Edit Bank Account' : 'Add Bank Account'}
              </h2>
              <p className="text-gray-600">Complete your banking information step by step</p>
            </div>
          )}
          
          {/* Accessible DialogTitle, visually hidden for screen readers (Radix recommended) */}
          <VisuallyHidden>
            <DialogTitle asChild>
              <span>
                {initialData
                  ? 'Editar Conta Bancária'
                  : 'Adicionar Conta Bancária'}
              </span>
            </DialogTitle>
          </VisuallyHidden>
        </DialogHeader>
        <form
          className='flex flex-col gap-8 px-8 pb-8 w-full flex-1 min-h-[360px]'
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Modern Stepper - only show when not on review step */}
          {step < 3 && (
            <div className='flex items-center justify-center gap-4 mb-6 w-full'>
              <div className='flex items-center justify-center gap-3 w-full max-w-md'>
                {[0, 1, 2, 3].map((i) => {
                  const icons = [Landmark, Banknote, MapPin, CreditCard];
                  const labels = [
                    'Setup',
                    'Details',
                    'Address',
                    'Review',
                  ];
                  const Icon = icons[i];
                  const isActive = i === step;
                  const isPast = i < step;
                  
                  return (
                    <div key={i} className="flex flex-col items-center">
                      <div
                        className={`relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${
                          isActive
                            ? 'bg-gradient-to-br from-primary to-primary/90 text-white shadow-lg scale-110'
                            : isPast
                            ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-md'
                            : 'bg-white/80 border-2 border-gray-200 text-gray-400'
                        }`}
                      >
                        {isPast ? (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <title>Completed</title>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <Icon className="w-6 h-6" />
                        )}
                        
                        {/* Step number indicator */}
                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center transition-all duration-300 ${
                          isActive ? 'bg-white text-primary shadow-sm' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {i + 1}
                        </div>
                      </div>
                      
                      <span className={`text-xs font-semibold mt-2 transition-all duration-300 ${
                        isActive ? 'text-primary' : isPast ? 'text-green-600' : 'text-gray-400'
                      }`}>
                        {labels[i]}
                      </span>
                      
                      {/* Progress line */}
                      {i < 3 && (
                        <div className={`absolute top-6 left-[calc(50%+24px)] w-8 h-0.5 transition-all duration-500 ${
                          isPast ? 'bg-green-500' : 'bg-gray-200'
                        }`} style={{ zIndex: -1 }} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {/* Step Content */}
          {step < 3 ? (
            <div className='w-full max-w-full flex-1 min-h-[180px] flex flex-col justify-center bg-white/60 rounded-xl shadow-sm border border-primary/10 p-4 backdrop-blur-sm'>
              <div className='flex flex-col w-full max-w-full'>
                {step === 0 && <StepFiat />}
                {step === 1 && <StepAccountDetails />}
                {step === 2 && <StepAddress />}
              </div>
            </div>
          ) : (
            <div className='w-full max-w-full flex-1 min-h-[180px] flex flex-col justify-center bg-white/60 rounded-xl shadow-sm border border-primary/10 p-4 backdrop-blur-sm'>
              <StepOverview />
            </div>
          )}
          {/* Modern Action Buttons */}
          <div className='flex gap-4 pt-6 w-full flex-col sm:flex-row'>
            <Button
              type='button'
              variant='outline'
              onClick={() =>
                step === 0 ? onOpenChange(false) : setStep(step - 1)
              }
              className='flex-1 min-w-0 bg-white/80 border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 shadow-sm py-3 px-6 rounded-2xl font-semibold transition-all duration-300'
              disabled={isSubmitting || mutation.isPending}
            >
              {step === 0 ? 'Cancel' : 'Back'}
            </Button>
            {step < 3 ? (
              <Button
                type='button'
                className='flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-semibold min-w-0 shadow-lg hover:shadow-xl py-3 px-6 rounded-2xl transition-all duration-300 group'
                onClick={async () => {
                  // Validate required fields for the current step
                  let requiredFields: (keyof BankAccountForm)[] = [];
                  if (step === 0)
                    requiredFields = [
                      'country',
                      'asset',
                      'instant_payment_type',
                    ];
                  if (step === 1)
                    requiredFields = [
                      'instant_payment',
                      'bank_name',
                      'account',
                    ];
                  if (step === 2)
                    requiredFields = [
                      'city',
                      'state',
                      'postal_code',
                      'street_line',
                    ];
                  const values = getValues();
                  const allFilled = requiredFields.every(
                    (f) => values[f] && String(values[f]).trim() !== '',
                  );
                  if (!allFilled) {
                    toast.error(
                      'Please fill in all required fields before proceeding.',
                    );
                    return;
                  }

                  // Fix bug: clear automatic fields when advancing
                  if (step === 0) {
                    // When leaving the FIAT step, clear only the next step (Account Details) and Address fields
                    setValue('instant_payment', '');
                    setValue('bank_name', '');
                    setValue('branch', '');
                    setValue('account', '');
                    setValue('name', '');
                    setValue('city', '');
                    setValue('state', '');
                    setValue('postal_code', '');
                    setValue('street_line', '');
                    setValue('instant_payment', '');
                  }
                  if (step === 1) {
                    // When leaving the Account Details step, clear only the next step (Address) fields
                    setValue('city', '');
                    setValue('state', '');
                    setValue('postal_code', '');
                    setValue('street_line', '');
                  }
                  setStep(step + 1);
                }}
                disabled={isSubmitting || mutation.isPending}
              >
                <span className="flex items-center justify-center gap-2">
                  Next Step
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <title>Next</title>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Button>
            ) : (
              <Button
                type='button'
                className='flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold min-w-0 shadow-lg hover:shadow-xl py-3 px-6 rounded-2xl transition-all duration-300 group'
                disabled={isSubmitting || mutation.isPending}
                onClick={async () => {
                  const valid = await trigger();
                  if (valid) handleSubmit(onSubmit)();
                }}
              >
                {isSubmitting || mutation.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                    Confirming...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <title>Confirm</title>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Confirm Account
                  </span>
                )}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
