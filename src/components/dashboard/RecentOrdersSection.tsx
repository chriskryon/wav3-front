import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, XCircle, ArrowRight } from 'lucide-react';
import { ICONS_CRYPTO_FIAT as icons } from '@/lib/icon-utils';
import Image from 'next/image';

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

// Helper: asset icon (mock, replace with real icon logic if needed)
function renderAssetIcon2(symbol: string) {
  // You can replace this with your real icon logic or assetIconMap
  return (
    <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase border border-primary/20">
      {symbol.slice(0, 4)}
    </span>
  );
}

function renderAssetIcon(symbol: string, fallbackUrl: string, variant: 'background' | 'default' = 'default') {
  const IconComponent = (icons as Record<string, any>)[symbol];
  if (IconComponent) {
    const isReactComponent =
      typeof IconComponent === 'function' ||
      (typeof IconComponent === 'object' && IconComponent !== null);
    if (isReactComponent) {
      return <IconComponent className="w-10 h-10 shadow" variant={variant} />;
    } else if (typeof IconComponent === 'string') {
      return (
        <Image
          src={IconComponent}
          alt={symbol}
          width={40}
          height={40}
          className="rounded-full border shadow bg-white"
        />
      );
    }
  }
  // Fallback para o ícone da API se não estiver no objeto icons
  return (
    <Image
      src={fallbackUrl}
      alt={symbol}
      width={40}
      height={40}
      className="rounded-full border shadow bg-white"
    />
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
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-main tracking-tight">
          Recent Orders
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-0">
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {recentTransactions.slice(0, 5).map((order: any, index: number) => {
            const statusMeta = getStatusMeta(order.status);
            return (
              <div
                key={order.id}
                className={`
                  grid grid-cols-[64px_1fr_80px] items-center gap-4 
                  px-3 py-3 rounded-xl 
                  bg-gradient-to-r from-white/95 to-white/90 
                  hover:from-primary/5 hover:to-primary/10 
                  border border-white/40 hover:border-primary/20
                  transition-all duration-200 ease-out
                  shadow-sm hover:shadow-md
                  ${index === 0 ? 'ring-1 ring-primary/10' : ''}
                `}
              >
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
                        {renderAssetIcon(order.source_asset, '', 'background')}
                      </div>
                      <span className="font-semibold text-gray-900 text-sm truncate">
                        {order.source_amount} {order.source_asset}
                      </span>
                    </div>

                    {/* Arrow */}
                    <div className="flex justify-center">
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>

                    {/* Target */}
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="flex-shrink-0">
                        {renderAssetIcon(order.target_asset, '', 'default')}
                      </div>
                      <span className="font-semibold text-gray-900 text-sm truncate">
                        {order.target_amount} {order.target_asset}
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
            );
          })}
        </div>
    </CardContent>
    </Card>
  );
}
