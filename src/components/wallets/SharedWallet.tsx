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
import {
  TokenBTC,
  TokenETH,
  TokenXRP,
  TokenUSDT,
} from '@web3icons/react';

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
}) => {
  // Se já temos resultado, mostra as informações da carteira criada
  if (sharedResult?.address) {
    return (
      <div className='space-y-4'>
        <div className='text-center p-4 bg-green-50 rounded-lg border border-green-200'>
          <h3 className='text-lg font-semibold text-green-800 mb-2'>
            Wallet Created Successfully!
          </h3>
          <p className='text-sm text-green-600'>
            Your {sharedResult.asset} wallet is ready for deposits
          </p>
        </div>
        
        <div className='space-y-3'>
          <div>
            <Label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>Asset</Label>
            <p className='text-sm font-semibold text-gray-900 mt-1'>{sharedResult.asset}</p>
          </div>
          
          <div>
            <Label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>Network</Label>
            <p className='text-sm font-semibold text-gray-900 mt-1'>{sharedResult.network}</p>
          </div>
          
          <div>
            <Label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>Wallet Address</Label>
            <div className='flex items-center gap-2 mt-1'>
              <code className='flex-1 p-2 bg-gray-50 rounded border border-gray-200 text-xs font-mono break-all text-gray-900'>
                {sharedResult.address}
              </code>
              <Button
                size='sm'
                onClick={() => onCopy(sharedResult.address)}
                className='bg-[#00109b] hover:bg-[#188a91] text-white px-3 py-2 rounded border border-[#00109b] transition-colors'
              >
                <Copy className='w-4 h-4' />
              </Button>
            </div>
            {sharedResult.address_tag && (
              <div className='mt-2'>
                <Label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>Address Tag</Label>
                <code className='block mt-1 p-2 bg-gray-50 rounded border border-gray-200 text-xs font-mono text-gray-900'>
                  {sharedResult.address_tag}
                </code>
              </div>
            )}
          </div>
        </div>
        
        <Button
          onClick={onCancel}
          className='w-full bg-[#00109b] hover:bg-[#188a91] text-white font-medium py-2 rounded-lg border border-[#00109b] transition-colors'
        >
          Done
        </Button>
      </div>
    );
  }
  
  // Formulário para criar nova carteira compartilhada
  return (
    <form className='space-y-4 flex flex-col justify-center' onSubmit={onSubmit}>
      {/* Asset Select */}
      <div>
        <Label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>Asset</Label>
        <div className='relative flex items-center mt-1'>
          <span className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 z-10 pointer-events-none'>
            <HandCoins className='w-4 h-4 text-gray-400' />
          </span>
          <Select value={sharedWallet.asset} onValueChange={onAssetChange}>
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
      
      {/* Network Select - só aparece se asset estiver selecionado */}
      {sharedWallet.asset && (
        <div>
          <Label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>Network</Label>
          <div className='relative flex items-center mt-1'>
            <Select value={sharedWallet.network} onValueChange={onNetworkChange}>
              <SelectTrigger className='bg-white border border-gray-300 rounded-lg py-2 focus:border-[#00109b] focus:ring-1 focus:ring-[#00109b] transition-colors'>
                <SelectValue placeholder='Select network' />
              </SelectTrigger>
              <SelectContent className='bg-white border border-gray-200 rounded-lg shadow-lg'>
                {assetNetworkOptions[sharedWallet.asset]?.map((network) => (
                  <SelectItem key={network} value={network} className='hover:bg-gray-50 focus:bg-gray-50'>
                    {network.charAt(0).toUpperCase() + network.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      
      <div className='flex gap-3 pt-4'>
        <Button
          type='button'
          variant='outline'
          onClick={onCancel}
          className='flex-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors font-medium py-2 rounded-lg'
          disabled={isRegisteringShared}
        >
          Cancel
        </Button>
        <Button
          type='submit'
          className='flex-1 bg-[#00109b] hover:bg-[#188a91] text-white font-medium py-2 rounded-lg border border-[#00109b] transition-colors'
          disabled={isRegisteringShared || !sharedWallet.asset || !sharedWallet.network}
        >
          {isRegisteringShared ? (
            <>
              <Loader2 className='w-4 h-4 animate-spin mr-2' />
              Creating...
            </>
          ) : (
            'Create Deposit Wallet'
          )}
        </Button>
      </div>
    </form>
  );
};
