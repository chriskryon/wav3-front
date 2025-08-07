import React from 'react';
import { Wallet, DollarSign } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Wav3Loading from '../loading-wav3';

export function BalancesSection({ accountBalances, isBalancesLoading, renderAssetIcon }: any) {

  // CSS para animações (poderia ser movido para um arquivo CSS global)
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Funções de formatação melhoradas
  const formatCryptoValue = (value: number, symbol: string) => {
    // Formato ultra-compacto para mobile
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M\n${symbol}`;
    } else if (value >= 10000) {
      return `${(value / 1000).toFixed(0)}K\n${symbol}`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K\n${symbol}`;
    } else if (value < 0.001) {
      return `${value.toFixed(4)}\n${symbol}`;
    } else if (value < 0.1) {
      return `${value.toFixed(3)}\n${symbol}`;
    } else if (value < 1) {
      return `${value.toFixed(2)}\n${symbol}`;
    } else if (value >= 100) {
      return `${value.toFixed(0)}\n${symbol}`;
    } else {
      return `${value.toFixed(2)}\n${symbol}`;
    }
  };

  const formatFiatValue = (value: number, symbol: string) => {
    // Formato ultra-compacto com quebra de linha
    const formatCompact = (val: number, currency: string, locale: string) => {
      if (val >= 1000000) {
        const formatted = (val / 1000000).toLocaleString(locale, { 
          style: 'currency', 
          currency,
          minimumFractionDigits: 0,
          maximumFractionDigits: 1
        });
        return formatted.replace(/[A-Z]{3}/, '') + 'M';
      } else if (val >= 10000) {
        const formatted = (val / 1000).toLocaleString(locale, { 
          style: 'currency', 
          currency,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        });
        return formatted.replace(/[A-Z]{3}/, '') + 'K';
      } else if (val >= 1000) {
        const formatted = (val / 1000).toLocaleString(locale, { 
          style: 'currency', 
          currency,
          minimumFractionDigits: 0,
          maximumFractionDigits: 1
        });
        return formatted.replace(/[A-Z]{3}/, '') + 'K';
      } else {
        return val.toLocaleString(locale, { 
          style: 'currency', 
          currency,
          minimumFractionDigits: 0,
          maximumFractionDigits: val >= 100 ? 0 : 2
        });
      }
    };

    switch(symbol) {
      case 'BRL':
        return formatCompact(value, 'BRL', 'pt-BR');
      case 'USD':
        return formatCompact(value, 'USD', 'en-US');
      case 'EUR':
        return formatCompact(value, 'EUR', 'de-DE');
      default:
        return formatCompact(value, symbol, 'en-US');
    }
  };

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

  // Função genérica para renderizar qualquer tipo de balance
  function renderBalances(balances: any[], type: 'crypto' | 'fiat', emptyStateIcon: any, emptyStateTitle: string, emptyStateSubtitle: string) {
    if (isBalancesLoading) {
      return (
        <div className="flex justify-center py-8">
          <Wav3Loading />
        </div>
      );
    }
    
    if (balances.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className={`
            w-16 h-16 rounded-2xl 
            bg-gradient-to-br ${type === 'crypto' ? 'from-green-100 to-emerald-100' : 'from-blue-100 to-indigo-100'}
            flex items-center justify-center mb-4
            shadow-sm
          `}>
            {React.cloneElement(emptyStateIcon, { 
              className: `w-8 h-8 ${type === 'crypto' ? 'text-green-500' : 'text-blue-500'}` 
            })}
          </div>
          <h3 className="text-gray-900 text-sm font-semibold mb-2">{emptyStateTitle}</h3>
          <p className="text-gray-500 text-xs max-w-xs leading-relaxed">{emptyStateSubtitle}</p>
        </div>
      );
    }
    
    const isCompact = balances.length > 3;
    
    return (
      <div className={`grid ${isCompact ? 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'}`}>
        {balances.map((b: any, index: number) => (
          <div
            key={b.symbol}
            className={`
              group relative overflow-hidden
              ${isCompact ? 'p-3 lg:p-4' : 'p-4 lg:p-5'} 
              bg-gradient-to-br from-white to-gray-50/80
              border border-gray-200/60 
              rounded-xl lg:rounded-2xl
              shadow-sm hover:shadow-lg active:shadow-md
              transition-all duration-300 ease-out
              cursor-pointer 
              hover:scale-[1.02] active:scale-[0.98]
              hover:-translate-y-1 active:translate-y-0
              hover:border-${type === 'crypto' ? 'green' : 'blue'}-300/70
              backdrop-blur-sm
              touch-manipulation
              min-h-[140px] lg:min-h-[150px]
            `}
            style={{ 
              animationDelay: `${index * 80}ms`,
              animation: 'fadeInUp 0.5s ease-out forwards'
            }}
          >
            {/* Background Pattern - mais sutil no mobile */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className={`absolute inset-0 bg-gradient-to-br ${type === 'crypto' ? 'from-green-500/3 to-emerald-500/6' : 'from-blue-500/3 to-indigo-500/6'}`} />
              <div className="absolute top-0 right-0 w-20 lg:w-32 h-20 lg:h-32 bg-white/5 rounded-full -translate-y-10 lg:-translate-y-16 translate-x-10 lg:translate-x-16" />
            </div>

            <div className="relative flex flex-col items-center justify-center text-center h-full space-y-2 lg:space-y-3">
              {/* Asset Icon - responsivo e touch-friendly */}
              <div className={`
                relative flex items-center justify-center 
                ${isCompact ? 'w-10 h-10 lg:w-12 lg:h-12' : 'w-12 h-12 lg:w-14 lg:h-14'} 
                rounded-xl lg:rounded-2xl
                bg-gradient-to-br ${type === 'crypto' ? 'from-green-500/10 to-emerald-500/15' : 'from-blue-500/10 to-indigo-500/15'}
                border ${type === 'crypto' ? 'border-green-200/50' : 'border-blue-200/50'}
                group-hover:scale-110 group-active:scale-105
                transition-all duration-300 ease-out
                shadow-sm group-hover:shadow-md
                flex-shrink-0
              `}>
                <div className={`${isCompact ? 'w-6 h-6 lg:w-7 lg:h-7' : 'w-7 h-7 lg:w-8 lg:h-8'}`}>
                  {renderAssetIcon(b.symbol, b.assetInfo?.icon || '', 'background')}
                </div>
                
                {/* Glow effect - reduzido no mobile */}
                <div className={`
                  absolute inset-0 rounded-xl lg:rounded-2xl
                  bg-gradient-to-br ${type === 'crypto' ? 'from-green-400/10 to-emerald-400/10' : 'from-blue-400/10 to-indigo-400/10'}
                  opacity-0 group-hover:opacity-100 
                  transition-opacity duration-300
                  blur-sm
                `} />
              </div>
              
              {/* Asset Symbol - melhor legibilidade */}
              <div className={`
                font-bold text-gray-700 
                ${isCompact ? 'text-sm lg:text-base' : 'text-sm lg:text-base'} 
                tracking-wide uppercase
                group-hover:text-gray-900
                transition-colors duration-300
                flex-shrink-0
              `}>
                {b.symbol}
              </div>
              
              {/* Balance Value - ultra-compacto mobile */}
              <div className={`
                font-bold 
                ${type === 'crypto' ? 'text-green-600 group-hover:text-green-700' : 'text-blue-600 group-hover:text-blue-700'}
                ${isCompact ? 'text-xs lg:text-sm' : 'text-sm lg:text-base'} 
                tabular-nums leading-tight
                transition-all duration-300
                drop-shadow-sm
                text-center
                w-full
                px-2
                overflow-hidden
                whitespace-pre-line
                max-w-full
                word-break-all
              `}>
                <span className="block">
                  {type === 'fiat' ? formatFiatValue(Number(b.balance), b.symbol) : formatCryptoValue(Number(b.balance), b.symbol)}
                </span>
              </div>
            </div>

            {/* Mobile-specific touch indicator */}
            <div className={`
              absolute bottom-1 right-1 lg:bottom-2 lg:right-2
              w-1 h-1 lg:w-1.5 lg:h-1.5
              rounded-full
              ${type === 'crypto' ? 'bg-green-400/30' : 'bg-blue-400/30'}
              group-hover:bg-current
              transition-colors duration-300
            `} />
          </div>
        ))}
      </div>
    );
  }

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
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6'>
      {/* Crypto Balances */}
      <Card className='group bg-gradient-to-br from-white via-white to-green-50/30 border-0 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden backdrop-blur-sm'>
        <CardHeader className='pb-4 sm:pb-6 px-4 sm:px-6 bg-gradient-to-r from-green-500/5 to-emerald-500/5'>
          <div className='flex items-center gap-3 sm:gap-4'>
            <div className='relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300'>
              <Wallet className='w-6 h-6 sm:w-7 sm:h-7' />
              <div className='absolute inset-0 rounded-xl sm:rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
            </div>
            <div className='flex-1 min-w-0'>
              <CardTitle className='text-lg sm:text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors duration-300 truncate'>
                Crypto Portfolio
              </CardTitle>
              <p className='text-xs sm:text-sm text-gray-600 mt-1 font-medium truncate'>Digital assets & cryptocurrencies</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className='pt-0 px-4 sm:px-6 pb-4 sm:pb-6'>
          {renderCryptoBalances()}
        </CardContent>
      </Card>

      {/* Fiat Balances */}
      <Card className='group bg-gradient-to-br from-white via-white to-blue-50/30 border-0 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden backdrop-blur-sm'>
        <CardHeader className='pb-4 sm:pb-6 px-4 sm:px-6 bg-gradient-to-r from-blue-500/5 to-indigo-500/5'>
          <div className='flex items-center gap-3 sm:gap-4'>
            <div className='relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300'>
              <DollarSign className='w-6 h-6 sm:w-7 sm:h-7' />
              <div className='absolute inset-0 rounded-xl sm:rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
            </div>
            <div className='flex-1 min-w-0'>
              <CardTitle className='text-lg sm:text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-300 truncate'>
                Fiat Balances
              </CardTitle>
              <p className='text-xs sm:text-sm text-gray-600 mt-1 font-medium truncate'>Traditional currencies & cash</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className='pt-0 px-4 sm:px-6 pb-4 sm:pb-6'>
          {renderFiatBalances()}
        </CardContent>
      </Card>
    </div>
  );
}
