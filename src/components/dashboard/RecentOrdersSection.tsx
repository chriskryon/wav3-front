import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, XCircle, ArrowRight } from 'lucide-react';
import { ICONS_CRYPTO_FIAT as icons } from '@/lib/icon-utils';
import Image from 'next/image';

// Helper: format currency based on asset type and symbol - mobile optimized
function formatAssetValue(amount: number, symbol: string, isSource: boolean = false): string {
  // Lista de moedas fiat conhecidas
  const fiatCurrencies = ['BRL', 'USD', 'EUR', 'COP', 'MXN', 'ARS'];
  const isFiat = fiatCurrencies.includes(symbol);
  
  if (isFiat) {
    // Formatação compacta para mobile
    const formatCompact = (val: number, currency: string, locale: string) => {
      if (val >= 1000000) {
        return `${(val / 1000000).toLocaleString(locale, { 
          style: 'currency', 
          currency,
          minimumFractionDigits: 0,
          maximumFractionDigits: 1
        })}M`;
      } else if (val >= 1000) {
        return `${(val / 1000).toLocaleString(locale, { 
          style: 'currency', 
          currency,
          minimumFractionDigits: 0,
          maximumFractionDigits: 1
        })}K`;
      } else {
        return val.toLocaleString(locale, { 
          style: 'currency', 
          currency,
          minimumFractionDigits: 0,
          maximumFractionDigits: 2
        });
      }
    };

    switch(symbol) {
      case 'BRL':
        return formatCompact(amount, 'BRL', 'pt-BR');
      case 'USD':
        return formatCompact(amount, 'USD', 'en-US');
      case 'EUR':
        return formatCompact(amount, 'EUR', 'de-DE');
      default:
        return formatCompact(amount, symbol, 'en-US');
    }
  } else {
    // Para crypto: formato compacto
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M ${symbol}`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K ${symbol}`;
    } else if (amount < 0.01) {
      return `${amount.toFixed(4)} ${symbol}`;
    } else if (amount < 1) {
      return `${amount.toFixed(3)} ${symbol}`;
    } else {
      return `${amount.toFixed(2)} ${symbol}`;
    }
  }
}

// Helper: status icon and color
function getStatusMeta(status: string) {
  switch (status) {
    case 'confirmed':
      return { icon: <CheckCircle2 className="w-5 h-5 text-green-500" />, color: 'bg-green-500/10 text-green-700 border-green-500/20' };
    case 'pending':
      return { icon: <Clock className="w-5 h-5 text-yellow-500" />, color: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20' };
    case 'failed':
      return { icon: <XCircle className="w-5 h-5 text-red-500" />, color: 'bg-red-500/10 text-red-700 border-red-500/20' };
    default:
      return { icon: <Clock className="w-5 h-5 text-gray-400" />, color: 'bg-gray-200 text-gray-600 border-gray-300' };
  }
}

// Helper: asset icon com fallback simples
function renderAssetIcon(symbol: string, fallbackUrl: string, variant: 'background' | 'default' = 'default') {
  const IconComponent = (icons as Record<string, any>)[symbol];
  if (IconComponent) {
    const isReactComponent = typeof IconComponent === 'function' || (typeof IconComponent === 'object' && IconComponent !== null);
    if (isReactComponent) {
      return <IconComponent className="w-6 h-6 shadow" variant={variant} />;
    } else if (typeof IconComponent === 'string') {
      return <Image src={IconComponent} alt={symbol} width={24} height={24} className="rounded-full border shadow bg-white" />;
    }
  }
  // Fallback para o ícone da API se não estiver no objeto icons e se a URL for válida
  if (fallbackUrl && fallbackUrl.trim() !== '') {
    return <Image src={fallbackUrl} alt={symbol} width={24} height={24} className="rounded-full border shadow bg-white" />;
  }
  
  // Fallback final com iniciais se não houver ícone disponível
  return (
    <span className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-600 font-bold text-xs uppercase border border-gray-300 shadow">
      {symbol.slice(0, 2)}
    </span>
  );
}

// Helper: format date
function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('pt-BR');
}

export function RecentOrdersSection({ recentTransactions }: any) {
  return (
    <Card className="glass-card-enhanced">
      <CardHeader className="pb-3 px-3 sm:px-6">
        <CardTitle className="text-lg font-semibold text-main tracking-tight">
          Recent Orders
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-0 px-3 sm:px-6">
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {recentTransactions.slice(0, 5).map((order: any, index: number) => {
            const statusMeta = getStatusMeta(order.status);
            return (
              <div
                key={order.id}
                className={`
                  relative p-3 sm:p-4 rounded-xl 
                  bg-gradient-to-r from-white/95 to-white/90 
                  hover:from-primary/5 hover:to-primary/10 
                  border border-white/40 hover:border-primary/20
                  transition-all duration-200 ease-out
                  shadow-sm hover:shadow-md
                  ${index === 0 ? 'ring-1 ring-primary/10' : ''}
                `}
              >
                {/* Mobile Layout */}
                <div className="block sm:hidden">
                  {/* Status Badge - Top */}
                  <div className="flex justify-between items-center mb-3">
                    <Badge
                      className={`
                        flex items-center gap-1.5 px-2 py-1 
                        border font-medium text-xs
                        ${statusMeta.color}
                        shadow-sm
                      `}
                    >
                      {statusMeta.icon}
                    </Badge>
                    <span className="text-xs font-medium text-gray-500">
                      {formatDate(order.created_at)}
                    </span>
                  </div>

                  {/* Transaction Flow - Vertical */}
                  <div className="space-y-2">
                    {/* Source */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <div className="flex-shrink-0">
                          {renderAssetIcon(order.source_asset, order.source_asset_icon || '', 'background')}
                        </div>
                        <span className="font-semibold text-gray-900 text-sm truncate">
                          {formatAssetValue(order.source_amount, order.source_asset, true)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 font-medium">FROM</div>
                    </div>

                    {/* Arrow */}
                    <div className="flex justify-center py-1">
                      <ArrowRight className="w-4 h-4 text-gray-400 rotate-90" />
                    </div>

                    {/* Target */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <div className="flex-shrink-0">
                          {renderAssetIcon(order.target_asset, order.target_asset_icon || '', 'background')}
                        </div>
                        <span className="font-semibold text-gray-900 text-sm truncate">
                          {formatAssetValue(order.target_amount, order.target_asset, false)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 font-medium">TO</div>
                    </div>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:grid sm:grid-cols-[80px_1fr_100px] items-center gap-4">
                  {/* Status Badge */}
                  <div className="flex justify-center">
                    <Badge
                      className={`
                        flex items-center gap-1.5 px-2 py-1 
                        border font-medium text-xs
                        ${statusMeta.color}
                        shadow-sm
                      `}
                    >
                      {statusMeta.icon}
                    </Badge>
                  </div>

                  {/* Order Details */}
                  <div className="flex items-center min-w-0">
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 w-full">
                      {/* Source */}
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="flex-shrink-0">
                          {renderAssetIcon(order.source_asset, order.source_asset_icon || '', 'background')}
                        </div>
                        <span className="font-semibold text-gray-900 text-sm truncate">
                          {formatAssetValue(order.source_amount, order.source_asset, true)}
                        </span>
                      </div>

                      {/* Arrow */}
                      <div className="flex justify-center">
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </div>

                      {/* Target */}
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="flex-shrink-0">
                          {renderAssetIcon(order.target_asset, order.target_asset_icon || '', 'background')}
                        </div>
                        <span className="font-semibold text-gray-900 text-sm truncate">
                          {formatAssetValue(order.target_amount, order.target_asset, false)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex justify-end">
                    <span className="text-xs font-medium text-gray-500 whitespace-nowrap">
                      {formatDate(order.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
