'use client';

import { useState } from 'react';
import { Plus, Filter, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FakeDataAlert } from '@/components/FakeDataAlert';
import { OrderDetailModal } from './OrderDetailModal';
import { ICONS_CRYPTO_FIAT } from '@/lib/assetIcons';

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showOrderDetailModal, setShowOrderDetailModal] = useState(false);
  const ordersPerPage = 9;

  // MOCK conforme API
  const orders = [
    {
      id: 'dd299198-f1b4-4b82-8daa-9c16b1da7fb1',
      account_id: '39b745ba...847f49',
      sub_account_id: '94850a8c...881047',
      recipient_email: 'testing@betaapp.com',
      description: '',
      status: 'confirmed',
      source_asset: 'ETH',
      source_amount: 1000000,
      target_asset: 'BTC',
      target_amount: 0.039094,
      valid_until: '2023-11-14T14:56:43.615066Z',
      created_at: '2023-11-13T14:56:43.615066Z',
    },
    {
      id: '3e9bb519-58a4-454f-8474-c3ca4cf9c3d8',
      account_id: '39b745ba...847f49',
      sub_account_id: '94850a8c...881047',
      recipient_email: 'testing@betaapp.com',
      description: '',
      status: 'confirmed',
      source_asset: 'ETH',
      source_amount: 1000000,
      target_asset: 'BTC',
      target_amount: 0.039193,
      valid_until: '2023-11-14T14:47:08.137369Z',
      created_at: '2023-11-13T14:47:08.137369Z',
    },
  ];

  const filteredOrders = orders;
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ordersPerPage));
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-500 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
    }
  };

  const getTypeBadgeColor = (type: string) => {
    return type === 'Buy' ? 'bg-green-500' : 'bg-blue-500';
  };

  return (
    <div className='content-height p-8 scroll-area bg-background'>
      <div className='max-w-7xl mx-auto space-y-8'>
        <FakeDataAlert />
        {/* Header */}
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
          <div>
            <h1 className='text-3xl font-bold text-main'>Orders</h1>
            <p className='muted-text text-lg'>Manage your trading orders</p>
          </div>
          <Button
            onClick={() => setShowNewOrderModal(true)}
            className='bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300'
          >
            <Plus className='w-4 h-4 mr-2' />
            New Order
          </Button>
        </div>

        {/* Filter */}
        <Card className='glass-card-enhanced'>
          <CardContent className='p-6'>
            <div className='flex flex-col md:flex-row gap-4 items-center'>
              <div className='flex items-center gap-3'>
                <Filter className='w-5 h-5 muted-text' />
                <span className='text-sm muted-text font-medium'>
                  Filter by status:
                </span>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className='w-48 glass-input'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='glass-card-enhanced'>
                  <SelectItem value='all'>All Orders</SelectItem>
                  <SelectItem value='completed'>Completed</SelectItem>
                  <SelectItem value='pending'>Pending</SelectItem>
                  <SelectItem value='failed'>Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {paginatedOrders.map((order) => (
            <Card
              key={order.id}
              className='glass-card-enhanced glass-hover cursor-pointer border border-black/10'
              onClick={() => setSelectedOrder(order)}
            >
              <CardContent className='p-6 space-y-4'>
                {/* Header with Order ID and Type Badge */}
                <div className='flex items-center justify-between'>
                  <h3 className='font-bold text-main text-lg'>{order.id}</h3>
                  <div
                    className="w-16 h-16 rounded-xl relative flex items-center justify-center text-white text-sm font-bold shadow-md bg-wav3/90"
                  >
                    {/* Source asset icon (top left) */}
                    <div className="absolute left-1 top-1">
                      {(() => {
                        const key = order.source_asset?.toUpperCase() as keyof typeof ICONS_CRYPTO_FIAT;
                        const IconSrc = ICONS_CRYPTO_FIAT[key];
                        if (!IconSrc) return <span className="w-6 h-6 flex items-center justify-center bg-white/20 rounded text-xs">{order.source_asset?.[0]}</span>;
                        try {
                          return <IconSrc variant='mono' color='#FFFFFF' className="w-6 h-6" />;
                        } catch {
                          return <IconSrc style={{ width: 24, height: 24 }} />;
                        }
                      })()}
                    </div>
                    {/* Target asset icon (bottom right) */}
                    <div className="absolute right-1 bottom-1">
                      {(() => {
                        const key = order.target_asset?.toUpperCase() as keyof typeof ICONS_CRYPTO_FIAT;
                        const IconTgt = ICONS_CRYPTO_FIAT[key];
                        if (!IconTgt) return <span className="w-8 h-8 flex items-center justify-center bg-white/20 rounded text-base">{order.target_asset?.[0]}</span>;
                        try {
                          return <IconTgt variant='mono' color='#FFFFFF' className="w-8 h-8" />;

                        } catch {
                          return <IconTgt style={{ width: 32, height: 32 }} />;
                        }
                      })()}
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className='space-y-3'>
                  <div className='flex justify-between items-center'>
                    <span className='muted-text text-sm'>From:</span>
                    <span className='flex items-center gap-2'>
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
                      <span className='text-main font-semibold'>
                        {order.source_amount} {order.source_asset}
                      </span>
                    </span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='muted-text text-sm'>To:</span>
                    <span className='flex items-center gap-2'>
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
                      <span className='text-main font-semibold'>
                        {order.target_amount} {order.target_asset}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Status and Date */}
                <div className='flex items-center justify-between pt-3 border-t border-black/10'>
                  <Badge
                    className={`text-xs font-medium ${getStatusColor(order.status)}`}
                  >
                    {order.status}
                  </Badge>
                  <span className='text-xs muted-text'>
                    {(() => {
                      const d = new Date(order.created_at);
                      const pad = (n: number) => n.toString().padStart(2, '0');
                      return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
                    })()}
                  </span>
                </div>

                {/* View Button */}
                <Button
                  size='sm'
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedOrder(order);
                    setShowOrderDetailModal(true);
                  }}
                  className='w-full bg-primary hover:bg-primary/90 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300'
                >
                  <Eye className='w-4 h-4 mr-2' />
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className='flex items-center justify-between'>
          <div className='text-sm muted-text'>
            Showing {1} to {Math.min(ordersPerPage, filteredOrders.length)} of{' '}
            {filteredOrders.length} orders
          </div>
          <div className='flex gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className='glass-button'
            >
              Previous
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className='glass-button'
            >
              Next
            </Button>
          </div>
        </div>

        {/* New Order Modal */}
        <Dialog open={showNewOrderModal} onOpenChange={setShowNewOrderModal}>
          <DialogContent className='glass-card-enhanced max-w-md'>
            <DialogHeader>
              <DialogTitle className='text-xl font-bold text-main'>
                Create New Order
              </DialogTitle>
            </DialogHeader>
            <form className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label className='text-sm font-medium muted-text'>
                    Order Type
                  </Label>
                  <Select>
                    <SelectTrigger className='glass-input mt-1'>
                      <SelectValue placeholder='Select type' />
                    </SelectTrigger>
                    <SelectContent className='glass-card-enhanced'>
                      <SelectItem value='buy'>Buy</SelectItem>
                      <SelectItem value='sell'>Sell</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className='text-sm font-medium muted-text'>
                    Asset
                  </Label>
                  <Select>
                    <SelectTrigger className='glass-input mt-1'>
                      <SelectValue placeholder='Select asset' />
                    </SelectTrigger>
                    <SelectContent className='glass-card-enhanced'>
                      <SelectItem value='btc'>Bitcoin (BTC)</SelectItem>
                      <SelectItem value='eth'>Ethereum (ETH)</SelectItem>
                      <SelectItem value='usdt'>Tether (USDT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className='text-sm font-medium muted-text'>Amount</Label>
                <Input placeholder='0.00' className='glass-input mt-1' />
              </div>
              <div>
                <Label className='text-sm font-medium muted-text'>
                  Price (USD)
                </Label>
                <Input placeholder='0.00' className='glass-input mt-1' />
              </div>
              <div className='flex gap-3 pt-4'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setShowNewOrderModal(false)}
                  className='flex-1 glass-button'
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  className='flex-1 bg-primary hover:bg-primary/90 text-white font-semibold'
                >
                  Create Order
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Order Details Modal */}
        <OrderDetailModal open={showOrderDetailModal} onOpenChange={setShowOrderDetailModal} />
      </div>
    </div>
  );
}
