'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { Save, User, MapPin, Phone, CreditCard, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ProfileSelect,
  ProfileSelectItem,
} from '@/components/ui/profile-select';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  setUserGlobal,
  getBetaAccountDetail,
} from '@/services/api-service';
import { useForm } from 'react-hook-form';
import { ProfileView } from '@/components/profile-view';
import { useUser } from '@/hooks/useUser';
import { createAccount } from '@/services/account-api-service';

// KYC Test Warning Card
function KycTestWarningCard() {
  return (
    <div className="mb-8">
      <div className="rounded-xl border border-yellow-400 bg-yellow-50 p-4 flex items-center gap-4 shadow-sm animate-pulse-slow">
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="orange" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <title>KYC Warning</title>
        </svg>
        <div>
          <div className="font-semibold text-yellow-800 mt-1">
            Test Environment: Fill KYC with fake/test data only.<br />
            <span className="font-normal text-yellow-700 text-sm">Do not use real personal information in this environment.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

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
  const [kycCompleted, setKycCompleted] = useState(profileCompleted);

  useEffect(() => {
    setKycCompleted(profileCompleted);
  }, [profileCompleted]);

  if (kycCompleted) {
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
      const user_id = userData?.id;
      if (!user_id) throw new Error('User not authenticated');
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

      if (result?.id) {
        // Account created successfully, result is the CreateAccountResponse
        let userToStore = {
          ...userData,
          hasBetaAccount: true,
        };
        try {
          const betaAccount = await getBetaAccountDetail();
          userToStore = { ...userToStore, account: betaAccount };
        } catch (e) {
          console.error(
            'Error fetching Beta subaccount details after creation:',
            e,
          );
        }
        setUserGlobal(userToStore);
        setKycCompleted(true); // Instantly update for immediate UX
        toast.success('Account created successfully!');
        // Show loader overlay before hard reload
        setTimeout(() => {
          window.location.reload(); // Hard reload to update header/sidebar
        }, 1200); // 1.2s for user to see feedback
      } else if (result?.message === 'Conta já existente') {
        toast.error('Account already exists for this user.');
      } else if (result?.message) {
        toast.error(result.message);
      } else {
        toast.error('Unknown error creating account. Try again.');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const countries = [
    // Placeholder for select
    { code: '', name: 'Select Country' },
    { code: 'BR', name: 'Brazil' },
    { code: 'MX', name: 'Mexico' },
    { code: 'AR', name: 'Argentina' },
    { code: 'CO', name: 'Colombia' },
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
  ];

  // Tax ID types for each country
  const taxIdTypes = {
    BR: [
      { value: 'CPF', label: 'CPF' },
      { value: 'CNPJ', label: 'CNPJ' },
    ],
    MX: [
      { value: 'RFC', label: 'RFC' },
    ],
    AR: [
      { value: 'CUIT', label: 'CUIT' },
    ],
    CO: [
      { value: 'NIT', label: 'NIT' },
    ],
    US: [
      { value: 'SSN', label: 'SSN (Social Security Number)' },
      { value: 'EIN', label: 'EIN (Employer Identification Number)' },
      { value: 'ITIN', label: 'ITIN (Individual Taxpayer Identification Number)' },
    ],
    CA: [
      { value: 'SIN', label: 'SIN (Social Insurance Number)' },
      { value: 'BN', label: 'BN (Business Number)' },
    ],
  };

  const localIdTypes = [
    { value: 'passport', label: 'Passport' },
    { value: 'national_id', label: 'National ID' },
    { value: 'drivers_license', label: "Driver's License" },
    { value: 'foreigner_id', label: 'Foreigner ID Card' },
  ];

  return (
    <div className="content-height p-2 md:p-4 scroll-area bg-gradient-to-br from-[#e6f2f2] via-[#f8fafc] to-[#e6f2f2]">
      <div className="max-w-xl mx-auto space-y-4">
        <KycTestWarningCard />
        {/* Header */}
        <div className="text-center mb-1">
          <div className="w-12 h-12 rounded-xl bg-primary/80 text-white flex items-center justify-center mx-auto mb-1 shadow-lg backdrop-blur-md">
            <User className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-main">Complete Your Profile</h1>
          <p className="muted-text text-sm mt-1">Please provide your information to comply with KYC requirements</p>
        </div>
        <Card className="glass-card border border-primary/20 shadow-xl backdrop-blur-md">
          <CardHeader className="pb-1 px-4 pt-4">
            <CardTitle className="text-base font-bold text-main flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              {/* Basic Information */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                <div className="space-y-1">
                  <Label htmlFor="full_name" className="text-xs font-medium text-primary/80">
                    Full Name *
                  </Label>
                  <Input
                    id="full_name"
                    type="text"
                    placeholder="Enter your full name"
                    {...register('full_name', { required: true })}
                    className="glass-input h-10 text-sm px-3 bg-white/80 border border-primary/10 focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition"
                    disabled
                  />
                  {errors.full_name && (
                    <span className="text-red-500 text-xs">Required</span>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-xs font-medium text-primary/80">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    {...register('email', { required: true })}
                    className="glass-input h-10 text-sm px-3 bg-white/80 border border-primary/10 focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition"
                    disabled
                  />
                  {errors.email && (
                    <span className="text-red-500 text-xs">Required</span>
                  )}
                </div>
              </div>

              {/* Country and Tax Information */}
              <div className='space-y-4'>
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4 text-primary" />
                  <h3 className="text-base font-semibold text-main">Country & Tax Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="country" className="text-xs font-medium text-primary/80">
                      Country *
                    </Label>
                    <ProfileSelect
                      value={watch('country') || ''}
                      onValueChange={(value) => {
                        setValue('country', value);
                        setValue('tax_id_type', '');
                      }}
                      disabled={userData?.profileCompleted}
                    >
                      {/* Only render real countries as items, not the placeholder */}
                      {countries.filter(c => c.code !== '').map((country) => (
                        <ProfileSelectItem key={country.code} value={country.code}>
                          {country.name}
                        </ProfileSelectItem>
                      ))}
                    </ProfileSelect>
                    {errors.country && (
                      <span className="text-red-500 text-xs">Required</span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="tax_id_type" className="text-xs font-medium text-primary/80">
                      Tax ID Type *
                    </Label>
                    <ProfileSelect
                      value={
                        watch('tax_id_type') ||
                        (taxIdTypes[watch('country') as keyof typeof taxIdTypes]?.[0]?.value ?? '')
                      }
                      onValueChange={(value) => {
                        setValue('tax_id_type', value);
                        if (!value) {
                          const defaultType = taxIdTypes[watch('country') as keyof typeof taxIdTypes]?.[0]?.value;
                          setValue('tax_id_type', defaultType || '');
                        }
                      }}
                      disabled={!watch('country') || userData?.profileCompleted}
                    >
                      {(taxIdTypes[watch('country') as keyof typeof taxIdTypes] || []).map((type) => (
                        <ProfileSelectItem key={type.value} value={type.value}>
                          {type.label}
                        </ProfileSelectItem>
                      ))}
                    </ProfileSelect>
                    {errors.tax_id_type && (
                      <span className="text-red-500 text-xs">Required</span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="tax_id_number" className="text-xs font-medium text-primary/80">
                      Tax ID Number *
                    </Label>
                    <Input
                      id="tax_id_number"
                      type="text"
                      placeholder="Enter tax ID number"
                      {...register('tax_id_number', { required: true })}
                      className="glass-input h-10 text-sm px-3 bg-white/80 border border-primary/10 focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition"
                      disabled={userData?.profileCompleted}
                    />
                    {errors.tax_id_number && (
                      <span className="text-red-500 text-xs">Required</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Local ID Information */}
              <div className='space-y-4'>
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-4 h-4 text-primary" />
                  <h3 className="text-base font-semibold text-main">Local ID Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="local_id_type" className="text-xs font-medium muted-text">
                      Local ID Type
                    </Label>
                    <ProfileSelect
                      value={watch('local_id_type') || localIdTypes[0].value}
                      onValueChange={(value) => setValue('local_id_type', value)}
                      disabled={userData?.profileCompleted}
                    >
                      {localIdTypes.map((type) => (
                        <ProfileSelectItem key={type.value} value={type.value}>
                          {type.label}
                        </ProfileSelectItem>
                      ))}
                    </ProfileSelect>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="local_id_number" className="text-xs font-medium muted-text">
                      Local ID Number *
                    </Label>
                    <Input
                      id="local_id_number"
                      type="text"
                      placeholder="Enter ID number"
                      {...register('local_id_number', { required: true })}
                      className="glass-input h-10 text-sm px-3"
                      disabled={userData?.profileCompleted}
                    />
                    {errors.local_id_number && (
                      <span className="text-red-500 text-xs">Required</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className='space-y-4'>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <h3 className="text-base font-semibold text-main">Address Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="address" className="text-xs font-medium muted-text">
                      Address
                    </Label>
                    <Input
                      id="address"
                      type="text"
                      placeholder="Enter your address"
                      {...register('address')}
                      className="glass-input h-10 text-sm px-3"
                      disabled={userData?.profileCompleted}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="city" className="text-xs font-medium muted-text">
                      City
                    </Label>
                    <Input
                      id="city"
                      type="text"
                      placeholder="Enter your city"
                      {...register('city')}
                      className="glass-input h-10 text-sm px-3"
                      disabled={userData?.profileCompleted}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="post_code" className="text-xs font-medium muted-text">
                      Postal Code
                    </Label>
                    <Input
                      id="post_code"
                      type="text"
                      placeholder="Enter postal code"
                      {...register('post_code')}
                      className="glass-input h-10 text-sm px-3"
                      disabled={userData?.profileCompleted}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="phone" className="text-xs font-medium muted-text">
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 muted-text" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        {...register('phone')}
                        className="pl-8 glass-input h-10 text-sm px-3"
                        disabled={userData?.profileCompleted}
                      />
                    </div>
                  </div>
                </div>
              </div>

                {/* Submit Button */}
                <div className='flex justify-center pt-4'>
                <Button
                  type="submit"
                  disabled={isLoading || userData?.profileCompleted}
                  className="w-full md:w-auto px-8 h-10 bg-primary/80 text-white font-semibold shadow-lg hover:bg-primary/90 hover:shadow-xl transition-all duration-300"
                >
                  {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Saving Profile...
                  </>
                  ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
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
