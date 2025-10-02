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
import { Copy, Check, Building, CreditCard, Download } from 'lucide-react';

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
  const [copiedField, setCopiedField] = useState<string | null>(null);

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
        // Keep modal open to show details
        // if (onSuccess) onSuccess(res as RegisterSharedBankAccountResponse);
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

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast.success(`${field} copied to clipboard!`);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleClose = () => {
    setResult(null);
    setAsset('BRL');
    onOpenChange(false);
  };

  const handleDone = () => {
    if (onSuccess && result) {
      onSuccess(result);
    }
    handleClose();
  };

  const downloadQRCode = async () => {
    if (!result?.instant_payment_qrcode_url) return;
    
    try {
      const response = await fetch(result.instant_payment_qrcode_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pix-qrcode-${result.asset}-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('QR Code downloaded successfully!');
    } catch (err) {
      toast.error('Failed to download QR Code');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-sm bg-white border border-gray-200 rounded-xl p-0 max-h-[90vh] flex flex-col'>
        <DialogHeader className="p-6 pb-3 flex-shrink-0">
          <DialogTitle className='text-lg font-semibold text-gray-900 text-center'>
            {result ? 'Shared Account Created!' : 'Choose the asset for your shared account'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6">
          {!result ? (
            <>
              <div className="text-sm text-center text-gray-600 mb-4">
                This is an account where you can deposit money.
              </div>
              <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <div className="flex gap-3 justify-center">
                  {sharedBankAssets.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`flex flex-col items-center justify-center px-3 py-4 rounded-lg border transition-colors font-medium w-20 h-20 text-sm focus:outline-none focus:ring-2 focus:ring-[#00109b]/50 bg-white
                        ${asset === opt.value ? 'border-[#00109b] bg-[#00109b]/5' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                      onClick={() => setAsset(opt.value)}
                      aria-label={opt.label}
                    >
                      <div className="mb-1">
                        {opt.icon}
                      </div>
                      <span className={`font-medium text-xs text-center ${asset === opt.value ? 'text-[#00109b]' : 'text-gray-700'}`}>
                        {opt.value}
                      </span>
                    </button>
                  ))}
                </div>
              </form>
            </>
          ) : (
            <div className="space-y-4">
              {/* Success Message */}
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Building className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-sm text-gray-600">
                  Your shared bank account has been created successfully!
                </p>
              </div>

              {/* PIX QR Code for BRL */}
              {result.asset === 'BRL' && (
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="text-center">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-blue-900">PIX</h4>
                      {result.instant_payment_qrcode_url && (
                        <button
                          onClick={downloadQRCode}
                          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <Download className="w-3 h-3" />
                          Download QR
                        </button>
                      )}
                    </div>
                    
                    {result.instant_payment_qrcode_url ? (
                      <>
                        <div className="bg-white p-3 rounded-lg inline-block shadow-sm">
                          <img 
                            src={result.instant_payment_qrcode_url} 
                            alt="PIX QR Code" 
                            className="w-32 h-32 mx-auto"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                        <p className="text-xs text-blue-700 mt-2">
                          Use this QR Code to receive PIX payments
                        </p>
                      </>
                    ) : (
                      <div className="py-4">
                        <p className="text-sm text-blue-700">
                          PIX QR Code will be generated soon
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          Use the PIX key above to receive payments
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Account Details */}
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Account</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(result.account, 'Account')}
                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      {copiedField === 'Account' ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      Copy
                    </button>
                  </div>
                  <p className="text-sm font-mono text-gray-900 mt-1">{result.account}</p>
                </div>

                {result.bank_code && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Bank Code</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(result.bank_code, 'Bank Code')}
                        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        {copiedField === 'Bank Code' ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        Copy
                      </button>
                    </div>
                    <p className="text-sm font-mono text-gray-900 mt-1">{result.bank_code}</p>
                  </div>
                )}

                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Branch</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(result.branch, 'Branch')}
                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      {copiedField === 'Branch' ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      Copy
                    </button>
                  </div>
                  <p className="text-sm font-mono text-gray-900 mt-1">{result.branch}</p>
                </div>

                {result.instant_payment && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">Instant Payment</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(result.instant_payment, 'Instant Payment')}
                        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        {copiedField === 'Instant Payment' ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        Copy
                      </button>
                    </div>
                    <p className="text-sm font-mono text-gray-900 mt-1 truncate" title={result.instant_payment}>
                      {result.instant_payment.length > 40 
                        ? `${result.instant_payment.substring(0, 40)}...` 
                        : result.instant_payment
                      }
                    </p>
                  </div>
                )}

                {result.street_line && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Address</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(result.street_line, 'Address')}
                        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        {copiedField === 'Address' ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        Copy
                      </button>
                    </div>
                    <p className="text-sm text-gray-900 mt-1">{result.street_line}</p>
                  </div>
                )}

                <div className="text-xs text-gray-500 text-center pt-2 space-y-1">
                  <div>Asset: {result.asset} • Country: {result.country}</div>
                  <div>Bank Type: {result.bank_type} • Created: {new Date(result.created_at).toLocaleDateString()}</div>
                  <div className="text-xs text-gray-400">ID: {result.id}</div>
                </div>
              </div>
            </div>
          )}

          {result?.message && !result.id && (
            <div className='text-red-600 text-sm text-center bg-red-50 border border-red-200 rounded-lg p-2 mt-4'>
              {result.message}
            </div>
          )}
        </div>

        {/* Footer with buttons - always visible */}
        {!result ? (
          <div className="p-6 pt-3 flex-shrink-0">
            <Button
              type='submit'
              onClick={handleSubmit}
              className='bg-[#00109b] hover:bg-[#188a91] text-white font-medium rounded-lg h-10 text-sm border border-[#00109b] transition-colors w-full'
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
          </div>
        ) : (
          <div className="p-6 pt-3 flex-shrink-0">
            <div className="flex gap-2">
              <Button
                onClick={handleClose}
                variant="outline"
                className="flex-1 text-sm"
              >
                Close
              </Button>
              <Button
                onClick={handleDone}
                className="flex-1 bg-[#00109b] hover:bg-[#188a91] text-white text-sm"
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
