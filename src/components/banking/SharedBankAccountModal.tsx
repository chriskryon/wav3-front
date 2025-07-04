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
  const [asset, setAsset] = useState('');
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
            <legend className='block text-sm font-semibold mb-2'>
              Select the asset
            </legend>
            <div className='flex gap-3 justify-center'>
              {sharedBankAssets.map((opt) => (
                <button
                  key={opt.value}
                  type='button'
                  className={`flex flex-col items-center justify-center px-4 py-3 rounded-xl border-2 transition-all font-semibold shadow-md min-w-[90px] min-h-[90px] text-sm focus:outline-none focus:ring-2 focus:ring-primary/60 group
                    ${asset === opt.value ? 'bg-primary text-white border-primary scale-105 shadow-xl' : 'bg-background text-main border-gray-200 hover:bg-primary/10 hover:border-primary/60'}`}
                  onClick={() => setAsset(opt.value)}
                  aria-label={opt.label}
                >
                  <span className='mb-2 group-hover:scale-110 transition-transform'>
                    {opt.icon}
                  </span>
                  <span className='font-bold tracking-wide text-xs sm:text-sm text-center whitespace-nowrap'>
                    {opt.value}
                  </span>
                  <span className='text-[11px] opacity-80 mt-1'>
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          </fieldset>
          <Button
            type='submit'
            className='bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 h-12 text-base rounded-xl mt-2'
            disabled={isRegistering}
          >
            {isRegistering ? 'Registering...' : 'Register Shared Account'}
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
