import { Wallet, DollarSign } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Wav3Loading from '../loading-wav3';

export function BalancesSection({ accountBalances, isBalancesLoading, renderAssetIcon }: any) {
  function renderCryptoBalances() {
    if (isBalancesLoading) {
      return (
        <div className="flex justify-center py-8">
          <Wav3Loading />
        </div>
      );
    }
    const cryptoBalances = (accountBalances?.filter((b: any) => b.type === 'crypto' && b.balance !== null) ?? []);
    if (cryptoBalances.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-2">
            <Wallet className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-500 text-xs font-medium">No crypto assets found</p>
          <p className="text-gray-400 text-xs mt-1">Your crypto balances will appear here</p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {cryptoBalances.map((b: any) => (
          <div 
            key={b.symbol} 
            className="group relative bg-white/90 border border-gray-100 rounded-lg p-1.5 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer hover:scale-105 hover:border-gray-200 h-16"
          >
            <div className="flex h-full items-center">
              {/* Left Column: Flag */}
              <div className="flex items-center justify-center w-10">
                <div className="flex items-center justify-center w-8 h-8 rounded-md bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                  {renderAssetIcon(b.symbol, b.assetInfo?.icon || '', 'background')}
                </div>
              </div>
              
              {/* Right Column: Symbol + Value */}
              <div className="flex-1 flex flex-col justify-center items-center min-w-0">
                <div className="font-bold text-gray-900 text-xs tracking-tight truncate">
                  {b.symbol}
                </div>
                <div className="font-semibold text-purple-600 text-xs tabular-nums truncate">
                  {Number(b.balance).toLocaleString(undefined, { 
                    style: 'currency', 
                    currency: b.assetInfo?.currency || 'USD', 
                    maximumFractionDigits: 0 
                  })}
                </div>
              </div>
            </div>

            {/* Hover Gradient */}
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ))}
      </div>
    );
  }

  function renderFiatBalances() {
    if (isBalancesLoading) {
      return (
        <div className="flex justify-center py-8">
          <Wav3Loading />
        </div>
      );
    }
    const fiatBalances = (accountBalances?.filter((b: any) => b.type === 'fiat' && b.balance !== null) ?? []);
    if (fiatBalances.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-2">
            <DollarSign className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-500 text-xs font-medium">No fiat assets found</p>
          <p className="text-gray-400 text-xs mt-1">Your fiat balances will appear here</p>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {fiatBalances.map((b: any) => (
          <div 
            key={b.symbol} 
            className="group relative bg-white/90 border border-gray-100 rounded-lg p-1.5 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer hover:scale-105 hover:border-gray-200 h-16"
          >
            <div className="flex h-full items-center">
              {/* Left Column: Flag */}
              <div className="flex items-center justify-center w-10">
                <div className="flex items-center justify-center w-8 h-8 rounded-md bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 group-hover:scale-110 transition-transform duration-300">
                  {renderAssetIcon(b.symbol, b.assetInfo?.icon || '', 'background')}
                </div>
              </div>
              
              {/* Right Column: Symbol + Value */}
              <div className="flex-1 flex flex-col justify-center items-center min-w-0">
                <div className="font-bold text-gray-900 text-xs tracking-tight truncate">
                  {b.symbol}
                </div>
                <div className="font-semibold text-green-600 text-xs tabular-nums truncate">
                  {Number(b.balance).toLocaleString(undefined, { 
                    style: 'currency', 
                    currency: b.assetInfo?.currency || b.symbol || 'USD', 
                    maximumFractionDigits: 0 
                  })}
                </div>
              </div>
            </div>

            {/* Hover Gradient */}
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
      {/* Crypto Balances */}
      <Card className='bg-white/90 border border-gray-100 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden'>
        <CardHeader className='pb-4'>
          <div className='flex items-center gap-4'>
            <div className='w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 text-white flex items-center justify-center shadow-lg'>
              <Wallet className='w-6 h-6' />
            </div>
            <div>
              <CardTitle className='text-lg font-bold text-gray-900'>Crypto Balances</CardTitle>
              <p className='text-sm text-gray-500 mt-1'>Your cryptocurrency portfolio</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className='pt-0'>
          {renderCryptoBalances()}
        </CardContent>
      </Card>

      {/* Fiat Balances */}
      <Card className='bg-white/90 border border-gray-100 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden'>
        <CardHeader className='pb-4'>
          <div className='flex items-center gap-4'>
            <div className='w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 text-white flex items-center justify-center shadow-lg'>
              <DollarSign className='w-6 h-6' />
            </div>
            <div>
              <CardTitle className='text-lg font-bold text-gray-900'>Fiat Balances</CardTitle>
              <p className='text-sm text-gray-500 mt-1'>Your traditional currency balances</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className='pt-0'>
          {renderFiatBalances()}
        </CardContent>
      </Card>
    </div>
  );
}
