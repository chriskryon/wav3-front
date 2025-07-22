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
import { Controller } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { registerBankAccount } from '@/services/bank-account-api-service';

// ISO 3166-1 alpha-2 codes
const countries = [
  { value: 'BR', label: 'Brasil', paymentMethod: 'PIX', symbol: 'BRL' },
  { value: 'MX', label: 'México', paymentMethod: 'SPEI', symbol: 'MXN' },
  {
    value: 'US',
    label: 'Estados Unidos',
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
  // Estado para país selecionado
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
        bank_name: data.bank_name,
        account_number: data.account,
        account_type: data.asset,
        instant_payment: data.instant_payment,
        instant_payment_type: data.instant_payment_type,
        city: data.city,
        state: data.state,
        postal_code: data.postal_code,
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

  // Stepper icon color logic
  const getStepIcon = (
    icon: React.ReactNode,
    active: boolean,
    future: boolean,
  ) => (
    <span
      className={`flex items-center justify-center rounded-full border-2 transition-all duration-200 shadow-md ${active ? 'bg-primary text-white border-primary scale-110' : 'bg-white/80 text-primary border-primary/30'} ${future ? 'opacity-40' : ''}`}
      style={{ width: 36, height: 36 }}
    >
      {React.isValidElement(icon)
        ? React.cloneElement(icon as React.ReactElement<any>, {
            className: `w-6 h-6 transition-all duration-200 ${active ? 'text-white' : 'text-primary'}`,
            fill: active ? 'currentColor' : 'none',
          })
        : icon}
    </span>
  );
  // Steps como componentes independentes para inputs isolados
  const StepFiat = () => {
    return (
      <>
        {/* País */}
        <div className='relative'>
          <Label className='text-sm font-medium muted-text'>País *</Label>
          <Controller
            name='country'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <div className='relative mt-1'>
                <select
                  {...field}
                  className='glass-input w-full pl-3 pr-8 py-2 rounded-lg border border-primary/20 focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-all duration-200 shadow-sm appearance-none bg-white/80 text-main'
                  required
                >
                  <option value=''>Selecione</option>
                  {countries.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <span className='pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-primary/60'>
                  ▼
                </span>
              </div>
            )}
          />
        </div>
        {/* Symbol (asset) - preenchido automaticamente */}
        <div className='relative mt-4'>
          <Label className='text-sm font-medium muted-text'>Symbol *</Label>
          <Controller
            name='asset'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Input
                {...field}
                className='glass-input mt-1 pl-3 bg-white/80 text-main'
                required
                disabled
              />
            )}
          />
        </div>
        <div className='relative mt-4'>
          <Label className='text-sm font-medium muted-text'>
            Payment Method *
          </Label>
          <Controller
            name='instant_payment_type'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Input
                {...field}
                className='glass-input mt-1 pl-3 bg-white/80 text-main'
                required
                disabled
              />
            )}
          />
        </div>
      </>
    );
  };

  const StepAccountDetails = () => {
    return (
      <>
        {/* Apelido/Nome da conta */}
        <div className='relative'>
          <Label className='text-sm font-medium muted-text'>
            Nome da Conta
          </Label>
          <Controller
            name='name'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder='Ex: Main Account, Investments Account, etc'
                className='glass-input mt-1 pl-3 focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all duration-200 shadow-sm'
                required
              />
            )}
          />
        </div>
        {/* Chave de Pagamento Instantâneo */}
        <div className='relative mt-4'>
          <Label className='text-sm font-medium muted-text'>
            {(() => {
              const country = getValues('country');
              if (country === 'BR') return 'Chave PIX *';
              if (country === 'MX') return 'Cuenta SPEI *';
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
              if (country === 'BR') placeholder = 'Ex: 11999999999, CPF, e-mail, CNPJ...';
              else if (country === 'MX') placeholder = 'Ex: 123456789012345678';
              else if (country === 'US') placeholder = 'Ex: 021000021';
              else placeholder = 'Digite o identificador do pagamento instantâneo';
              return (
          <Input
            {...field}
            placeholder={placeholder}
            className='glass-input mt-1 pl-3 focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all duration-200 shadow-sm'
            required
          />
              );
            }}
          />
        </div>
        {/* Banco */}
        <div className='relative mt-4'>
          <Label className='text-sm font-medium muted-text'>Banco *</Label>
          <Controller
            name='bank_name'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder='Nome do banco'
                className='glass-input mt-1 pl-3 focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all duration-200 shadow-sm'
                required
              />
            )}
          />
        </div>
        {/* Agência e Conta */}
        <div className='flex flex-col sm:flex-row gap-3 mt-4'>
          <div className='flex-1'>
            <Label className='text-sm font-medium muted-text'>Agência</Label>
            <Controller
              name='branch'
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder='Agência'
                  className='glass-input mt-1 pl-3 focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all duration-200 shadow-sm'
                />
              )}
            />
          </div>
          <div className='flex-1'>
            <Label className='text-sm font-medium muted-text'>Conta *</Label>
            <Controller
              name='account'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder='Número da conta'
                  className='glass-input mt-1 pl-3 focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all duration-200 shadow-sm'
                  required
                />
              )}
            />
          </div>
        </div>
      </>
    );
  };

  const StepAddress = () => {
    return (
      <>
        {/* Endereço */}
        <div className='flex flex-col sm:flex-row gap-3 mt-4'>
          <div className='flex-1'>
            <Label className='text-sm font-medium muted-text'>Cidade</Label>
            <Controller
              name='city'
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder='Cidade'
                  className='glass-input mt-1 pl-3 focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all duration-200 shadow-sm'
                />
              )}
            />
          </div>
          <div className='flex-1'>
            <Label className='text-sm font-medium muted-text'>Estado</Label>
            <Controller
              name='state'
              control={control}
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
                    {
                      code: 'UM',
                      name: 'United States Minor Outlying Islands',
                    },
                    { code: 'VI', name: 'Virgin Islands, U.S.' },
                  ];
                  return (
                    <select
                      {...field}
                      className='glass-input w-full pl-3 pr-8 py-2 rounded-lg border border-primary/20 focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-all duration-200 shadow-sm appearance-none bg-white/80 text-main'
                      required
                    >
                      <option value=''>Selecione</option>
                      {subdivisions.map((opt) => (
                        <option key={opt.code} value={opt.code}>
                          {opt.name}
                        </option>
                      ))}
                    </select>
                  );
                }
                // Para outros países, campo texto
                return (
                  <Input
                    {...field}
                    placeholder='Estado'
                    className='glass-input mt-1 pl-3 focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all duration-200 shadow-sm'
                  />
                );
              }}
            />
          </div>
          <div className='flex-1'>
            <Label className='text-sm font-medium muted-text'>CEP</Label>
            <Controller
              name='postal_code'
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder='CEP'
                  className='glass-input mt-1 pl-3 focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all duration-200 shadow-sm'
                />
              )}
            />
          </div>
        </div>
        <div className='relative mt-3'>
          <Label className='text-sm font-medium muted-text'>Endereço</Label>
          <Controller
            name='street_line'
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder='Rua, número, complemento'
                className='glass-input mt-1 pl-3 focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all duration-200 shadow-sm'
              />
            )}
          />
        </div>
      </>
    );
  };

  const StepOverview = () => {
    // Descobre o payment method pelo país selecionado
    const countryObj = countries.find((c) => c.value === getValues('country'));
    const paymentMethod = countryObj
      ? countryObj.paymentMethod
      : getValues('instant_payment_type');
    return (
      <div className='flex flex-col gap-4'>
        {/* Card FIAT */}
        <div className='rounded-xl bg-gradient-to-br from-[#e6f7f8] via-white to-[#f0fafd] border border-[#1ea3ab]/10 shadow p-4 flex flex-col gap-1'>
          <div className='flex items-center gap-2 mb-2'>
            <Landmark className='w-5 h-5 text-[#1ea3ab]' />
            <span className='font-semibold text-[#1ea3ab] text-sm'>FIAT</span>
          </div>
          <div className='flex flex-wrap gap-x-6 gap-y-1 text-xs text-main'>
            <div>
              <b>País:</b> {getValues('country')}
            </div>
            <div>
              <b>Symbol:</b> {getValues('asset')}
            </div>
            <div>
              <b>Payment Method:</b> {getValues('instant_payment_type')}
            </div>
          </div>
        </div>
        {/* Card Account Details */}
        <div className='rounded-xl bg-gradient-to-br from-[#e6f7f8] via-white to-[#f0fafd] border border-[#1ea3ab]/10 shadow p-4 flex flex-col gap-1'>
          <div className='flex items-center gap-2 mb-2'>
            <Banknote className='w-5 h-5 text-[#1ea3ab]' />
            <span className='font-semibold text-[#1ea3ab] text-sm'>
              Account Details
            </span>
          </div>
          <div className='flex flex-wrap gap-x-6 gap-y-1 text-xs text-main'>
            <div>
              <b>Nickname:</b> {getValues('name')}
            </div>
            <div>
              <b>Bank:</b> {getValues('bank_name')}
            </div>
            <div>
              <b>Branch:</b> {getValues('branch')}
            </div>
            <div>
              <b>Account:</b> {getValues('account')}
            </div>
            <div>
              <b>Instant Payment:</b> {getValues('instant_payment_type')}: {' '}
              {getValues('instant_payment')}
            </div>
          </div>
        </div>
        {/* Card Address */}
        <div className='rounded-xl bg-gradient-to-br from-[#e6f7f8] via-white to-[#f0fafd] border border-[#1ea3ab]/10 shadow p-4 flex flex-col gap-1'>
          <div className='flex items-center gap-2 mb-2'>
            <MapPin className='w-5 h-5 text-[#1ea3ab]' />
            <span className='font-semibold text-[#1ea3ab] text-sm'>
              Endereço
            </span>
          </div>
          <div className='flex flex-wrap gap-x-6 gap-y-1 text-xs text-main'>
            <div>
              <b>Cidade:</b> {getValues('city')}
            </div>
            <div>
              <b>Estado:</b> {getValues('state')}
            </div>
            <div>
              <b>CEP:</b> {getValues('postal_code')}
            </div>
            <div>
              <b>Endereço:</b> {getValues('street_line')}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Função para converter o form para o payload correto
  function toRegisterBankAccountPayload(data: BankAccountForm) {
    return {
      asset: data.asset,
      name: data.name,
      bank_name: data.bank_name,
      branch: data.branch,
      country: data.country, // já está ISO
      account: data.account,
      instant_payment: data.instant_payment,
      instant_payment_type: data.instant_payment_type,
      city: data.city,
      postal_code: data.postal_code,
      state: data.state,
      street_line: data.street_line,
    };
  }

  const onSubmit = (data: BankAccountForm) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className='w-full max-w-md min-w-[320px] md:min-w-[380px] max-h-[90vh] min-h-[420px] flex flex-col justify-between p-0 border-0 shadow-xl bg-white'
        style={{
          boxSizing: 'border-box',
          borderRadius: 18,
          background: '#fff',
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(255,255,255,0.95)',
        }}
      >
        <DialogHeader className='px-6 pt-6 pb-2'>
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
          className='flex flex-col gap-6 px-4 sm:px-6 pb-6 w-full flex-1 min-h-[320px]'
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Stepper */}
          <div className='flex items-center justify-center gap-0 mb-4 w-full'>
            {/* Stepper manual, já que steps[] não existe mais */}
            {/* Stepper moderno, sem linhas, com destaque de cor e animação */}
            <div className='flex items-center justify-center gap-2 w-full'>
              {[0, 1, 2, 3].map((i) => {
                const icons = [Landmark, Banknote, MapPin, CreditCard];
                const labels = [
                  'FIAT',
                  'Account Details',
                  'Address',
                  'Overview',
                ];
                const Icon = icons[i];
                const isActive = i === step;
                return (
                  <div
                    key={labels[i]}
                    className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl relative select-none transition-all duration-200 ${isActive ? 'scale-110 bg-[#e6f7f8] shadow-lg border border-[#1ea3ab]/60' : 'bg-white/80 border border-[#1ea3ab]/10'}`}
                    style={{
                      minWidth: 56,
                      minHeight: 56,
                      maxWidth: 64,
                      maxHeight: 64,
                      cursor: 'default',
                    }}
                  >
                    <div className='flex items-center justify-center mb-1'>
                      <Icon
                        className={`w-7 h-7 transition-all duration-200 ${isActive ? 'text-[#1ea3ab]' : 'text-[#3d8887]/60'}`}
                      />
                    </div>
                    <span
                      className={`text-[10px] font-bold text-center leading-tight break-words w-full mt-1 ${isActive ? 'text-[#1ea3ab]' : 'text-gray-500'}`}
                    >
                      {labels[i]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Step fields - renderiza apenas o step atual, inputs totalmente independentes */}
          <div className='w-full max-w-full flex-1 min-h-[120px] flex flex-col justify-center bg-white/70 rounded-xl shadow-inner p-3 border border-[#1ea3ab]/10'>
            <div className='flex flex-col gap-3 w-full max-w-full'>
              {step === 0 && <StepFiat />}
              {step === 1 && <StepAccountDetails />}
              {step === 2 && <StepAddress />}
              {step === 3 && <StepOverview />}
            </div>
          </div>
          {/* Actions */}
          <div className='flex gap-2 pt-3 w-full flex-col sm:flex-row'>
            <Button
              type='button'
              variant='outline'
              onClick={() =>
                step === 0 ? onOpenChange(false) : setStep(step - 1)
              }
              className='flex-1 min-w-0 border border-[#1ea3ab]/30 bg-white/80 text-[#1ea3ab] hover:bg-[#1ea3ab]/10 hover:text-[#1ea3ab] shadow-sm'
              disabled={isSubmitting || mutation.isPending}
            >
              {step === 0 ? 'Cancelar' : 'Voltar'}
            </Button>
            {step < 3 ? (
              <Button
                type='button'
                className='flex-1 bg-[#1ea3ab] hover:bg-[#1ea3ab]/90 text-white font-semibold min-w-0 shadow-md'
                onClick={async () => {
                  // Validação dos campos do step atual
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
                      'Preencha todos os campos obrigatórios antes de avançar.',
                    );
                    return;
                  }

                  // Corrige bug: limpa campos automáticos ao avançar
                  if (step === 0) {
                    // Ao sair do step FIAT, limpa apenas os campos do próximo step (Account Details) e Address
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
                    // Ao sair do step Account Details, limpa apenas os campos do próximo step (Address)
                    setValue('city', '');
                    setValue('state', '');
                        setValue('postal_code', '');
                        setValue('street_line', '');
                      }
                  setStep(step + 1);
                }}
                disabled={isSubmitting || mutation.isPending}
              >
                Avançar
              </Button>
            ) : (
              <Button
                type='button'
                className='flex-1 bg-[#1ea3ab] hover:bg-[#1ea3ab]/90 text-white font-semibold min-w-0 shadow-md'
                disabled={isSubmitting || mutation.isPending}
                onClick={async () => {
                  const valid = await trigger();
                  if (valid) handleSubmit(onSubmit)();
                }}
              >
                {isSubmitting || mutation.isPending ? (
                  <>
                    <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2' />
                    Confirmando...
                  </>
                ) : (
                  'CONFIRMAR'
                )}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
