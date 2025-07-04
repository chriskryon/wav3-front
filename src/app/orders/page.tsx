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

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 9;

  const orders = [
    {
      id: 'ORD-001',
      type: 'Buy',
      asset: 'BTC',
      amount: 0.5,
      price: 42000,
      total: 21000,
      status: 'Completed',
      date: '2024-01-15 14:30',
      fee: 21,
    },
    {
      id: 'ORD-002',
      type: 'Sell',
      asset: 'ETH',
      amount: 2.5,
      price: 2500,
      total: 6250,
      status: 'Pending',
      date: '2024-01-15 13:45',
      fee: 6.25,
    },
    {
      id: 'ORD-003',
      type: 'Buy',
      asset: 'USDT',
      amount: 1000,
      price: 1,
      total: 1000,
      status: 'Failed',
      date: '2024-01-14 16:20',
      fee: 1,
    },
    {
      id: 'ORD-004',
      type: 'Sell',
      asset: 'BNB',
      amount: 10,
      price: 300,
      total: 3000,
      status: 'Completed',
      date: '2024-01-14 11:15',
      fee: 3,
    },
    {
      id: 'ORD-005',
      type: 'Buy',
      asset: 'ADA',
      amount: 1000,
      price: 0.45,
      total: 450,
      status: 'Pending',
      date: '2024-01-13 09:30',
      fee: 0.45,
    },
    {
      id: 'ORD-006',
      type: 'Sell',
      asset: 'SOL',
      amount: 15,
      price: 70,
      total: 1050,
      status: 'Completed',
      date: '2024-01-12 16:45',
      fee: 1.05,
    },
  ];

  const filteredOrders =
    statusFilter === 'all'
      ? orders
      : orders.filter((order) => order.status.toLowerCase() === statusFilter);

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + ordersPerPage,
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
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
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-md ${getTypeBadgeColor(order.type)}`}
                  >
                    {order.type === 'Buy' ? 'B' : 'S'}
                  </div>
                </div>

                {/* Order Details */}
                <div className='space-y-3'>
                  <div className='flex justify-between'>
                    <span className='muted-text text-sm'>Asset:</span>
                    <span className='text-main font-semibold'>
                      {order.asset}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='muted-text text-sm'>Quantity:</span>
                    <span className='text-main font-semibold'>
                      {order.amount}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='muted-text text-sm'>Price:</span>
                    <span className='text-main font-semibold'>
                      ${order.price.toLocaleString()}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='muted-text text-sm'>Total:</span>
                    <span className='primary-text font-bold'>
                      ${order.total.toLocaleString()}
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
                  <span className='text-xs muted-text'>{order.date}</span>
                </div>

                {/* View Button */}
                <Button
                  size='sm'
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedOrder(order);
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
            Showing {startIndex + 1} to{' '}
            {Math.min(startIndex + ordersPerPage, filteredOrders.length)} of{' '}
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
        <Dialog
          open={!!selectedOrder}
          onOpenChange={() => setSelectedOrder(null)}
        >
          <DialogContent className='glass-card-enhanced max-w-md'>
            <DialogHeader>
              <DialogTitle className='text-xl font-bold text-main'>
                Order Details
              </DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label className='muted-text text-sm'>Order ID</Label>
                    <p className='font-semibold text-main'>
                      {selectedOrder.id}
                    </p>
                  </div>
                  <div>
                    <Label className='muted-text text-sm'>Status</Label>
                    <Badge className={getStatusColor(selectedOrder.status)}>
                      {selectedOrder.status}
                    </Badge>
                  </div>
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label className='muted-text text-sm'>Type</Label>
                    <p className='font-semibold text-main'>
                      {selectedOrder.type}
                    </p>
                  </div>
                  <div>
                    <Label className='muted-text text-sm'>Asset</Label>
                    <p className='font-semibold text-main'>
                      {selectedOrder.asset}
                    </p>
                  </div>
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label className='muted-text text-sm'>Amount</Label>
                    <p className='font-semibold text-main'>
                      {selectedOrder.amount} {selectedOrder.asset}
                    </p>
                  </div>
                  <div>
                    <Label className='muted-text text-sm'>Price</Label>
                    <p className='font-semibold text-main'>
                      ${selectedOrder.price.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label className='muted-text text-sm'>Total</Label>
                    <p className='font-bold primary-text'>
                      ${selectedOrder.total.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <Label className='muted-text text-sm'>Fee</Label>
                    <p className='font-semibold text-main'>
                      ${selectedOrder.fee}
                    </p>
                  </div>
                </div>
                <div>
                  <Label className='muted-text text-sm'>Date</Label>
                  <p className='font-semibold text-main'>
                    {selectedOrder.date}
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
