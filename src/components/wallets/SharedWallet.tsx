import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { HandCoins, Loader2, Copy } from 'lucide-react';
import type React from 'react';

interface SharedWalletProps {
  sharedWallet: {
    asset: string;
    network: string;
  };
  assetNetworkOptions: Record<string, string[]>;
  sharedResult: any;
  isRegisteringShared: boolean;
  onAssetChange: (value: string) => void;
  onNetworkChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onCopy: (address: string) => void;
}

export const SharedWallet: React.FC<SharedWalletProps> = ({
  sharedWallet,
  assetNetworkOptions,
  sharedResult,
  isRegisteringShared,
  onAssetChange,
  onNetworkChange,
  onSubmit,
  onCancel,
  onCopy,
}) => (
  <form className='space-y-6 flex flex-col justify-center' onSubmit={onSubmit}>
    {/* Asset Select */}
    <div className='relative'>
      <Label className='text-sm font-medium muted-text'>Asset</Label>
      <div className='relative flex items-center'>
        <span className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 z-10 pointer-events-none'>
          <HandCoins className='w-5 h-5 text-primary/60' />
        </span>
        <Select value={sharedWallet.asset} onValueChange={onAssetChange}>
          <SelectTrigger className='glass-input mt-1 w-full pl-11'>
            <SelectValue placeholder='Select asset' />
          </SelectTrigger>
          <SelectContent className='glass-card-enhanced'>
            <SelectItem value='BTC'>Bitcoin (BTC)</SelectItem>
            <SelectItem value='ETH'>Ethereum (ETH)</SelectItem>
            <SelectItem value='XRP'>Ripple (XRP)</SelectItem>
            <SelectItem value='USDT'>Tether (USDT)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
    {/* Network Select */}
    <div className='relative'>
      <Label className='text-sm font-medium muted-text'>Network</Label>
      <div className='relative flex items-center'>
        <Select value={sharedWallet.network} onValueChange={onNetworkChange}>
          <SelectTrigger className='glass-input mt-1 w-full'>
            <SelectValue placeholder='Select network' />
          </SelectTrigger>
          <SelectContent className='glass-card-enhanced'>
            {assetNetworkOptions[sharedWallet.asset]?.map((net) => (
              <SelectItem key={net} value={net}>
                {net}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
    {/* Resultado: endereço compartilhado */}
    {sharedResult?.address && (
      <div className='flex flex-col items-center gap-2'>
        <Label className='muted-text text-sm'>Shared Address</Label>
        <code className='p-3 bg-surface rounded-lg text-sm font-mono break-all text-main border border-black/10 select-all'>
          {sharedResult.address}
        </code>
        <Button
          size='sm'
          variant='outline'
          className='glass-button'
          type='button'
          onClick={() => onCopy(sharedResult.address)}
        >
          <Copy className='w-4 h-4 mr-2' /> Copy Address
        </Button>
      </div>
    )}
    <div className='flex gap-3 pt-4'>
      <Button
        type='button'
        variant='outline'
        onClick={onCancel}
        className='flex-1 glass-button'
        disabled={isRegisteringShared}
      >
        Cancel
      </Button>
      <Button
        type='submit'
        className='flex-1 bg-primary hover:bg-primary/90 text-white font-semibold'
        disabled={isRegisteringShared}
      >
        {isRegisteringShared ? (
          <>
            <Loader2 className='w-4 h-4 animate-spin mr-2' />
            Registering...
          </>
        ) : (
          'Register Shared Address'
        )}
      </Button>
    </div>
  </form>
);
