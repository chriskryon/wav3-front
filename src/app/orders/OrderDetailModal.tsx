import React from 'react';
import { ICONS_CRYPTO_FIAT } from '@/lib/assetIcons';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

// Mock detailed order data
const mockOrderDetail = {
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
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ open, onOpenChange }) => {
  const order = mockOrderDetail;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='glass-card-enhanced max-w-lg max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold text-main'>Order Detail</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label className='muted-text text-sm'>Order ID</Label>
              <p className='font-semibold text-main'>{order.id}</p>
            </div>
            <div>
              <Label className='muted-text text-sm'>Status</Label>
              <Badge className='bg-red-500/20 text-red-500 border-red-500/30'>{order.status}</Badge>
            </div>
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label className='muted-text text-sm'>From</Label>
              <span className='flex items-center gap-2 font-semibold text-main'>
                {(() => {
                  const key = order.source_asset?.toUpperCase() as keyof typeof ICONS_CRYPTO_FIAT;
                  const IconSrc = ICONS_CRYPTO_FIAT[key];
                  if (!IconSrc) return <span className="w-5 h-5 flex items-center justify-center bg-white/20 rounded text-xs">{order.source_asset?.[0]}</span>;
                  try {
                    return <IconSrc variant='mono' color='#1ea3ab' className="w-5 h-5" />;
                  } catch {
                    return <IconSrc style={{ width: 20, height: 20 }} />;
                  }
                })()}
                {order.source_amount} {order.source_asset}
              </span>
            </div>
            <div>
              <Label className='muted-text text-sm'>To</Label>
              <span className='flex items-center gap-2 font-semibold text-main'>
                {(() => {
                  const key = order.target_asset?.toUpperCase() as keyof typeof ICONS_CRYPTO_FIAT;
                  const IconTgt = ICONS_CRYPTO_FIAT[key];
                  if (!IconTgt) return <span className="w-5 h-5 flex items-center justify-center bg-white/20 rounded text-xs">{order.target_asset?.[0]}</span>;
                  try {
                    return <IconTgt variant='mono' color='#1ea3ab' className="w-5 h-5" />;
                  } catch {
                    return <IconTgt style={{ width: 20, height: 20 }} />;
                  }
                })()}
                {order.target_amount} {order.target_asset}
              </span>
            </div>
          </div>
          <div>
            <Label className='muted-text text-sm'>Recipient Email</Label>
            <p className='font-semibold text-main'>{order.recipient_email}</p>
          </div>
          <div>
            <Label className='muted-text text-sm'>Description</Label>
            <p className='font-semibold text-main'>{order.description}</p>
          </div>
          <div>
            <Label className='muted-text text-sm'>Created At</Label>
            <p className='font-semibold text-main'>{new Date(order.created_at).toLocaleString()}</p>
          </div>
          <div>
            <Label className='muted-text text-sm'>Timeline</Label>
            <div className="relative flex flex-col items-stretch mt-2 py-2">
              {/* Vertical line connecting steps */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-slate-300 to-transparent z-0" style={{minHeight: '100%'}} />
              {order.timelines.map((step, idx) => {
                const isCurrent = !step.executed && (idx === 0 || order.timelines[idx - 1].executed);
                // Icon color logic
                // Use site palette: main = #1ea3ab, secondary = #e6f7f8, gray = #94a3b8
                const iconBg = step.executed
                  ? 'bg-[#1ea3ab] text-white'
                  : isCurrent
                  ? 'bg-white border-[#1ea3ab] text-[#1ea3ab]'
                  : 'bg-[#e6f7f8] text-[#94a3b8]';
                const iconBorder = step.executed || isCurrent ? 'border-[#1ea3ab]' : 'border-white';
                // Card color logic
                const cardShadow = step.executed
                  ? 'shadow border-[#b6e6ea]'
                  : isCurrent
                  ? 'shadow border-[#1ea3ab]'
                  : 'shadow border-[#e6f7f8]';
                return (
                  <div key={idx} className="relative flex items-center gap-2 mb-2 min-h-[48px]">
                    {/* Step icon circle */}
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full border ${iconBorder} ${iconBg} shadow z-10 shrink-0`}>
                      {step.executed ? (
                        <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
                          <polyline points="20 6 10 18 4 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : isCurrent ? (
                        <svg className="fill-current animate-pulse" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2.2" />
                          <circle cx="12" cy="12" r="6" fill="#1ea3ab" opacity="0.2" className="animate-ping" />
                        </svg>
                      ) : (
                        <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2.2" />
                        </svg>
                      )}
                    </div>
                    {/* Card */}
                    <div className={`flex-1 bg-white px-3 py-2 rounded border ${cardShadow} min-w-0`}> 
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-semibold text-xs text-main truncate">{step.order_step}</span>
                        <time className={`font-mono font-medium text-[0.7rem] ${step.executed ? 'text-main' : isCurrent ? 'text-main' : 'text-[#94a3b8]'}`}>
                          {step.executed && step.executed_at !== '0001-01-01T00:00:00Z'
                            ? new Date(step.executed_at).toLocaleDateString()
                            : isCurrent
                            ? ''
                            : ''}
                        </time>
                      </div>
                      <div className="text-[#94a3b8] text-xs truncate">
                        {step.comments || (step.executed && step.executed_at !== '0001-01-01T00:00:00Z'
                          ? new Date(step.executed_at).toLocaleTimeString()
                          : isCurrent
                          ? 'Aguardando próxima etapa.'
                          : '')}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
