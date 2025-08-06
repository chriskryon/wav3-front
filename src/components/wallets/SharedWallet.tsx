import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Percent, Mail, Loader2 } from 'lucide-react';
import type React from 'react';

interface SharedWalletProps {
  shareData: {
    percentage: string;
    userEmail: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  onCancel: () => void;
}

export const SharedWallet: React.FC<SharedWalletProps> = ({
  shareData,
  onChange,
  onSubmit,
  isLoading,
  onCancel,
}) => (
  <form className='space-y-4 flex flex-col justify-center' onSubmit={onSubmit}>
    {/* Share Percentage */}
    <div>
      <Label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>Share Percentage</Label>
      <div className='relative flex items-center mt-1'>
        <Input
          type='number'
          placeholder='e.g., 25'
          className='bg-white border border-gray-300 rounded-lg pl-10 py-2 focus:border-[#1ea3ab] focus:ring-1 focus:ring-[#1ea3ab] transition-colors'
          name='percentage'
          value={shareData.percentage}
          onChange={onChange}
          min='1'
          max='100'
        />
        <Percent className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none' />
      </div>
    </div>
    {/* User Email */}
    <div>
      <Label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>User Email</Label>
      <div className='relative flex items-center mt-1'>
        <Input
          type='email'
          placeholder='user@example.com'
          className='bg-white border border-gray-300 rounded-lg pl-10 py-2 focus:border-[#1ea3ab] focus:ring-1 focus:ring-[#1ea3ab] transition-colors'
          name='userEmail'
          value={shareData.userEmail}
          onChange={onChange}
        />
        <Mail className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none' />
      </div>
    </div>
    <div className='flex gap-3 pt-4'>
      <Button
        type='button'
        variant='outline'
        onClick={onCancel}
        className='flex-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors font-medium py-2 rounded-lg'
        disabled={isLoading}
      >
        Cancel
      </Button>
      <Button
        type='submit'
        className='flex-1 bg-[#1ea3ab] hover:bg-[#188a91] text-white font-medium py-2 rounded-lg border border-[#1ea3ab] transition-colors'
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className='w-4 h-4 animate-spin mr-2' />
            Sharing...
          </>
        ) : (
          'Share Wallet'
        )}
      </Button>
    </div>
  </form>
);
