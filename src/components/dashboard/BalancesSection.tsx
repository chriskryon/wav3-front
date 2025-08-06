import { Wallet, DollarSign } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Wav3Loading from '../loading-wav3';

export function BalancesSection({ accountBalances, isBalancesLoading, renderAssetIcon }: any) {
  function renderCryptoBalances() {
    if (isBalancesLoading) {
      return (
        <Wav3Loading />
      );
    }
    const cryptoBalances = (accountBalances?.filter((b: any) => b.type === 'crypto' && b.balance !== null) ?? []);
    if (cryptoBalances.length === 0) {
      return <div className="text-center text-muted text-xs">No crypto assets found.</div>;
    }
    
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {cryptoBalances.map((b: any) => (
          <div key={b.symbol} className="flex flex-col items-center justify-center bg-white/80 border border-wav3 px-1.5 py-2 rounded-md shadow-none hover:shadow-md transition-shadow duration-150 cursor-pointer min-w-[90px]">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 mb-1 overflow-hidden">
              {renderAssetIcon(b.symbol, b.assetInfo?.icon || '', 'background')}
            </div>
            <div className="font-bold text-main text-[13px] mb-0.5 tracking-tight truncate">{b.symbol}</div>
            <div className="font-semibold text-primary text-[13px] tabular-nums leading-tight">
              {Number(b.balance).toLocaleString(undefined, { style: 'currency', currency: b.assetInfo?.currency || 'USD', maximumFractionDigits: 2 })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  function renderFiatBalances() {
    if (isBalancesLoading) {
      return (
        <Wav3Loading />
      );
    }
    const fiatBalances = (accountBalances?.filter((b: any) => b.type === 'fiat' && b.balance !== null) ?? []);
    if (fiatBalances.length === 0) {
      return <div className="text-center text-muted text-xs">No fiat assets found.</div>;
    }
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {fiatBalances.map((b: any) => (
          <div key={b.symbol} className="flex flex-col items-center justify-center bg-white/80 border border-wav3/21 px-1.5 py-2 rounded-md shadow-none hover:shadow-md transition-shadow duration-150 cursor-pointer min-w-[90px]">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 mb-1 overflow-hidden">
              {renderAssetIcon(b.symbol, b.assetInfo?.icon || '', 'background')}
            </div>
            <div className="font-bold text-main text-[13px] mb-0.5 tracking-tight truncate">{b.symbol}</div>
            <div className="font-semibold text-primary text-[13px] tabular-nums leading-tight">
              {Number(b.balance).toLocaleString(undefined, { style: 'currency', currency: b.assetInfo?.currency || b.symbol || 'USD', maximumFractionDigits: 2 })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
      {/* Crypto Balances */}
      <Card className='glass-card-enhanced glass-hover transition-transform transform hover:scale-105'>
        <CardHeader className='pb-2'>
          <div className='flex items-center gap-3 mb-2'>
            <div className='w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 text-white flex items-center justify-center shadow-md'>
              <Wallet className='w-5 h-5' />
            </div>
            <CardTitle className='text-base font-bold text-main'>Crypto Balances</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {renderCryptoBalances()}
        </CardContent>
      </Card>

      {/* Fiat Balances */}
      <Card className='glass-card-enhanced glass-hover transition-transform transform hover:scale-105'>
        <CardHeader className='pb-2'>
          <div className='flex items-center gap-3 mb-2'>
            <div className='w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white flex items-center justify-center shadow-md'>
              <DollarSign className='w-5 h-5' />
            </div>
            <CardTitle className='text-base font-bold text-main'>Fiat Balances</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {renderFiatBalances()}
        </CardContent>
      </Card>
    </div>
  );
}
