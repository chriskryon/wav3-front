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
  <form className='space-y-6 flex flex-col justify-center' onSubmit={onSubmit}>
    {/* Wallet Name */}
    <div className='relative'>
      <Label className='text-sm font-medium muted-text'>Wallet Name</Label>
      <div className='relative flex items-center'>
        <Input
          placeholder='Minha carteira Bitcoin'
          className='glass-input mt-1 pl-11'
          name='name'
          value={newWallet.name}
          onChange={onChange}
        />
        <Wallet2 className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/80 z-10 pointer-events-none' />
      </div>
    </div>
    {/* Asset Select */}
    <div className='relative'>
      <Label className='text-sm font-medium muted-text'>Ativo</Label>
      <div className='relative flex items-center'>
        <span className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 z-10 pointer-events-none'>
          <HandCoins className='w-5 h-5 text-primary/60' />
        </span>
        <Select value={newWallet.asset} onValueChange={onAssetChange}>
          <SelectTrigger className='glass-input mt-1 w-full pl-11'>
            <SelectValue placeholder='Selecione o ativo' />
          </SelectTrigger>
          <SelectContent className='glass-card-enhanced'>
            <SelectItem value='BTC' className='hover:bg-primary/10'>
              <span className='flex items-center gap-2'>
                <TokenBTC className='w-4 h-4' />
                Bitcoin (BTC)
              </span>
            </SelectItem>
            <SelectItem value='ETH' className='hover:bg-primary/10'>
              <span className='flex items-center gap-2'>
                <TokenETH className='w-4 h-4' />
                Ethereum (ETH)
              </span>
            </SelectItem>
            <SelectItem value='XRP' className='hover:bg-primary/10'>
              <span className='flex items-center gap-2'>
                <TokenXRP className='w-4 h-4 bg-black' />
                Ripple (XRP)
              </span>
            </SelectItem>
            <SelectItem value='USDT' className='hover:bg-primary/10'>
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
    <div className='relative'>
      <Label className='text-sm font-medium muted-text'>Wallet Address</Label>
      <div className='relative flex items-center'>
        <Input
          placeholder='Enter wallet address'
          className='glass-input mt-1 pl-11'
          name='address'
          value={newWallet.address}
          onChange={onChange}
        />
        <Copy className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/80 z-10 pointer-events-none' />
      </div>
    </div>
    <div className='flex gap-3 pt-4'>
      <Button
        type='button'
        variant='outline'
        onClick={onCancel}
        className='flex-1 glass-button'
        disabled={isLoading}
      >
        Cancel...
      </Button>
      <Button
        type='submit'
        className='flex-1 bg-primary hover:bg-primary/90 text-white font-semibold'
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
