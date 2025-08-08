'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { OrdersGrid } from '@/components/orders/OrdersGrid';
import { listOrders, getOrderDetails } from '@/services/exchange-api-service';

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showOrderDetailModal, setShowOrderDetailModal] = useState(false);
  
  // Query para buscar orders da API - mesma queryKey da home para compartilhar cache
  const { data: ordersData, isLoading: isOrdersLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => await listOrders(),
    staleTime: 1000 * 60 * 5, // Cache por 5 minutos
  });

  // Query para buscar detalhes da order selecionada
  const { data: selectedOrderDetails, isLoading: isOrderDetailsLoading } = useQuery({
    queryKey: ['orderDetails', selectedOrderId],
    queryFn: async () => {
      if (!selectedOrderId) {
        console.log('🚫 getOrderDetails: No selectedOrderId provided');
        return null;
      }
      
      console.log('🔍 getOrderDetails: Fetching details for order ID:', selectedOrderId);
      
      try {
        const orderDetails = await getOrderDetails(selectedOrderId);
        console.log('✅ getOrderDetails: Success for order ID:', selectedOrderId);
        console.log('📦 getOrderDetails: Order details data:', orderDetails);
        return orderDetails;
      } catch (error) {
        console.error('❌ getOrderDetails: Error fetching order details for ID:', selectedOrderId);
        console.error('💥 getOrderDetails: Error details:', error);
        throw error;
      }
    },
    enabled: !!selectedOrderId, // Só executa se tiver um ID selecionado
    staleTime: 1000 * 60 * 2, // Cache por 2 minutos
  });

  const ordersPerPage = 12;
  
  // Log para debug - acompanhar mudanças nos dados
  useEffect(() => {
    console.log('🔄 State change: selectedOrderId:', selectedOrderId);
    console.log('🔄 State change: isOrderDetailsLoading:', isOrderDetailsLoading);
    console.log('🔄 State change: selectedOrderDetails:', selectedOrderDetails);
    console.log('🔄 State change: showOrderDetailModal:', showOrderDetailModal);
  }, [selectedOrderId, isOrderDetailsLoading, selectedOrderDetails, showOrderDetailModal]);
  
  // Usar dados da API ou array vazio se ainda carregando
  const allOrders = ordersData?.orders || [];
  
  // Aplicar filtro de status
  const filteredOrders = statusFilter === 'all' 
    ? allOrders 
    : allOrders.filter((order: any) => order.status === statusFilter);
    
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ordersPerPage));
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage);

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
              <Select value={statusFilter} onValueChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1); // Reset para primeira página ao filtrar
              }}>
                <SelectTrigger className='w-48 glass-input'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='glass-card-enhanced'>
                  <SelectItem value='all'>All Orders</SelectItem>
                  <SelectItem value='completed'>Completed</SelectItem>
                  <SelectItem value='confirmed'>Confirmed</SelectItem>
                  <SelectItem value='pending'>Pending</SelectItem>
                  <SelectItem value='failed'>Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders Grid */}
        {isOrdersLoading ? (
          <Card className='glass-card-enhanced'>
            <CardContent className='p-12'>
              <div className='flex flex-col items-center justify-center space-y-4'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
                <p className='text-sm text-gray-500'>Loading orders...</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <OrdersGrid 
            orders={paginatedOrders as any}
            onOrderClick={(order: any) => {
              console.log('🖱️ onOrderClick: Order clicked:', order);
              console.log('🆔 onOrderClick: Setting selectedOrderId to:', order.id);
              setSelectedOrderId(order.id);
            }}
            onViewDetails={(order: any) => {
              console.log('👁️ onViewDetails: View details clicked for order:', order);
              console.log('🆔 onViewDetails: Order ID:', order.id);
              console.log('📊 onViewDetails: Full order data:', order);
              setSelectedOrderId(order.id);
              setShowOrderDetailModal(true);
            }}
          />
        )}

        {/* Pagination */}
        {!isOrdersLoading && filteredOrders.length > 0 && (
          <div className='flex items-center justify-between'>
            <div className='text-sm muted-text'>
              Showing {((currentPage - 1) * ordersPerPage) + 1} to {Math.min(currentPage * ordersPerPage, filteredOrders.length)} of{' '}
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
        )}

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
        <OrderDetailModal 
          open={showOrderDetailModal} 
          onOpenChange={(open) => {
            setShowOrderDetailModal(open);
            if (!open) {
              // Limpa a seleção quando fechar o modal
              setSelectedOrderId(null);
            }
          }}
          order={selectedOrderDetails}
        />
      </div>
    </div>
  );
}
