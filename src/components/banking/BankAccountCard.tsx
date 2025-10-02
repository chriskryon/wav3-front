import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Eye, BanknoteArrowUp, BanknoteArrowDown } from 'lucide-react';
import { Label } from '@/components/ui/label';
import type React from 'react';
import { BR } from 'country-flag-icons/react/3x2';
import { US } from 'country-flag-icons/react/3x2';
import { MX } from 'country-flag-icons/react/3x2';
import { Landmark } from 'lucide-react';

export interface BankAccount {
  id: string;
  name: string;
  bank_name: string;
  account: string;
  branch?: string;
  country: string;
  asset: string;
  instant_payment?: string;
  instant_payment_type?: string;
  city?: string;
  postal_code?: string;
  state?: string;
  street_line?: string;
  created_at?: string;
  gradient?: string;
  type?:
    | 'shared'
    | 'recebimento'
    | 'deposit'
    | 'external'
    | 'envio'
    | 'withdrawal';
  bank_type?: 'shared' | 'external';
}

interface BankAccountCardProps {
  account: BankAccount;
  onCopy: (text: string) => void;
  onView: (account: BankAccount) => void;
}

// Gradientes sutis e temáticos por país/moeda
// Mais sutileza e fidelidade às cores dos países/moedas
const countryPalette: Record<
  string,
  { bg: string; border: string; text: string; iconBg: string; iconText: string }
> = {
  BRL: {
    bg: 'from-green-100 via-yellow-50 to-blue-100', // Brasil sutil
    border: 'border-green-200',
    text: 'text-green-900',
    iconBg: 'bg-green-100',
    iconText: 'text-green-900',
  },
  MXN: {
    bg: 'from-green-100 via-white to-red-100', // México sutil
    border: 'border-green-200',
    text: 'text-green-900',
    iconBg: 'bg-green-100',
    iconText: 'text-green-900',
  },
  USD: {
    bg: 'from-[#0A3161]/30 via-white to-[#B31942]/30', // EUA sutil
    border: 'border-blue-200',
    text: 'text-blue-900',
    iconBg: 'bg-blue-100',
    iconText: 'text-blue-900',
  },
  default: {
    bg: 'from-slate-100 via-white to-blue-50',
    border: 'border-slate-200',
    text: 'text-slate-900',
    iconBg: 'bg-gray-100',
    iconText: 'text-gray-800',
  },
};

const assetIcon: Record<string, React.ReactNode> = {
  BRL: <BR title='Brazil' className='...' />,
  USD: <US title='United States' className='...' />,
  MXN: <MX title='Mexico' className='...' />,
};

export function BankAccountCard({
  account,
  onCopy,
  onView,
}: BankAccountCardProps) {
  // Sempre usa o gradiente definido no mock (account.gradient), aplicado ao card todo, sem fallback aleatório
  // Se não houver gradient no mock, usa o padrão do país/moeda
  // Paleta principal: cor do site (PRIMARY) com opacidade/transparência
  const flagIcon = assetIcon[account.asset] || (
    <Landmark className='w-6 h-6 text-[#00109b]' />
  );

  // ExemplassetIcono: se quiser diferenciar "recebimento" e "envio" por tipo, pode usar um campo do account, ex: account.type === 'shared' ? ...
  // Aqui, só para exemplo, vamos mostrar BanknoteArrowUp para recebimento (deposit), BanknoteArrowDown para envio (withdrawal)
  // Ajuste conforme sua estrutura de dados real
  let cornerIcon = null;
  if (
    account.type === 'shared' ||
    account.type === 'recebimento' ||
    account.type === 'deposit'
  ) {
    cornerIcon = (
      <BanknoteArrowUp
        className='w-6 h-6 text-green-600 drop-shadow absolute top-2 right-2 z-20 bg-white/80 rounded-full p-1'
        aria-label='Recebimento'
      />
    );
  } else if (
    account.type === 'external' ||
    account.type === 'envio' ||
    account.type === 'withdrawal'
  ) {
    cornerIcon = (
      <BanknoteArrowDown
        className='w-6 h-6 text-blue-600 drop-shadow absolute top-2 right-2 z-20 bg-white/80 rounded-full p-1'
        aria-label='Envio'
      />
    );
  }

  // Aplica gradiente/background conforme asset (BRL, USD, MXN) usando countryPalette
  const palette = countryPalette[account.asset] || countryPalette.default;

  return (
    <Card
      className={`glass-card-enhanced cursor-pointer overflow-hidden w-full border-0 group transition-transform duration-300 hover:scale-[1.025] shadow-[0_4px_24px_0_rgba(30,163,171,0.10)] border-none bg-gradient-to-br ${palette.bg}`}
      onClick={() => onView(account)}
      style={{ borderRadius: 18 }}
    >
      <CardContent className='p-0'>
        <div
          className={`relative px-5 py-4 rounded-xl bg-gradient-to-bl ${palette.bg}`}
        >
          {/* Ícone de tipo de operação no canto superior direito */}
          {cornerIcon}
          {/* Overlay for depth */}
          <div className='absolute inset-0 opacity-10 pointer-events-none select-none'>
            <div className='absolute top-2 right-2 w-10 h-10 rounded-full bg-[#3d8887]/20'></div>
            <div className='absolute bottom-2 left-2 w-6 h-6 rounded-full bg-[#3d8887]/10'></div>
          </div>
          <div className='relative z-10 flex flex-col gap-2'>
            <div className='flex items-center gap-3'>
              <div
                className='rounded-xl bg-white/80 p-1 flex items-center justify-center shadow border border-[#00109b]/30 transition-all duration-300 group-hover:scale-110'
                style={{ minWidth: 40, minHeight: 40 }}
              >
                {flagIcon}
              </div>
              <div className='flex flex-col'>
                <span className='font-bold text-base leading-tight text-[#00109b]'>
                    {account.bank_name.length > 15
                    ? `${account.bank_name.slice(0, 20)}...`
                    : account.bank_name}
                </span>
                <span className='text-xs text-gray-500 font-semibold uppercase tracking-wider'>
                  {account.asset}
                </span>
              </div>
            </div>
            {/* Removed Conta and Agência fields for shared/external accounts */}
            {/* Instant Payment Type/Number */}
            {(account.instant_payment_type || account.instant_payment) && (
              <div className='flex flex-col sm:flex-row gap-2 sm:gap-6 mt-2'>
                <div className='flex-1'>
                  <Label className='text-xs font-semibold text-[#00109b]'>
                    {account.instant_payment_type ? `${account.instant_payment_type}` : 'Instant'}
                  </Label>
                  <div
                    className='font-mono text-base text-[#00109b] bg-white/60 rounded-lg px-2 py-1 mt-1 shadow-inner border border-dashed border-[#00109b]/30 truncate max-w-full'
                    title={account.instant_payment || '-'}
                    style={{ maxWidth: '100%' }}
                  >
                    {account.instant_payment
                      ? account.instant_payment.length > 24
                        ? `${account.instant_payment.slice(0, 24)}...`
                        : account.instant_payment
                      : '-'}
                  </div>
                </div>
              </div>
            )}
            <div className='flex items-center justify-between mt-2'>
              <span className='text-[10px] sm:text-xs opacity-80 font-mono flex items-center gap-1 text-[#00109b]'>
                <span className='w-2 h-2 rounded-full animate-pulse mr-1 bg-[#00109b]/30' />
                {account.created_at
                  ? new Date(account.created_at).toISOString().slice(0, 10)
                  : ''}
              </span>
              <div className='flex gap-2 flex-wrap'>
                <Button
                  size='icon'
                  variant='ghost'
                  onClick={(e) => {
                    e.stopPropagation();
                    onCopy(account.account);
                  }}
                  className='h-8 w-8 p-0 hover:bg-[#00109b]/20 text-[#00109b] border border-[#00109b]/30 shadow-md'
                  aria-label='Copiar conta'
                >
                  <Copy className='w-4 h-4' />
                </Button>
                <Button
                  size='icon'
                  variant='outline'
                  className='h-8 w-8 p-0 glass-button bg-white/60 border border-[#00109b]/30 text-[#00109b] hover:bg-[#00109b]/10 hover:text-primary shadow-md'
                  onClick={(e) => {
                    e.stopPropagation();
                    onView(account);
                  }}
                  aria-label='Ver detalhes'
                >
                  <Eye className='w-4 h-4' />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
