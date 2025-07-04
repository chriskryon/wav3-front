'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { Save, User, MapPin, Phone, CreditCard, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  createAccount,
  setUserGlobal,
  getBetaAccountDetail,
} from '@/services/api-service';
import { useForm } from 'react-hook-form';
import { ProfileView } from '@/components/profile-view';
import { useUser } from '@/hooks/useUser';

export default function ProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { user: userData } = useUser();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      tax_id_number: '',
      tax_id_type: '',
      email: '',
      full_name: '',
      country: '',
      local_id_type: '',
      local_id_number: '',
      post_code: '',
      city: '',
      address: '',
      phone: '',
    },
  });

  useEffect(() => {
    if (userData) {
      setValue('full_name', userData.name || '');
      setValue('email', userData.email || '');
    }
  }, [userData, setValue]);

  // Checa se perfil está completo
  const profileCompleted = userData?.hasBetaAccount === true;
  const account = userData?.account || {};

  if (profileCompleted) {
    return (
      <div className='content-height p-8 scroll-area bg-background'>
        <div className='max-w-4xl mx-auto space-y-6'>
          <div className='text-center mb-2'></div>
          <ProfileView local={account} />
        </div>
      </div>
    );
  }

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      console.log('Submitting profile data:', data);
      const user_id = userData?.id;
      if (!user_id) throw new Error('Usuário não autenticado');
      const payload = {
        user_id,
        tax_id_number: data.tax_id_number,
        tax_id_type: data.tax_id_type,
        country: data.country,
        local_id_type: data.local_id_type || undefined,
        local_id_number: data.local_id_number || undefined,
        post_code: data.post_code || undefined,
        city: data.city || undefined,
        address: data.address || undefined,
        phone: data.phone || undefined,
        email: data.email,
        name: data.full_name,
      };
      const result = await createAccount(payload);

      if (result.success && result.data) {
        // Atualiza token e Zustand/localStorage
        if (result.data.token) localStorage.setItem('token', result.data.token);
        let userToStore = {
          ...result.data.user,
          hasBetaAccount: result.data.hasBetaAccount ?? true,
        };
        // Busca detalhes da subconta Beta e adiciona ao estado global
        try {
          const betaAccount = await getBetaAccountDetail();
          userToStore = { ...userToStore, account: betaAccount };
        } catch (e) {
          console.error(
            'Erro ao buscar detalhes da subconta Beta após criação:',
            e,
          );
        }
        setUserGlobal(userToStore);
        toast.success('Conta criada com sucesso!');
        router.push('/');
        window.location.reload();
      } else if (result.message === 'Conta já existente') {
        toast.error('Conta já existe para este usuário.');
      } else if (result.message) {
        toast.error(result.message);
      } else {
        toast.error('Erro desconhecido ao criar conta. Tente novamente.');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const countries = [
    { code: 'BR', name: 'Brazil' },
    { code: 'MX', name: 'Mexico' },
    { code: 'AR', name: 'Argentina' },
    { code: 'CO', name: 'Colombia' },
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
  ];

  const taxIdTypes = {
    BR: [
      { value: 'CPF', label: 'CPF' },
      { value: 'CNPJ', label: 'CNPJ' },
    ],
    MX: [{ value: 'RFC', label: 'RFC' }],
    AR: [{ value: 'CUIT', label: 'CUIT' }],
    CO: [{ value: 'NIT', label: 'NIT' }],
  };

  const localIdTypes = [
    { value: 'passport', label: 'Passport' },
    { value: 'national_id', label: 'National ID' },
    { value: 'drivers_license', label: "Driver's License" },
    { value: 'foreigner_id', label: 'Foreigner ID Card' },
  ];

  return (
    <div className='content-height p-8 scroll-area bg-background'>
      <div className='max-w-4xl mx-auto space-y-8'>
        {/* Header */}
        <div className='text-center'>
          <div className='w-20 h-20 rounded-2xl bg-primary text-white flex items-center justify-center mx-auto mb-4 shadow-lg'>
            <User className='w-10 h-10' />
          </div>
          <h1 className='text-3xl font-bold text-main'>
            Complete Your Profile
          </h1>
          <p className='muted-text text-lg mt-2'>
            Please provide your information to comply with KYC requirements
          </p>
        </div>
        <Card className='glass-card-enhanced'>
          <CardHeader>
            <CardTitle className='text-xl font-bold text-main flex items-center gap-3'>
              <CreditCard className='w-6 h-6 text-primary' />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
              {/* Basic Information */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-2'>
                  <Label
                    htmlFor='full_name'
                    className='text-sm font-medium muted-text'
                  >
                    Full Name *
                  </Label>
                  <Input
                    id='full_name'
                    type='text'
                    placeholder='Enter your full name'
                    {...register('full_name', { required: true })}
                    className='glass-input h-12'
                    disabled
                  />
                  {errors.full_name && (
                    <span className='text-red-500 text-xs'>Required</span>
                  )}
                </div>
                <div className='space-y-2'>
                  <Label
                    htmlFor='email'
                    className='text-sm font-medium muted-text'
                  >
                    Email *
                  </Label>
                  <Input
                    id='email'
                    type='email'
                    placeholder='Enter your email'
                    {...register('email', { required: true })}
                    className='glass-input h-12'
                    disabled
                  />
                  {errors.email && (
                    <span className='text-red-500 text-xs'>Required</span>
                  )}
                </div>
              </div>

              {/* Country and Tax Information */}
              <div className='space-y-6'>
                <div className='flex items-center gap-3 mb-4'>
                  <Globe className='w-5 h-5 text-primary' />
                  <h3 className='text-lg font-semibold text-main'>
                    Country & Tax Information
                  </h3>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  <div className='space-y-2'>
                    <Label
                      htmlFor='country'
                      className='text-sm font-medium muted-text'
                    >
                      Country *
                    </Label>
                    <Select
                      value={watch('country')}
                      onValueChange={(value) => {
                        setValue('country', value);
                        setValue('tax_id_type', '');
                      }}
                      disabled={userData?.profileCompleted}
                    >
                      <SelectTrigger className='glass-input h-12'>
                        <SelectValue placeholder='Select country' />
                      </SelectTrigger>
                      <SelectContent className='glass-card-enhanced'>
                        {countries.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.country && (
                      <span className='text-red-500 text-xs'>Required</span>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <Label
                      htmlFor='tax_id_type'
                      className='text-sm font-medium muted-text'
                    >
                      Tax ID Type *
                    </Label>
                    <Select
                      value={watch('tax_id_type')}
                      onValueChange={(value) => setValue('tax_id_type', value)}
                      disabled={!watch('country') || userData?.profileCompleted}
                    >
                      <SelectTrigger className='glass-input h-12'>
                        <SelectValue placeholder='Select tax ID type' />
                      </SelectTrigger>
                      <SelectContent className='glass-card-enhanced'>
                        {watch('country') &&
                          taxIdTypes[
                            watch('country') as keyof typeof taxIdTypes
                          ]?.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    {errors.tax_id_type && (
                      <span className='text-red-500 text-xs'>Required</span>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <Label
                      htmlFor='tax_id_number'
                      className='text-sm font-medium muted-text'
                    >
                      Tax ID Number *
                    </Label>
                    <Input
                      id='tax_id_number'
                      type='text'
                      placeholder='Enter tax ID number'
                      {...register('tax_id_number', { required: true })}
                      className='glass-input h-12'
                      disabled={userData?.profileCompleted}
                    />
                    {errors.tax_id_number && (
                      <span className='text-red-500 text-xs'>Required</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Local ID Information */}
              <div className='space-y-6'>
                <div className='flex items-center gap-3 mb-4'>
                  <CreditCard className='w-5 h-5 text-primary' />
                  <h3 className='text-lg font-semibold text-main'>
                    Local ID Information
                  </h3>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='space-y-2'>
                    <Label
                      htmlFor='local_id_type'
                      className='text-sm font-medium muted-text'
                    >
                      Local ID Type
                    </Label>
                    <Select
                      value={watch('local_id_type')}
                      onValueChange={(value) =>
                        setValue('local_id_type', value)
                      }
                      disabled={userData?.profileCompleted}
                    >
                      <SelectTrigger className='glass-input h-12'>
                        <SelectValue placeholder='Select ID type' />
                      </SelectTrigger>
                      <SelectContent className='glass-card-enhanced'>
                        {localIdTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='space-y-2'>
                    <Label
                      htmlFor='local_id_number'
                      className='text-sm font-medium muted-text'
                    >
                      Local ID Number *
                    </Label>
                    <Input
                      id='local_id_number'
                      type='text'
                      placeholder='Enter ID number'
                      {...register('local_id_number', { required: true })}
                      className='glass-input h-12'
                      disabled={userData?.profileCompleted}
                    />
                    {errors.local_id_number && (
                      <span className='text-red-500 text-xs'>Required</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className='space-y-6'>
                <div className='flex items-center gap-3 mb-4'>
                  <MapPin className='w-5 h-5 text-primary' />
                  <h3 className='text-lg font-semibold text-main'>
                    Address Information
                  </h3>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='space-y-2'>
                    <Label
                      htmlFor='address'
                      className='text-sm font-medium muted-text'
                    >
                      Address
                    </Label>
                    <Input
                      id='address'
                      type='text'
                      placeholder='Enter your address'
                      {...register('address')}
                      className='glass-input h-12'
                      disabled={userData?.profileCompleted}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label
                      htmlFor='city'
                      className='text-sm font-medium muted-text'
                    >
                      City
                    </Label>
                    <Input
                      id='city'
                      type='text'
                      placeholder='Enter your city'
                      {...register('city')}
                      className='glass-input h-12'
                      disabled={userData?.profileCompleted}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label
                      htmlFor='post_code'
                      className='text-sm font-medium muted-text'
                    >
                      Postal Code
                    </Label>
                    <Input
                      id='post_code'
                      type='text'
                      placeholder='Enter postal code'
                      {...register('post_code')}
                      className='glass-input h-12'
                      disabled={userData?.profileCompleted}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label
                      htmlFor='phone'
                      className='text-sm font-medium muted-text'
                    >
                      Phone Number
                    </Label>
                    <div className='relative'>
                      <Phone className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 muted-text' />
                      <Input
                        id='phone'
                        type='tel'
                        placeholder='+1 (555) 123-4567'
                        {...register('phone')}
                        className='pl-10 glass-input h-12'
                        disabled={userData?.profileCompleted}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className='flex justify-center pt-6'>
                <Button
                  type='submit'
                  disabled={isLoading || userData?.profileCompleted}
                  className='w-full md:w-auto px-12 h-12 bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300'
                >
                  {isLoading ? (
                    <>
                      <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2' />
                      Saving Profile...
                    </>
                  ) : (
                    <>
                      <Save className='w-5 h-5 mr-2' />
                      Complete Profile
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
