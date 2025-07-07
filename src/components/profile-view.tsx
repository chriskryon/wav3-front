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
    <div className="glass-card-enhanced rounded-2xl shadow-lg p-0 border border-wav3 max-w-xl mx-auto flex flex-col gap-2 overflow-hidden">
      {/* Personal Data Modern Card */}
      <div className="flex flex-row items-center gap-4 px-5 py-4 bg-gradient-to-r from-[#e6f7f8] via-white to-[#f0fafd] border-b border-wav3 glass-card-enhanced/80">
        {/* Avatar */}
        <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 shadow">
          <User className="text-primary w-7 h-7" />
        </div>
        {/* Data */}
        <div className="flex-1 flex flex-col gap-0.5 items-start">
          <div className="font-bold text-base text-main leading-tight">
            {local.name || '-'}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <Mail className="w-4 h-4" />
            {local.email || '-'}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <Phone className="w-4 h-4" />
            {local.phone || '-'}
          </div>
        </div>
      </div>
      {/* Account ID below personal data */}
      <div className="flex items-center gap-1 mt-1 self-center justify-center px-5">
        <span className="text-xs font-bold text-primary select-all font-mono">{accountid}</span>
        <button
          type="button"
          className="p-1 rounded hover:bg-primary/10 transition"
          title="Copy Account ID"
          onClick={() => {
            navigator.clipboard.writeText(accountid);
          }}
        >
          {/* <KeyRound className="w-3 h-3 text-primary" /> */}
        </button>
      </div>
      {/* Documents in modern cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 px-5">
        {/* Tax ID Card */}
        <div className="glass-card-enhanced/80 rounded-xl border border-wav3 shadow flex flex-col gap-0.5 p-2 items-start">
          <div className="flex items-center gap-2 mb-0.5">
            <CreditCard className="text-primary w-5 h-5" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              {local.taxIdType || '-'}
            </span>
          </div>
          <span className="text-sm font-mono font-bold text-main break-all">
            {local.taxIdNumber || '-'}
          </span>
        </div>
        {/* Local ID Card */}
        <div className="glass-card-enhanced/80 rounded-xl border border-wav3 shadow flex flex-col gap-0.5 p-2 items-start">
          <div className="flex items-center gap-2 mb-0.5">
            <IdCard className="text-primary w-5 h-5" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              {local.localIdType || '-'}
            </span>
          </div>
          <span className="text-sm font-mono font-bold text-main break-all">
            {local.localIdNumber || '-'}
          </span>
        </div>
      </div>
      {/* Address */}
      <div className="glass-card-enhanced/80 rounded-xl shadow p-3 border border-wav3 flex flex-col gap-1 mx-5 mb-3">
        <div className="flex items-center gap-2 mb-0.5">
          <Home className="text-primary w-5 h-5" />
          <span className="font-semibold text-main text-sm">Address</span>
        </div>
        <div className="flex items-center gap-2">
          <Globe className="text-primary w-4 h-4" />
          <span className="text-main">{getCountryName(local.country)}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="text-primary w-4 h-4" />
          <span className="text-main">{local.city || '-'}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="text-primary w-4 h-4" />
          <span className="text-main">{local.address || '-'}</span>
        </div>
        {local.post_code && (
          <div className="flex items-center gap-2">
            <CreditCard className="text-primary w-4 h-4" />
            <span className="text-main">{local.post_code}</span>
          </div>
        )}
      </div>
    </div>
  );
};
