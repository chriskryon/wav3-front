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
    id?: string; // para compatibilidade
  };
}

export const ProfileView: React.FC<ProfileViewProps> = ({ local }) => {
  const accountid = local.accountid || local.id || '-';
  
  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <div className="w-full max-w-2xl flex flex-col gap-4 glass-card-enhanced/95 border border-wav3/30 rounded-2xl shadow-xl overflow-visible backdrop-blur-2xl bg-white/70 p-0">
        {/* Header: Avatar + Name + Email + Phone */}
        <div className="flex flex-col md:flex-row items-center gap-4 px-6 py-6 bg-gradient-to-br from-white/80 to-primary/10 glass-card-enhanced/80 border-b border-wav3/20">
          {/* Avatar */}
          <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-primary/40 shadow-lg border border-wav3/20">
            <User className="text-primary w-8 h-8" />
          </div>
          {/* Data */}
          <div className="flex-1 flex flex-col gap-1 items-start">
            <div className="font-extrabold text-lg text-main leading-tight tracking-tight flex items-center gap-2">
              {local.name || '-'}
              <span className="text-xs font-mono text-primary/80 bg-primary/10 px-2 py-0.5 rounded-lg select-all ml-2">{accountid}</span>
              <button
                type="button"
                className="ml-1 p-1 rounded hover:bg-primary/10 transition"
                title="Copy Account ID"
                onClick={() => navigator.clipboard.writeText(accountid)}
              >
                <span className="sr-only">Copy</span>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#1ea3ab">
                  <title>Copy</title>
                  <rect x="7" y="7" width="10" height="10" rx="2" strokeWidth="2"/><rect x="3" y="3" width="10" height="10" rx="2" strokeWidth="2"/></svg>
              </button>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <Mail className="w-4 h-4" />
              <span className="font-mono">{local.email || '-'}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <Phone className="w-4 h-4" />
              <span className="font-mono">{local.phone || '-'}</span>
            </div>
          </div>
        </div>
        {/* Documents in modern cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 px-6 py-4 bg-white/60">
          {/* Tax ID Card */}
          <div className="glass-card-enhanced/90 rounded-xl border border-wav3/20 shadow flex flex-col gap-1 p-3 items-start bg-white/70">
            <div className="flex items-center gap-2 mb-1">
              <CreditCard className="text-primary w-5 h-5" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                {local.taxIdType || '-'}
              </span>
            </div>
            <span className="text-base font-mono font-bold text-main break-all">
              {local.taxIdNumber || '-'}
            </span>
          </div>
          {/* Local ID Card */}
          <div className="glass-card-enhanced/90 rounded-xl border border-wav3/20 shadow flex flex-col gap-1 p-3 items-start bg-white/70">
            <div className="flex items-center gap-2 mb-1">
              <IdCard className="text-primary w-5 h-5" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                {local.localIdType || '-'}
              </span>
            </div>
            <span className="text-base font-mono font-bold text-main break-all">
              {local.localIdNumber || '-'}
            </span>
          </div>
        </div>
        {/* Address */}
        <div className="glass-card-enhanced/90 rounded-xl shadow p-4 border border-wav3/20 flex flex-col gap-1 mx-6 mb-4 bg-white/70">
          <div className="flex items-center gap-2 mb-1">
            <Home className="text-primary w-5 h-5" />
            <span className="font-semibold text-main text-base">Address</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="text-primary w-4 h-4" />
            <span className="text-main font-mono">{getCountryName(local.country)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="text-primary w-4 h-4" />
            <span className="text-main font-mono">{local.city || '-'}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="text-primary w-4 h-4" />
            <span className="text-main font-mono">{local.address || '-'}</span>
          </div>
          {local.post_code && (
            <div className="flex items-center gap-2">
              <CreditCard className="text-primary w-4 h-4" />
              <span className="text-main font-mono">{local.post_code}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
