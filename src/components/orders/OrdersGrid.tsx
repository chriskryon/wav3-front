'use client';

import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ICONS_CRYPTO_FIAT } from '@/lib/assetIcons';

interface Order {
  id: string;
  account_id: string;
  sub_account_id: string;
  recipient_email: string;
  description: string;
  status: string;
  source_asset: string;
  source_amount: number;
  target_asset: string;
  target_amount: number;
  valid_until: string;
  created_at: string;
}

interface OrdersGridProps {
  orders: Order[];
  onOrderClick: (order: Order) => void;
  onViewDetails: (order: Order) => void;
}

export function OrdersGrid({ orders, onOrderClick, onViewDetails }: OrdersGridProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'failed':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatDateTime = (dateString: string) => {
    const d = new Date(dateString);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const renderAssetIcon = (asset: string, size: 'sm' | 'md' | 'lg' = 'sm', color = '#00109b') => {
    const key = asset?.toUpperCase() as keyof typeof ICONS_CRYPTO_FIAT;
    const IconComponent = ICONS_CRYPTO_FIAT[key];
    
    const sizeClasses = {
      sm: 'w-5 h-5',
      md: 'w-6 h-6',
      lg: 'w-8 h-8'
    };

    const sizeStyles = {
      sm: { width: 20, height: 20 },
      md: { width: 24, height: 24 },
      lg: { width: 32, height: 32 }
    };

    if (!IconComponent) {
      return (
        <span className={`${sizeClasses[size]} flex items-center justify-center bg-gray-100 rounded text-xs font-medium text-gray-600`}>
          {asset?.[0]}
        </span>
      );
    }

    try {
      return <IconComponent variant='mono' color={color} className={sizeClasses[size]} />;
    } catch {
      return <IconComponent style={sizeStyles[size]} />;
    }
  };

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      {orders.map((order) => (
        <Card
          key={order.id}
          className="bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer"
          onClick={() => onOrderClick(order)}
        >
          <CardContent className='p-4 space-y-3'>
            {/* Header with Order ID and Status */}
            <div className='flex items-start justify-between gap-3'>
              <div className="flex-1 min-w-0">
                <h3 className='font-medium text-gray-900 text-sm truncate'>
                  {order.id}
                </h3>
              </div>
              <Badge className={`text-xs font-medium px-2 py-1 border ${getStatusColor(order.status)}`}>
                {order.status}
              </Badge>
            </div>

            {/* Asset Pair Visualization */}
            <div className="flex items-center justify-center py-4">
              <div className="flex items-center gap-4">
                {/* Source Asset */}
                <div className="flex flex-col items-center gap-2">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-md">
                      {renderAssetIcon(order.source_asset, 'md', '#00109b')}
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">-</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-bold text-gray-900">{order.source_amount}</div>
                    <div className="text-xs text-gray-500 font-medium">{order.source_asset}</div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex flex-col items-center gap-1">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center shadow-lg">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <title>Swap Arrow</title>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                  <div className="text-xs text-gray-400 font-medium">SWAP</div>
                </div>

                {/* Target Asset */}
                <div className="flex flex-col items-center gap-2">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-500/10 flex items-center justify-center shadow-md">
                      {renderAssetIcon(order.target_asset, 'md', '#00109b')}
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">+</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-bold text-gray-900">{order.target_amount}</div>
                    <div className="text-xs text-gray-500 font-medium">{order.target_asset}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Date and Actions */}
            <div className='flex items-center justify-between pt-4 border-t border-gray-100'>
              <div className="flex flex-col">
                <span className='text-xs text-gray-400 font-medium'>Created</span>
                <span className='text-xs text-gray-600 font-semibold'>
                  {formatDateTime(order.created_at)}
                </span>
              </div>
              
              <Button
                size='sm'
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails(order);
                }}
                className='bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 rounded-xl px-4'
              >
                <Eye className='w-3 h-3 mr-2' />
                Details
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
