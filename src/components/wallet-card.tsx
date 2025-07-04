import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Eye } from 'lucide-react';
import { TokenIcon } from '@/components/ui/token-icon';

// Paleta de gradientes por asset
const assetGradients: Record<string, string> = {
  BTC: 'from-orange-400/80 to-yellow-500/80',
  ETH: 'from-blue-500/80 to-purple-600/80',
  XRP: 'from-gray-700/80 to-blue-400/80',
  USDT: 'from-green-400/80 to-emerald-500/80',
};

interface WalletCardProps {
  wallet: any;
  type: 'external' | 'shared';
  onCopy: (address: string) => void;
  onView: (wallet: any) => void;
}

function formatWeb3Address(address: string) {
  if (!address) return '';
  if (address.length <= 16) return address;
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
}

export function WalletCard({ wallet, type, onCopy, onView }: WalletCardProps) {
  return (
    <Card
      className='glass-card-enhanced glass-hover cursor-pointer overflow-hidden w-full shadow-xl border-0 group transition-transform duration-300 hover:scale-[1.025] hover:shadow-2xl'
      onClick={() => onView(wallet)}
    >
      <CardContent className='p-0'>
        {/* Wallet Card Visual */}
        <div
          className={`relative min-h-[8rem] sm:min-h-[8rem] bg-gradient-to-br ${assetGradients[wallet.asset] || wallet.gradient || 'from-gray-400 to-gray-600'} p-3 sm:p-6 overflow-hidden flex flex-col justify-between`}
        >
          {/* Background Pattern */}
          <div className='absolute inset-0 opacity-25 pointer-events-none select-none'>
            <div className='absolute top-2 right-2 sm:top-4 sm:right-4 w-10 h-10 sm:w-20 sm:h-20 rounded-full bg-white/30 blur-xl'></div>
            <div className='absolute bottom-2 left-2 sm:bottom-4 sm:left-4 w-8 h-8 sm:w-16 sm:h-16 rounded-full bg-white/20 blur-md'></div>
            <div className='absolute top-1/2 left-1/2 w-6 h-6 sm:w-12 sm:h-12 rounded-full bg-white/10 transform -translate-x-1/2 -translate-y-1/2 blur-sm'></div>
          </div>
          {/* Wallet Content */}
          <div className='relative z-10 h-full flex flex-col justify-between text-white'>
            {/* Top: Asset + Type */}
            <div className='flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2 sm:gap-0'>
              <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full'>
                <div
                  className={`rounded-full bg-white/20 p-1.5 sm:p-2 flex items-center justify-center shadow-md border border-white/10`}
                >
                  <span className='mr-2'>
                    <TokenIcon
                      symbol={wallet.asset}
                      variant='mono'
                      size={24}
                      color='#fff'
                    />
                  </span>
                  <span className='font-bold text-base sm:text-lg uppercase tracking-wider drop-shadow-sm'>
                    {wallet.asset}
                  </span>
                </div>
                <span className='text-[10px] sm:text-xs bg-black/30 rounded px-2 py-0.5 font-semibold uppercase tracking-wider shadow-sm'>
                  {wallet.wallet_type === 'external' ? 'PAYMENT' : 'WITHDRAW'}
                </span>
              </div>
              <span className='text-[10px] sm:text-xs font-mono opacity-80 bg-black/20 rounded px-2 py-0.5 shadow-sm mt-1 sm:mt-0 w-fit'>
                {wallet.network}
              </span>
            </div>
            {/* Web3 Address */}
            <div className='flex flex-col gap-1 mt-2'>
              <div className='relative w-full flex items-center group/address'>
                <span className='font-mono opacity-95 max-w-full bg-black/10 rounded-lg pl-4 pr-4 py-2 shadow-inner tracking-tight flex-1 text-xs sm:text-base md:text-lg select-all transition-all group-hover/address:bg-black/20 group-hover/address:scale-[1.01] group-hover/address:shadow-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/60'>
                  {formatWeb3Address(wallet.address)}
                </span>
                <Button
                  size='icon'
                  variant='ghost'
                  onClick={(e) => {
                    e.stopPropagation();
                    onCopy(wallet.address);
                  }}
                  className='ml-2 h-8 w-8 p-0 hover:bg-primary/90 bg-white/80 text-primary border border-white/20 shadow-md transition-all group-hover/address:scale-110'
                  aria-label='Copiar endereço'
                >
                  <Copy className='w-4 h-4' />
                </Button>
              </div>
              {wallet.address_tag && (
                <span className='text-[10px] bg-black/30 rounded px-2 py-0.5 font-mono mt-1 shadow-sm'>
                  Tag: {wallet.address_tag}
                </span>
              )}
            </div>
            {/* Footer: Data + Ações */}
            <div className='flex flex-col sm:flex-row items-start sm:items-end justify-between mt-4 gap-2 sm:gap-0 w-full'>
              <span className='text-[10px] sm:text-xs opacity-80 font-mono flex items-center gap-1'>
                <span className='w-2 h-2 rounded-full bg-white/60 animate-pulse mr-1' />
                {new Date(wallet.created_at).toLocaleDateString()}
              </span>
              <div className='flex gap-2 mt-2 sm:mt-0 flex-wrap'>
                <Button
                  size='icon'
                  variant='ghost'
                  onClick={(e) => {
                    e.stopPropagation();
                    onCopy(wallet.address);
                  }}
                  className='h-8 w-8 p-0 hover:bg-white/20 text-white border border-white/10 shadow-md'
                  aria-label='Copiar endereço'
                >
                  <Copy className='w-4 h-4' />
                </Button>
                <Button
                  size='icon'
                  variant='outline'
                  className='h-8 w-8 p-0 glass-button bg-white/30 border-white/20 text-white hover:bg-white/40 hover:text-primary shadow-md'
                  onClick={(e) => {
                    e.stopPropagation();
                    onView(wallet);
                  }}
                  aria-label='Ver detalhes'
                >
                  <Eye className='w-4 h-4' />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
