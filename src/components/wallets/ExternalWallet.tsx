import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { HandCoins, Wallet2, Loader2, Copy } from 'lucide-react';
import { TokenBTC, TokenETH, TokenXRP, TokenUSDT } from '@web3icons/react';
import type React from 'react';

interface ExternalWalletProps {
  newWallet: {
    name: string;
    asset: string;
    address: string;
    network: string;
  };
  assetNetworkMap: Record<string, string>;
  assetIcons: Record<string, React.ElementType>;
  onAssetChange: (value: string) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  onCancel: () => void;
}

export const ExternalWallet: React.FC<ExternalWalletProps> = ({
  newWallet,
  onAssetChange,
  onChange,
  onSubmit,
  isLoading,
  onCancel,
}) => (
  <form className='space-y-4 flex flex-col justify-center' onSubmit={onSubmit}>
    {/* Wallet Name */}
    <div>
      <Label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>Wallet Name</Label>
      <div className='relative flex items-center mt-1'>
        <Input
          placeholder='My Bitcoin wallet'
          className='bg-white border border-gray-300 rounded-lg pl-10 py-2 focus:border-[#00109b] focus:ring-1 focus:ring-[#00109b] transition-colors'
          name='name'
          value={newWallet.name}
          onChange={onChange}
        />
        <Wallet2 className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none' />
      </div>
    </div>
    {/* Asset Select */}
    <div>
      <Label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>Asset</Label>
      <div className='relative flex items-center mt-1'>
        <span className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 z-10 pointer-events-none'>
          <HandCoins className='w-4 h-4 text-gray-400' />
        </span>
        <Select value={newWallet.asset} onValueChange={onAssetChange}>
          <SelectTrigger className='bg-white border border-gray-300 rounded-lg pl-10 py-2 focus:border-[#00109b] focus:ring-1 focus:ring-[#00109b] transition-colors'>
            <SelectValue placeholder='Select asset' />
          </SelectTrigger>
          <SelectContent className='bg-white border border-gray-200 rounded-lg shadow-lg'>
            <SelectItem value='BTC' className='hover:bg-gray-50 focus:bg-gray-50'>
              <span className='flex items-center gap-2'>
                <TokenBTC className='w-4 h-4' />
                Bitcoin (BTC)
              </span>
            </SelectItem>
            <SelectItem value='ETH' className='hover:bg-gray-50 focus:bg-gray-50'>
              <span className='flex items-center gap-2'>
                <TokenETH className='w-4 h-4' />
                Ethereum (ETH)
              </span>
            </SelectItem>
            <SelectItem value='XRP' className='hover:bg-gray-50 focus:bg-gray-50'>
              <span className='flex items-center gap-2'>
                <TokenXRP className='w-4 h-4 bg-black' />
                Ripple (XRP)
              </span>
            </SelectItem>
            <SelectItem value='USDT' className='hover:bg-gray-50 focus:bg-gray-50'>
              <span className='flex items-center gap-2'>
                <TokenUSDT className='w-4 h-4' />
                Tether (USDT)
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
    {/* Wallet Address */}
    <div>
      <Label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>Wallet Address</Label>
      <div className='relative flex items-center mt-1'>
        <Input
          placeholder='Enter wallet address'
          className='bg-white border border-gray-300 rounded-lg pl-10 py-2 focus:border-[#00109b] focus:ring-1 focus:ring-[#00109b] transition-colors'
          name='address'
          value={newWallet.address}
          onChange={onChange}
        />
        <Copy className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none' />
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
        className='flex-1 bg-[#00109b] hover:bg-[#188a91] text-white font-medium py-2 rounded-lg border border-[#00109b] transition-colors'
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className='w-4 h-4 animate-spin mr-2' />
            Adding...
          </>
        ) : (
          'Add Wallet'
        )}
      </Button>
    </div>
  </form>
);
