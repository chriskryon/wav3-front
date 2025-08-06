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
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  const flagIcon = countryIcons[account.country] || (
    <Building2 className='w-5 h-5 text-[#1ea3ab]' />
  );

  const handleCopy = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      toast.success(`${fieldName} copied!`);
      setTimeout(() => setCopiedField(null), 1500);
    } catch (_err) {
      toast.error('Failed to copy');
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteBankAccount(account.id);
      if (result.success) {
        toast.success('Bank account deleted successfully!');
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
    <>
      <Card className='w-full max-w-2xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm'>
        <CardContent className='p-6'>
          {/* Header */}
          <div className='flex items-center justify-between mb-6'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100'>
                {flagIcon}
              </div>
              <div>
                <h3 className='font-semibold text-lg text-[#1ea3ab]'>{account.bank_name}</h3>
                <div className='flex items-center gap-2 text-sm text-gray-600'>
                  <span>{account.asset}</span>
                  <span>•</span>
                  <span>{account.bank_type === 'shared' ? 'Shared' : 'Personal'}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            {(onEdit || (onDelete && account.bank_type !== 'shared')) && (
              <div className='flex gap-2'>
                {onEdit && (
                  <button
                    type='button'
                    className='p-2 text-gray-500 hover:text-[#1ea3ab] hover:bg-gray-50 rounded-lg transition-colors'
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
                    className='p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors'
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
          {/* Account Details */}
          <div className='space-y-4'>
            {/* Account ID */}
            <div className='group/field'>
              <Label className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 block'>
                Account ID
              </Label>
              <div className='relative'>
                <div className='text-sm font-mono bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700'>
                  {account.id || '-'}
                </div>
                <button
                  type='button'
                  className='absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-[#1ea3ab] hover:bg-white rounded transition-colors opacity-0 group-hover/field:opacity-100'
                  title='Copy Account ID'
                  onClick={() => handleCopy(account.id || '', 'Account ID')}
                >
                  <Copy className='w-3.5 h-3.5' />
                </button>
              </div>
            </div>

            {/* Account & Branch */}
            <div className='grid grid-cols-2 gap-4'>
              <div className='group/field'>
                <Label className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 block'>
                  Account
                </Label>
                <div className='relative'>
                  <div className='text-sm font-mono bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700'>
                    {account.account}
                  </div>
                  <button
                    type='button'
                    className='absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-[#1ea3ab] hover:bg-white rounded transition-colors opacity-0 group-hover/field:opacity-100'
                    title='Copy Account'
                    onClick={() => handleCopy(account.account, 'Account')}
                  >
                    <Copy className='w-3.5 h-3.5' />
                  </button>
                </div>
              </div>

              <div className='group/field'>
                <Label className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 block'>
                  Branch
                </Label>
                <div className='relative'>
                  <div className='text-sm font-mono bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700'>
                    {account.branch || '-'}
                  </div>
                  {account.branch && (
                    <button
                      type='button'
                      className='absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-[#1ea3ab] hover:bg-white rounded transition-colors opacity-0 group-hover/field:opacity-100'
                      title='Copy Branch'
                      onClick={() => handleCopy(account.branch || '', 'Branch')}
                    >
                      <Copy className='w-3.5 h-3.5' />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Name */}
            <div className='group/field'>
              <Label className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 block'>
                Account Holder
              </Label>
              <div className='relative'>
                <div className='text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700'>
                  {account.name || account.bank_name}
                </div>
                <button
                  type='button'
                  className='absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-[#1ea3ab] hover:bg-white rounded transition-colors opacity-0 group-hover/field:opacity-100'
                  title='Copy Name'
                  onClick={() => handleCopy(account.name || account.bank_name, 'Name')}
                >
                  <Copy className='w-3.5 h-3.5' />
                </button>
              </div>
            </div>

            {/* Country */}
            <div>
              <Label className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 block'>
                Country
              </Label>
              <div className='flex items-center gap-2 text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2'>
                {countryIcons[account.country] || <Globe2 className='w-4 h-4 text-gray-500' />}
                <span className='text-gray-700'>{account.country}</span>
              </div>
            </div>

            {/* Instant Payment */}
            {account.instant_payment && (
              <div>
                <Label className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 block'>
                  Instant Payment {account.instant_payment_type && `(${account.instant_payment_type})`}
                </Label>
                <div className='flex items-center bg-gray-50 border border-gray-200 rounded-lg overflow-hidden'>
                  <div className='flex-1 text-sm font-mono px-3 py-2 text-gray-700'>
                    {truncateMiddle(account.instant_payment, 32)}
                  </div>
                  <button
                    type='button'
                    className='px-3 py-2 text-gray-400 hover:text-[#1ea3ab] hover:bg-white border-l border-gray-200 transition-colors'
                    title='Copy'
                    onClick={() => handleCopy(account.instant_payment || '', 'Instant Payment')}
                  >
                    <Copy className='w-4 h-4' />
                  </button>
                </div>
                
                {/* PIX QR Code */}
                {account.instant_payment_type === 'PIX' && account.instant_payment && (
                  <div className="mt-3 flex justify-center">
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <PixQRCode value={account.instant_payment} />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Address */}
            {(account.city || account.state || account.postal_code || account.street_line) && (
              <div>
                <Label className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block'>
                  Address
                </Label>
                <div className='bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2'>
                  {account.street_line && (
                    <div className='text-sm text-gray-700'>{account.street_line}</div>
                  )}
                  <div className='flex gap-4 text-sm text-gray-600'>
                    {account.city && <span>{account.city}</span>}
                    {account.state && <span>{account.state}</span>}
                    {account.postal_code && <span>{account.postal_code}</span>}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className='flex items-center justify-between pt-4 mt-6 border-t border-gray-100'>
            <span className='text-xs text-gray-500'>
              Added {account.created_at ? new Date(account.created_at).toLocaleDateString() : 'Unknown'}
            </span>
            
            {onDelete && account.bank_type !== 'shared' && (
              <button
                type='button'
                className='text-xs text-red-600 hover:text-red-700 font-medium transition-colors'
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteConfirm(true);
                }}
                disabled={isDeleting}
              >
                Delete Account
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && account.bank_type !== 'shared' && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm'>
          <div className='bg-white rounded-xl shadow-lg p-6 max-w-sm w-full mx-4'>
            <div className='text-center'>
              <div className='w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3'>
                <Trash2 className='w-6 h-6 text-red-600' />
              </div>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>Delete Account?</h3>
              <p className='text-sm text-gray-600 mb-4'>
                This action cannot be undone. The bank account will be permanently removed.
              </p>
              <div className='flex gap-3'>
                <button
                  type='button'
                  className='flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  type='button'
                  className='flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50'
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
