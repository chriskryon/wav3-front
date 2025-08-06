import type { BankAccount } from './BankAccountCard';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { PixQRCode } from '@/components/ui/PixQRCode';
import {
  Building2,
  Landmark,
  Globe2,
  Pencil,
  Trash2,
  Copy,
} from 'lucide-react';
import { toast } from 'sonner';
import type React from 'react';
import { useState } from 'react';
import { deleteBankAccount } from '@/services/api-service';

interface BankAccountDetailsCardProps {
  account: BankAccount;
  onEdit?: (account: BankAccount) => void;
  onDelete?: (account: BankAccount) => void;
}

const countryIcons: Record<string, React.ReactNode> = {
  BR: <Landmark className='w-6 h-6 text-green-700' />,
  US: <Landmark className='w-6 h-6 text-blue-700' />,
  EU: <Globe2 className='w-6 h-6 text-blue-700' />,
};

const truncateMiddle = (str: string, maxLength: number) => {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  const keep = Math.floor((maxLength - 3) / 2);
  return `${str.slice(0, keep)}...${str.slice(-keep)}`;
};

export const BankAccountDetailsCard: React.FC<BankAccountDetailsCardProps> = ({
  account,
  onEdit,
  onDelete,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const flagIcon = countryIcons[account.country] || (
    <Building2 className='w-7 h-7 text-[#1ea3ab]' />
  );

  // Handler de exclusão real
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteBankAccount(account.id);
      if (result.success) {
        toast.success('Bank account deleted!');
        setShowDeleteConfirm(false);
        onDelete?.(account);
      } else {
        toast.error(result.message || 'Error deleting bank account.');
      }
    } catch (_err) {
      toast.error('Error deleting bank account.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card
      className='overflow-hidden w-full max-w-2xl sm:max-w-3xl lg:max-w-[650px] mx-auto border border-[#1ea3ab]/30 bg-white/60 backdrop-blur-2xl rounded-3xl animate-fade-in-up'
      style={{
        background: 'linear-gradient(120deg,rgba(255,255,255,0.80) 60%,rgba(30,163,171,0.08) 100%)',
        border: '1.5px solid rgba(30,163,171,0.30)',
        backdropFilter: 'blur(24px)',
        minHeight: 420,
        padding: 0,
      }}
    >
      <CardContent className='p-0'>
        <div className='relative min-h-[18rem] p-0 flex flex-col justify-between rounded-3xl'>
          {/* Top: Bank logo, name, and actions */}
          <div className='flex items-center gap-4 px-16 pt-8 pb-4 border-b border-transparent bg-white/70 rounded-t-3xl'>
            <div className='rounded-2xl bg-white/90 p-4 flex items-center justify-center shadow-sm'>
              {flagIcon}
            </div>
            <div className='flex flex-col flex-1 min-w-0'>
              <span className='font-bold text-2xl text-[#1ea3ab] leading-tight truncate drop-shadow-sm'>
                {account.bank_name}
              </span>
              <span className='text-sm text-[#1ea3ab]/80 font-semibold uppercase tracking-wider truncate'>
                {account.asset}
              </span>
            </div>
            {(onEdit || (onDelete && account.bank_type !== 'shared')) && (
              <div className='flex gap-2 ml-auto'>
                {onEdit && (
                  <button
                    type='button'
                    className='rounded-lg p-2 bg-white/90 hover:bg-[#1ea3ab]/10 border border-[#e0e0e0] text-[#1ea3ab] transition shadow-sm'
                    title='Edit account'
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(account);
                    }}
                  >
                    <Pencil className='w-4 h-4' />
                  </button>
                )}
                {onDelete && account.bank_type !== 'shared' && (
                  <button
                    type='button'
                    className='rounded-lg p-2 bg-white/90 hover:bg-red-100 border border-red-200 text-red-700 transition shadow-sm'
                    title='Delete account'
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteConfirm(true);
                    }}
                  >
                    <Trash2 className='w-4 h-4' />
                  </button>
                )}
              </div>
            )}
          </div>
          {/* Account Info */}
          <div className='px-6 pb-3 pt-2 flex flex-col gap-3'>
            <div className='flex-1'>
              <Label className='text-xs text-[#1ea3ab] font-semibold mb-0.5 block'>ID:</Label>
              <div className='font-mono text-base text-[#1ea3ab] bg-white/95 rounded px-2 py-1 break-all shadow-inner border border-[#1ea3ab]/20'>{account.id || '-'}</div>
            </div>
            <div className='flex flex-col sm:flex-row gap-2 sm:gap-6'>
              <div className='flex-1'>
                <Label className='text-xs text-[#1ea3ab] font-semibold mb-0.5 block'>Account</Label>
                <div className='font-mono text-base text-[#1ea3ab] bg-white/95 rounded px-2 py-1 break-all shadow-inner border border-[#1ea3ab]/20'>{account.account}</div>
              </div>
              <div className='flex-1'>
                <Label className='text-xs text-[#1ea3ab] font-semibold mb-0.5 block'>Branch</Label>
                <div className='font-mono text-base text-[#1ea3ab] bg-white/95 rounded px-2 py-1 break-all shadow-inner border border-[#1ea3ab]/20'>{account.branch || '-'}</div>
              </div>
            </div>
            {/* Name on its own line */}
            <div className='flex-1'>
              <Label className='text-xs text-[#1ea3ab] font-semibold mb-0.5 block'>Name</Label>
              <div className='font-mono text-base text-[#1ea3ab] bg-white/95 rounded px-2 py-1 break-all shadow-inner border border-[#1ea3ab]/20'>{account.name || account.bank_name}</div>
            </div>
            <div className='flex-1'>
              <Label className='text-xs text-[#1ea3ab] font-semibold mb-0.5 block'>Country</Label>
              <div className='font-mono text-base text-[#1ea3ab] bg-white/95 rounded px-2 py-1 break-all shadow-inner border border-[#1ea3ab]/20'>{account.country}</div>
            </div>
            {account.instant_payment && (
              <div className='flex flex-col sm:flex-row gap-2 sm:gap-6 mt-2'>
                <div className='flex-1'>
                  <Label className='text-xs text-[#1ea3ab] font-semibold'>
                    Instant Payment{' '}
                    {account.instant_payment_type
                      ? `(${account.instant_payment_type})`
                      : ''}
                  </Label>
                  <div className='flex w-full items-center gap-2 mt-1'>
                    <div className='flex-1 flex w-full'>
                      <div className='font-mono text-base text-[#1ea3ab] bg-white/95 rounded-l px-2 py-1 break-all shadow-inner w-full'>{truncateMiddle(account.instant_payment, 36)}</div>
                      <button
                        type='button'
                        className='rounded-r px-2 py-1 bg-white/95 hover:bg-[#1ea3ab]/10 text-[#1ea3ab] transition shadow h-full'
                        title='Copy'
                        onClick={() => {
                          if (account.instant_payment) {
                            navigator.clipboard.writeText(
                              account.instant_payment,
                            );
                        toast.success('Copied!');
                          }
                        }}
                      >
                        <Copy className='w-4 h-4' />
                      </button>
                    </div>
                  </div>
                  {/* Show QR code if PIX */}
                  {account.instant_payment_type === 'PIX' && account.instant_payment && (
                    <div className="mt-4 flex justify-center">
                      <PixQRCode value={account.instant_payment} />
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* Address information grouping */}
            {(account.city ||
              account.state ||
              account.postal_code ||
              account.street_line) && (
              <div className='flex flex-col gap-1 mt-2 bg-white/95 rounded-2xl p-4 shadow-inner'>
                <div className='flex flex-wrap gap-3'>
                  {account.city && (
                    <div>
                      <Label className='text-xs text-[#1ea3ab] font-semibold'>
                        City
                      </Label>
                      <div className='font-mono text-base text-[#1ea3ab] bg-white rounded px-2 py-1 break-all shadow-inner'>{account.city}</div>
                    </div>
                  )}
                  {account.state && (
                    <div>
                      <Label className='text-xs text-[#1ea3ab] font-semibold'>
                        State
                      </Label>
                      <div className='font-mono text-base text-[#1ea3ab] bg-white rounded px-2 py-1 break-all shadow-inner'>{account.state}</div>
                    </div>
                  )}
                  {account.postal_code && (
                    <div>
                      <Label className='text-xs text-[#1ea3ab] font-semibold'>
                        Postal Code
                      </Label>
                      <div className='font-mono text-base text-[#1ea3ab] bg-white rounded px-2 py-1 break-all shadow-inner'>{account.postal_code}</div>
                    </div>
                  )}
                </div>
                {account.street_line && (
                  <div className='mt-2'>
                    <Label className='text-xs text-[#1ea3ab] font-semibold'>
                      Address
                    </Label>
                    <div className='font-mono text-base text-[#1ea3ab] bg-white rounded px-2 py-1 break-all shadow-inner'>{account.street_line}</div>
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Footer: Data + Excluir */}
          <div className='flex items-center justify-between px-16 pb-4 pt-2 mt-auto'>
            <span className='text-xs opacity-80 font-mono flex items-center gap-1 text-[#1ea3ab]'>
              <span className='w-2 h-2 rounded-full bg-[#1ea3ab]/60 animate-pulse mr-1' />
              {account.created_at
                ? new Date(account.created_at).toLocaleDateString()
                : ''}
            </span>
            {onDelete && account.bank_type !== 'shared' && (
              <button
                type='button'
                className='ml-2 flex items-center gap-1 px-4 py-2 rounded-xl bg-[#1ea3ab]/10 hover:bg-red-100 text-[#1ea3ab] hover:text-red-700 font-semibold text-sm transition shadow'
                title='Delete account'
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteConfirm(true);
                }}
                disabled={isDeleting}
              >
                <Trash2 className='w-4 h-4' /> Delete
              </button>
            )}
          </div>
          {/* Delete confirmation modal */}
          {showDeleteConfirm && account.bank_type !== 'shared' && (
            <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm'>
              <div className='bg-white rounded-xl shadow-xl p-6 max-w-xs w-full flex flex-col items-center'>
                <div className='text-red-600 text-lg font-bold mb-2'>
                  Delete Bank Account?
                </div>
                <div className='text-main text-sm mb-4 text-center'>
                  Are you sure you want to delete this bank account? This action
                  cannot be undone.
                </div>
                <div className='flex gap-2 w-full'>
                  <button
                    type='button'
                    className='flex-1 border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 rounded-lg px-3 py-2 font-semibold'
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                  <button
                    type='button'
                    className='flex-1 bg-red-500 hover:bg-red-600 text-white rounded-lg px-3 py-2 font-semibold'
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <span className='flex items-center justify-center'>
                        <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2' />
                        Deleting...
                      </span>
                    ) : (
                      'Delete'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
