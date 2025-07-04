import React from 'react';
import {
  User,
  Mail,
  Phone,
  Globe,
  MapPin,
  CreditCard,
  IdCard,
  Home,
} from 'lucide-react';
import { getCountryName } from '@/lib/country-utils';

interface ProfileViewProps {
  local: {
    name?: string;
    email?: string;
    taxIdNumber?: string;
    taxIdType?: string;
    localIdType?: string;
    localIdNumber?: string;
    accountid?: string; // renomeado
    country?: string;
    city?: string;
    address?: string;
    post_code?: string;
    phone?: string;
    // ...outros campos
    id?: string; // para compatibilidade
  };
}

export const ProfileView: React.FC<ProfileViewProps> = ({ local }) => {
  // Garante que accountid seja puxado de local.id
  const accountid = local.accountid || local.id || '-';
  return (
    <div className='bg-white/95 rounded-2xl shadow-lg p-8 border border-primary/10 max-w-2xl mx-auto flex flex-col gap-8'>
      {/* Dados Pessoais */}
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-8'>
        {/* Avatar à esquerda */}
        <div className='flex-shrink-0 flex items-center justify-center w-20 h-20 rounded-full bg-primary/10'>
          <User className='text-primary w-12 h-12' />
        </div>
        {/* Dados à direita */}
        <div className='flex-1 flex flex-col gap-2 md:items-start items-center text-center md:text-left'>
          <div className='font-bold text-2xl text-main leading-tight'>
            {local.name || '-'}
          </div>
          <div className='flex items-center gap-2 text-muted-foreground text-sm justify-center md:justify-start'>
            <Mail className='w-4 h-4' />
            {local.email || '-'}
          </div>
          <div className='flex items-center gap-2 text-muted-foreground text-sm justify-center md:justify-start'>
            <Phone className='w-4 h-4' />
            {local.phone || '-'}
          </div>
        </div>
      </div>
      {/* Account ID abaixo do bloco de dados pessoais */}
      <div className='flex items-center gap-1 mt-2 self-center justify-center'>
        <span className='text-xs font-bold text-primary select-all font-mono'>
          {accountid}
        </span>
        <button
          type='button'
          className='p-1 rounded hover:bg-primary/10 transition'
          title='Copy Account ID'
          onClick={() => {
            navigator.clipboard.writeText(accountid);
          }}
        >
          {/* <KeyRound className="w-3 h-3 text-primary" /> */}
        </button>
      </div>
      {/* Documentos em cards modernos */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Card CPF/CNPJ/RFC... */}
        <div className='bg-white rounded-xl border border-primary/10 shadow flex flex-col gap-2 p-4 items-start'>
          <div className='flex items-center gap-2 mb-1'>
            <CreditCard className='text-primary w-5 h-5' />
            <span className='text-xs font-semibold text-primary uppercase tracking-wider'>
              {local.taxIdType || '-'}
            </span>
          </div>
          <span className='text-lg font-mono font-bold text-main break-all'>
            {local.taxIdNumber || '-'}
          </span>
        </div>
        {/* Card Passport/National ID... */}
        <div className='bg-white rounded-xl border border-primary/10 shadow flex flex-col gap-2 p-4 items-start'>
          <div className='flex items-center gap-2 mb-1'>
            <IdCard className='text-primary w-5 h-5' />
            <span className='text-xs font-semibold text-primary uppercase tracking-wider'>
              {local.localIdType || '-'}
            </span>
          </div>
          <span className='text-lg font-mono font-bold text-main break-all'>
            {local.localIdNumber || '-'}
          </span>
        </div>
      </div>
      {/* Endereço */}
      <div className='bg-white/80 rounded-xl shadow p-6 border border-primary/10 flex flex-col gap-3'>
        <div className='flex items-center gap-2 mb-2'>
          <Home className='text-primary w-5 h-5' />
          <span className='font-semibold text-main text-lg'>Address</span>
        </div>
        <div className='flex items-center gap-2'>
          <Globe className='text-primary w-4 h-4' />
          <span className='text-main'>{getCountryName(local.country)}</span>
        </div>
        <div className='flex items-center gap-2'>
          <MapPin className='text-primary w-4 h-4' />
          <span className='text-main'>{local.city || '-'}</span>
        </div>
        <div className='flex items-center gap-2'>
          <MapPin className='text-primary w-4 h-4' />
          <span className='text-main'>{local.address || '-'}</span>
        </div>
        {local.post_code && (
          <div className='flex items-center gap-2'>
            <CreditCard className='text-primary w-4 h-4' />
            <span className='text-main'>{local.post_code}</span>
          </div>
        )}
      </div>
    </div>
  );
};
