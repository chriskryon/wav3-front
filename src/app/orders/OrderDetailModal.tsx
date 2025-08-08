import type React from 'react';
import { useState } from 'react';
import { ICONS_CRYPTO_FIAT } from '@/lib/assetIcons';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { pdf } from '@react-pdf/renderer';
import { OrderDetailPDF } from './OrderDetailPDF';
import { Download } from 'lucide-react';

// Mock detailed order data
export const mockOrderDetail = {
  id: 'e6282263-f947-48c8-9c25-334696a4940e',
  source_asset: 'XRP',
  source_amount: 64.76,
  target_asset: 'BRL',
  target_amount: 200,
  description: 'Testing Order',
  recipient_email: 'testing@betaapp.com',
  status: 'canceled',
  settlement_status: '',
  created_at: '2023-11-13T15:14:46.847698Z',
  timelines: [
    {
      order_step: 'Order Created',
      executed: true,
      comments: '',
      executed_at: '2023-11-13T15:14:46.847698Z',
    },
    {
      order_step: 'Payment Link Opened',
      executed: true,
      comments: '',
      executed_at: '2023-11-13T15:14:49.078719Z',
    },
    {
      order_step: 'Deposit Initiated',
      executed: true,
      comments: '',
      executed_at: '2023-11-13T15:14:51.371398Z',
    },
    {
      order_step: 'Paid',
      executed: false,
      comments: '',
      executed_at: '0001-01-01T00:00:00Z',
    },
    {
      order_step: 'Settlement',
      executed: false,
      comments: '',
      executed_at: '0001-01-01T00:00:00Z',
    },
  ],
};

interface OrderDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order?: any; // Order data from the parent component
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ open, onOpenChange, order }) => {
  // Use the passed order or fallback to mock data
  const orderData = order || mockOrderDetail;
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};
  const [loading, setLoading] = useState(false);

  // Use the timeline from API or create a basic one as fallback
  const getOrderTimeline = (order: any) => {
    // Se a API retorna timelines, use-as diretamente
    if (order.timelines && Array.isArray(order.timelines)) {
      return order.timelines;
    }

    // Fallback simples se não houver timeline da API
    return [
      {
        order_step: 'Order Created',
        executed: true,
        comments: 'Order successfully created',
        executed_at: order.created_at,
      },
      {
        order_step: 'Processing',
        executed: order.status === 'confirmed',
        comments: order.status === 'confirmed' ? 'Order processed successfully' : 'Awaiting processing',
        executed_at: order.status === 'confirmed' ? order.created_at : '0001-01-01T00:00:00Z',
      },
    ];
  };

  // Gerar comentário padrão baseado no step
  const getDefaultStepComment = (stepName: string, executed: boolean, isCurrent: boolean) => {
    if (executed) {
      return 'Step completed successfully';
    } else if (isCurrent) {
      return 'Currently in progress...';
    } else {
      return 'Operation not created/initiated';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'canceled':
      case 'failed':
        return 'bg-red-500/20 text-red-500 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
    }
  };

  const renderAssetIcon = (asset: string, size = 'w-6 h-6') => {
    const key = asset?.toUpperCase() as keyof typeof ICONS_CRYPTO_FIAT;
    const IconComponent = ICONS_CRYPTO_FIAT[key];
    
    if (!IconComponent) {
      return (
        <span className={`${size} flex items-center justify-center bg-white/20 rounded text-xs`}>
          {asset?.[0]}
        </span>
      );
    }

    try {
      return <IconComponent variant='mono' color='#1ea3ab' className={size} />;
    } catch {
      return <IconComponent style={{ width: 24, height: 24 }} />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='glass-card-enhanced max-w-2xl max-h-[90vh] overflow-hidden p-0'>
        {/* Header */}
        <div className="relative bg-gradient-to-r from-primary/10 to-primary/5 p-4 border-b border-gray-100">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className='text-xl font-bold text-gray-900'>Order Details</DialogTitle>
                <p className="text-sm text-gray-500 mt-1">Complete order information and timeline</p>
              </div>
              <Badge className={`text-sm font-semibold px-3 py-1 ${getStatusColor(orderData.status)} shadow-sm`}>
                {orderData.status}
              </Badge>
            </div>
          </DialogHeader>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className='p-4 space-y-4'>
            {/* Order ID Card */}
            <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-3 border border-gray-100">
              <Label className='text-xs font-medium text-gray-500 uppercase tracking-wider'>Order ID</Label>
              <p className='font-mono text-sm font-semibold text-gray-900 mt-1 break-all'>{orderData.id}</p>
            </div>

            {/* Asset Exchange Visual */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Asset Exchange</h3>
                <div className="flex items-center justify-center gap-6">
                  {/* Source Asset */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-500/10 flex items-center justify-center shadow-lg">
                        {renderAssetIcon(orderData.source_asset, 'w-6 h-6')}
                      </div>
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-xs text-white font-bold">-</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-gray-900">{Number(orderData.source_amount).toLocaleString()}</div>
                      <div className="text-xs text-gray-500 font-medium">{orderData.source_asset}</div>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center shadow-lg">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <title>Exchange Arrow</title>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Exchange</span>
                  </div>

                  {/* Target Asset */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-500/10 flex items-center justify-center shadow-lg">
                        {renderAssetIcon(orderData.target_asset, 'w-6 h-6')}
                      </div>
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-xs text-white font-bold">+</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-gray-900">{Number(orderData.target_amount).toLocaleString()}</div>
                      <div className="text-xs text-gray-500 font-medium">{orderData.target_asset}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-xl p-3">
                  <Label className='text-xs font-medium text-gray-500 uppercase tracking-wider'>Recipient Email</Label>
                  <p className='font-semibold text-gray-900 mt-1'>{orderData.recipient_email || 'No recipient specified'}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <Label className='text-xs font-medium text-gray-500 uppercase tracking-wider'>Description</Label>
                  <p className='font-semibold text-gray-900 mt-1'>{orderData.description || 'No description provided'}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-xl p-3">
                  <Label className='text-xs font-medium text-gray-500 uppercase tracking-wider'>Total Fee</Label>
                  <p className='font-semibold text-gray-900 mt-1'>
                    {orderData.total_fee ? `${Number(orderData.total_fee).toLocaleString()} ${orderData.target_asset}` : 'No fee'}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <Label className='text-xs font-medium text-gray-500 uppercase tracking-wider'>Created At</Label>
                  <p className='font-semibold text-gray-900 mt-1'>{new Date(orderData.created_at).toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Timeline Section */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Timeline</h3>
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/30 via-gray-200 to-gray-100" />
                
                <div className="space-y-3">
                  {getOrderTimeline(orderData).map((step: { executed: any; order_step: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; executed_at: string | number | Date; comments: any; }, idx: number) => {
                    const timeline = getOrderTimeline(orderData);
                    const isCurrent = !step.executed && (idx === 0 || timeline[idx - 1]?.executed);
                    const timelineKey = `${step.order_step}-${step.executed_at}`;
                    
                    return (
                      <div key={timelineKey} className="relative flex items-start gap-3">
                        {/* Step icon */}
                        <div className={`
                          relative z-10 flex items-center justify-center w-10 h-10 rounded-xl shadow-md
                          ${step.executed 
                            ? 'bg-gradient-to-br from-primary to-primary/80 text-white' 
                            : isCurrent 
                            ? 'bg-white border-2 border-primary text-primary shadow-lg' 
                            : 'bg-gray-100 text-gray-400'
                          }
                        `}>
                          {step.executed ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <title>Completed</title>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : isCurrent ? (
                            <div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse" />
                          ) : (
                            <div className="w-2.5 h-2.5 bg-gray-400 rounded-full" />
                          )}
                        </div>

                        {/* Step content */}
                        <div className={`
                          flex-1 min-w-0 pb-3
                          ${step.executed ? 'opacity-100' : isCurrent ? 'opacity-90' : 'opacity-60'}
                        `}>
                          <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold text-gray-900 text-sm">{step.order_step}</h4>
                              {step.executed && step.executed_at !== '0001-01-01T00:00:00Z' && (
                                <time className="text-xs font-medium text-gray-500">
                                  {new Date(step.executed_at).toLocaleString()}
                                </time>
                              )}
                            </div>
                            <p className="text-xs text-gray-500">
                              {(step.comments && step.comments.trim() !== '') 
                                ? step.comments 
                                : getDefaultStepComment(String(step.order_step || ''), step.executed, isCurrent)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-4 bg-gray-50/50">
          <div className='flex justify-end'>
            <button
              type="button"
              onClick={async () => {
                setLoading(true);
                const blob = await pdf(<OrderDetailPDF order={orderData} user={user} />).toBlob();
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `wav3_order_${orderData.id}.pdf`;
                link.click();
                URL.revokeObjectURL(url);
                setLoading(false);
              }}
              disabled={loading}
              className='flex items-center gap-2 bg-gradient-to-r from-primary to-primary/90 text-white px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm'
            >
              <Download className='w-4 h-4' />
              {loading ? 'Generating PDF...' : 'Download PDF'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
