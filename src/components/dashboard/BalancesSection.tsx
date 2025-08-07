import { Wallet, DollarSign } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Wav3Loading from '../loading-wav3';

export function BalancesSection({ accountBalances, isBalancesLoading, renderAssetIcon }: any) {

  // Mock de alguns balances de crypto para testes
  const mockCryptoBalances = [
    {
      symbol: 'BTC',
      type: 'crypto',
      balance: 0.12345678,
      assetInfo: { icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png', name: 'Bitcoin', networks: ['bitcoin'] }
    },
    {
      symbol: 'ETH',
      type: 'crypto',
      balance: 2.98765432,
      assetInfo: { icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', name: 'Ethereum', networks: ['erc-20'] }
    },
    {
      symbol: 'XRP',
      type: 'crypto',
      balance: 5000.25,
      assetInfo: { icon: 'https://cryptologos.cc/logos/xrp-xrp-logo.png', name: 'Ripple', networks: ['ripple'] }
    },
    {
      symbol: 'USDT',
      type: 'crypto',
      balance: 1200.50,
      assetInfo: { icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png', name: 'USD Tether', networks: ['tron', 'bsc'] }
    },
    {
      symbol: 'USDRIF',
      type: 'crypto',
      balance: 1000.00,
      assetInfo: { icon: '', name: 'USDRIF', networks: ['rsk'] }
    },
    {
      symbol: 'USDC',
      type: 'crypto',
      balance: 800.00,
      assetInfo: { icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png', name: 'USDC', networks: ['ethereum', 'polygon', 'solana'] }
    }
  ];

  // Exemplo de uso:
  // const accountBalances = mockCryptoBalances;

  function renderCryptoBalances() {
    if (isBalancesLoading) {
      return (
        <div className="flex justify-center py-8">
          <Wav3Loading />
        </div>
      );
    }
    const cryptoBalances = (accountBalances?.filter((b: any) => b.type === 'crypto' && b.balance !== null) ?? []);
    if (mockCryptoBalances.length === 0) {
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
    
    // Verificar se precisa de layout compacto
      const isCompact = mockCryptoBalances.length > 3;
      
      return (
        <div className={`grid ${isCompact ? 'grid-cols-3 sm:grid-cols-4 gap-2' : 'grid-cols-2 sm:grid-cols-3 gap-3'}`}>
          {mockCryptoBalances.map((b: any) => (
            <div 
              key={b.symbol} 
              className={`group relative bg-white border border-gray-200 rounded-xl ${isCompact ? 'p-3' : 'p-4'} shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:border-green-300`}
            >
              <div className={`flex flex-col items-center text-center ${isCompact ? 'space-y-2' : 'space-y-3'}`}>
                {/* Asset Icon */}
                <div className={`flex items-center justify-center ${isCompact ? 'w-8 h-8' : 'w-12 h-12'} rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-200 group-hover:scale-110 transition-transform duration-300`}>
                  {renderAssetIcon(b.symbol, b.assetInfo?.icon || '', 'background')}
                </div>
                
                {/* Asset Symbol */}
                <div className={`font-bold text-gray-700 ${isCompact ? 'text-xs' : 'text-sm'} tracking-wide uppercase`}>
                  {b.symbol}
                </div>
                
                {/* Balance Value - DESTACADO */}
                <div className={`font-bold text-green-600 ${isCompact ? 'text-sm' : 'text-lg'} tabular-nums leading-tight`}>
                  {Number(b.balance).toLocaleString(undefined, { 
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 8 
                  })} {b.symbol}
                </div>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
    // Verificar se precisa de layout compacto
    const isCompact = fiatBalances.length > 3;
    
    return (
      <div className={`grid ${isCompact ? 'grid-cols-3 sm:grid-cols-4 gap-2' : 'grid-cols-2 sm:grid-cols-3 gap-3'}`}>
        {fiatBalances.map((b: any) => (
          <div 
            key={b.symbol} 
            className={`group relative bg-white border border-gray-200 rounded-xl ${isCompact ? 'p-3' : 'p-4'} shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:border-green-300`}
          >
            <div className={`flex flex-col items-center text-center ${isCompact ? 'space-y-2' : 'space-y-3'}`}>
              {/* Asset Icon */}
              <div className={`flex items-center justify-center ${isCompact ? 'w-8 h-8' : 'w-12 h-12'} rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-200 group-hover:scale-110 transition-transform duration-300`}>
                {renderAssetIcon(b.symbol, b.assetInfo?.icon || '', 'background')}
              </div>
              
              {/* Asset Symbol */}
              <div className={`font-bold text-gray-700 ${isCompact ? 'text-xs' : 'text-sm'} tracking-wide uppercase`}>
                {b.symbol}
              </div>
              
              {/* Balance Value - DESTACADO */}
              <div className={`font-bold text-green-600 ${isCompact ? 'text-sm' : 'text-lg'} tabular-nums leading-tight`}>
                {(() => {
                  const value = Number(b.balance);
                  const symbol = b.symbol;
                  
                  // Formatação específica por moeda
                  switch(symbol) {
                    case 'BRL':
                      return value.toLocaleString('pt-BR', { 
                        style: 'currency', 
                        currency: 'BRL',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      });
                    case 'USD':
                      return value.toLocaleString('en-US', { 
                        style: 'currency', 
                        currency: 'USD',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      });
                    case 'EUR':
                      return value.toLocaleString('de-DE', { 
                        style: 'currency', 
                        currency: 'EUR',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      });
                    default:
                      // Para outras moedas, usar formatação genérica
                      return value.toLocaleString(undefined, { 
                        style: 'currency', 
                        currency: symbol,
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      });
                  }
                })()}
              </div>
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
            <div className='w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 text-white flex items-center justify-center shadow-lg'>
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
