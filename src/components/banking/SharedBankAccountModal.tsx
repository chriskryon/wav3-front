import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

import { toast } from 'sonner';
import { registerSharedBankAccount } from '@/services/api-service';
import type {
  RegisterSharedBankAccountPayload,
  RegisterSharedBankAccountResponse,
} from '@/entities/types';
import { US, BR, MX } from 'country-flag-icons/react/3x2';

const sharedBankAssets = [
  {
    value: 'BRL',
    label: 'Brazilian Real (BRL)',
    icon: <BR title='Brazil' className='inline w-5 h-5 mr-2 rounded shadow' />,
  },
  {
    value: 'MXN',
    label: 'Mexican Peso (MXN)',
    icon: <MX title='Mexico' className='inline w-5 h-5 mr-2 rounded shadow' />,
  },
  {
    value: 'USD',
    label: 'US Dollar (USD)',
    icon: (
      <US
        title='United States'
        className='inline w-5 h-5 mr-2 rounded shadow'
      />
    ),
  },
];

interface SharedBankAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (data: RegisterSharedBankAccountResponse) => void;
}

export function SharedBankAccountModal({
  open,
  onOpenChange,
  onSuccess,
}: SharedBankAccountModalProps) {
  // Default to BRL selected
  const [asset, setAsset] = useState('BRL');
  const [isRegistering, setIsRegistering] = useState(false);
  const [result, setResult] =
    useState<RegisterSharedBankAccountResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!asset) {
      toast.error('Select the asset!');
      return;
    }
    setIsRegistering(true);
    setResult(null);
    try {
      const payload: RegisterSharedBankAccountPayload = { asset };
      const res = await registerSharedBankAccount(payload);
      setResult(res);
      if (res.id && res.bank_type === 'shared') {
        toast.success('Shared account created successfully!');
        onOpenChange(false);
        if (onSuccess) onSuccess(res);
      } else if (res.message) {
        toast.error(res.message);
      } else {
        toast.error('Unexpected error while registering shared account.');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Error registering shared account.');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='glass-card-enhanced max-w-md'>
        <DialogHeader>
          <VisuallyHidden>
            <DialogTitle className='text-xl font-bold text-main'>
              Add Shared Bank Account
            </DialogTitle>
          </VisuallyHidden>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='flex flex-col gap-6 mt-2'>
          <fieldset>
            <legend className='block text-lg font-bold mb-4 text-center text-main tracking-tight'>
              Choose the asset for your shared account
            </legend>
            <div className="flex gap-4 justify-center flex-wrap">
              {sharedBankAssets.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`relative flex flex-col items-center justify-center px-6 py-6 rounded-2xl border-2 transition-all font-semibold shadow-md min-w-[110px] min-h-[110px] text-base focus:outline-none focus:ring-2 focus:ring-primary/40 group bg-white/80 backdrop-blur-md
                    ${asset === opt.value ? 'border-primary ring-2 ring-primary/30 scale-105 shadow-xl' : 'border-gray-200 hover:border-primary/40 hover:bg-primary/5'}`}
                  onClick={() => setAsset(opt.value)}
                  aria-label={opt.label}
                  tabIndex={0}
                  style={{ boxShadow: asset === opt.value ? '0 4px 24px 0 #1ea3ab22' : undefined }}
                >
                  <span className={`mb-2 transition-transform ${asset === opt.value ? 'scale-110' : ''}`}
                    style={{ fontSize: 36, filter: asset === opt.value ? 'none' : 'grayscale(80%) brightness(1.1)' }}>
                    {opt.icon}
                  </span>
                  <span className={`font-bold tracking-wide text-sm sm:text-base text-center whitespace-nowrap ${asset === opt.value ? 'text-primary' : 'text-main/80'}`}>
                    {opt.value}
                  </span>
                  <span className={`text-[12px] mt-1 ${asset === opt.value ? 'text-primary/80 font-semibold' : 'text-gray-600 font-medium'}`}>
                    {opt.label}
                  </span>
                  {asset === opt.value && (
                    <span className="absolute inset-0 rounded-2xl border-2 border-primary/40 pointer-events-none animate-fade-in" style={{ boxShadow: '0 0 0 2px #1ea3ab33' }} />
                  )}
                </button>
              ))}
            </div>
          </fieldset>
          <Button
            type='submit'
            className='bg-gradient-to-br from-primary to-[#1ea3ab] hover:from-[#1ea3ab] hover:to-primary text-white font-bold shadow-xl transition-all duration-300 h-12 text-lg rounded-2xl mt-4 tracking-tight'
            disabled={isRegistering}
          >
            {isRegistering ? (
              <span className="flex items-center gap-2 justify-center">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Registering...
              </span>
            ) : (
              'Register Shared Account'
            )}
          </Button>
          {result?.message && (
            <div className='text-red-600 text-sm mt-2 text-center'>
              {result.message}
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
