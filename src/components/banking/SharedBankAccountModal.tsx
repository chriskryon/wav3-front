import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import type {
  RegisterSharedBankAccountPayload,
  RegisterSharedBankAccountResponse,
} from '@/entities/types';
import { US, BR, MX } from 'country-flag-icons/react/3x2';
import { registerSharedBankAccount } from '@/services/bank-account-api-service';

const sharedBankAssets = [
  {
    value: 'BRL',
    label: 'Brazilian Real (BRL)',
    icon: <BR title='Brazil' className='w-6 h-6 rounded' />,
  },
  {
    value: 'MXN',
    label: 'Mexican Peso (MXN)',
    icon: <MX title='Mexico' className='w-6 h-6 rounded' />,
  },
  {
    value: 'USD',
    label: 'US Dollar (USD)',
    icon: <US title='United States' className='w-6 h-6 rounded' />,
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

      setResult(res as RegisterSharedBankAccountResponse);
      if ((res as RegisterSharedBankAccountResponse).id && (res as RegisterSharedBankAccountResponse).bank_type === 'shared') {
      toast.success('Shared account created successfully!');
      onOpenChange(false);
      
      if (onSuccess) onSuccess(res as RegisterSharedBankAccountResponse);
      } else if ((res as any).message) {
      toast.error((res as any).message);
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
      <DialogContent className='max-w-sm bg-white border border-gray-200 rounded-xl p-6'>
        <DialogHeader className="mb-.3">
          <DialogTitle className='text-lg font-semibold text-gray-900 text-center'>
            Choose the asset for your shared account
          </DialogTitle>
        </DialogHeader>
        <div className="text-sm text-center text-gray-600 mb-1">
          This is an account where you can deposit money.
        </div>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <div className="flex gap-3 justify-center">
            {sharedBankAssets.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`flex flex-col items-center justify-center px-3 py-4 rounded-lg border transition-colors font-medium w-20 h-20 text-sm focus:outline-none focus:ring-2 focus:ring-[#1ea3ab]/50 bg-white
                  ${asset === opt.value ? 'border-[#1ea3ab] bg-[#1ea3ab]/5' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                onClick={() => setAsset(opt.value)}
                aria-label={opt.label}
              >
                <div className="mb-1">
                  {opt.icon}
                </div>
                <span className={`font-medium text-xs text-center ${asset === opt.value ? 'text-[#1ea3ab]' : 'text-gray-700'}`}>
                  {opt.value}
                </span>
              </button>
            ))}
          </div>
          <Button
            type='submit'
            className='bg-[#1ea3ab] hover:bg-[#188a91] text-white font-medium rounded-lg h-10 text-sm border border-[#1ea3ab] transition-colors w-full'
            disabled={isRegistering}
          >
            {isRegistering ? (
              <span className="flex items-center gap-2 justify-center">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Registering...
              </span>
            ) : (
              'Register Shared Account'
            )}
          </Button>
          {result?.message && (
            <div className='text-red-600 text-sm text-center bg-red-50 border border-red-200 rounded-lg p-2'>
              {result.message}
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
