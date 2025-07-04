'use client';

import { useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Plus,
  RefreshCw,
  Send,
  TrendingUp,
  Wallet,
  DollarSign,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ActionModal } from '@/components/action-modal';

export default function OverviewPage() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const balances = {
    crypto: 25420.5,
    fiat: 18750.25,
    total: 94170.75,
  };

  const recentTransactions = [
    {
      id: 1,
      type: 'Buy',
      asset: 'BTC',
      amount: 0.5,
      value: 22500,
      date: '2024-01-15',
      status: 'Completed',
    },
    {
      id: 2,
      type: 'Sell',
      asset: 'ETH',
      amount: 2.5,
      value: 5750,
      date: '2024-01-14',
      status: 'Completed',
    },
    {
      id: 3,
      type: 'Send',
      asset: 'USDT',
      amount: 1000,
      value: 1000,
      date: '2024-01-13',
      status: 'Pending',
    },
    {
      id: 4,
      type: 'Buy',
      asset: 'BNB',
      amount: 25,
      value: 7500,
      date: '2024-01-12',
      status: 'Completed',
    },
    {
      id: 5,
      type: 'Exchange',
      asset: 'ADA',
      amount: 1000,
      value: 450,
      date: '2024-01-11',
      status: 'Pending',
    },
  ];

  const activeWallets = [
    { name: 'Bitcoin Wallet', asset: 'BTC', balance: 1.25, network: 'Bitcoin' },
    {
      name: 'Ethereum Wallet',
      asset: 'ETH',
      balance: 15.5,
      network: 'Ethereum',
    },
    { name: 'USDT Wallet', asset: 'USDT', balance: 5000, network: 'Tron' },
  ];

  return (
    <div className='content-height p-8 scroll-area bg-background'>
      <div className='max-w-7xl mx-auto space-y-8'>
        {/* Balance Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <Card className='glass-card-enhanced glass-hover'>
            <CardHeader className='pb-4'>
              <div className='flex items-center justify-between'>
                <CardTitle className='text-sm muted-text font-medium'>
                  Total Portfolio
                </CardTitle>
                <div className='w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-md'>
                  <DollarSign className='w-5 h-5' />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-3xl font-bold primary-text'>
                ${balances.total.toLocaleString()}
              </div>
              <div className='flex items-center gap-2 mt-3'>
                <div className='w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center'>
                  <TrendingUp className='w-4 h-4 text-green-500' />
                </div>
                <span className='text-sm text-green-500 font-medium'>
                  +12.5% this month
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className='glass-card-enhanced glass-hover'>
            <CardHeader className='pb-4'>
              <div className='flex items-center justify-between'>
                <CardTitle className='text-sm muted-text font-medium'>
                  Crypto Balance
                </CardTitle>
                <div className='w-10 h-10 rounded-xl bg-linear-to-br from-purple-500 to-blue-500 text-white flex items-center justify-center shadow-md'>
                  <Wallet className='w-5 h-5' />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-main'>
                ${balances.crypto.toLocaleString()}
              </div>
              <div className='text-sm muted-text mt-1'>
                {((balances.crypto / balances.total) * 100).toFixed(1)}% of
                total
              </div>
            </CardContent>
          </Card>

          <Card className='glass-card-enhanced glass-hover'>
            <CardHeader className='pb-4'>
              <div className='flex items-center justify-between'>
                <CardTitle className='text-sm muted-text font-medium'>
                  Fiat Balance
                </CardTitle>
                <div className='w-10 h-10 rounded-xl bg-linear-to-br from-green-500 to-emerald-500 text-white flex items-center justify-center shadow-md'>
                  <DollarSign className='w-5 h-5' />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-main'>
                ${balances.fiat.toLocaleString()}
              </div>
              <div className='text-sm muted-text mt-1'>
                {((balances.fiat / balances.total) * 100).toFixed(1)}% of total
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className='glass-card-enhanced'>
          <CardHeader>
            <CardTitle className='text-xl font-bold text-main'>
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <Button
                onClick={() => setActiveModal('deposit')}
                className='h-20 flex-col gap-3 bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105'
              >
                <div className='w-8 h-8 rounded-full bg-white/20 flex items-center justify-center'>
                  <ArrowDown className='w-5 h-5' />
                </div>
                <span>Deposit</span>
              </Button>
              <Button
                onClick={() => setActiveModal('exchange')}
                className='h-20 flex-col gap-3 bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105'
              >
                <div className='w-8 h-8 rounded-full bg-white/20 flex items-center justify-center'>
                  <RefreshCw className='w-5 h-5' />
                </div>
                <span>Exchange</span>
              </Button>
              <Button
                onClick={() => setActiveModal('send')}
                className='h-20 flex-col gap-3 bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105'
              >
                <div className='w-8 h-8 rounded-full bg-white/20 flex items-center justify-center'>
                  <Send className='w-5 h-5' />
                </div>
                <span>Send</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Recent Transactions */}
          <Card className='glass-card-enhanced'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardTitle className='text-xl font-bold text-main'>
                  Recent Transactions
                </CardTitle>
                <Button variant='ghost' size='sm' className='glass-button'>
                  <RefreshCw className='w-4 h-4' />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue='all' className='w-full'>
                <TabsList className='glass-tabs mb-6 p-1'>
                  <TabsTrigger value='all' className='glass-tab-trigger'>
                    All
                  </TabsTrigger>
                  <TabsTrigger value='crypto' className='glass-tab-trigger'>
                    Crypto
                  </TabsTrigger>
                  <TabsTrigger value='fiat' className='glass-tab-trigger'>
                    Fiat
                  </TabsTrigger>
                </TabsList>
                <TabsContent
                  value='all'
                  className='space-y-4 max-h-80 scroll-area'
                >
                  {recentTransactions.map((tx) => (
                    <div
                      key={tx.id}
                      className='glass-item p-4 flex items-center justify-between'
                    >
                      <div className='flex items-center gap-4'>
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${
                            tx.type === 'Buy'
                              ? 'bg-green-500/20 text-green-500 border border-green-500/30'
                              : tx.type === 'Sell'
                                ? 'bg-red-500/20 text-red-500 border border-red-500/30'
                                : 'bg-primary/20 text-primary border border-primary/30'
                          }`}
                        >
                          {tx.type === 'Buy' ? (
                            <ArrowDown className='w-6 h-6' />
                          ) : tx.type === 'Sell' ? (
                            <ArrowUp className='w-6 h-6' />
                          ) : (
                            <Send className='w-6 h-6' />
                          )}
                        </div>
                        <div>
                          <div className='font-semibold text-main'>
                            {tx.type} {tx.asset}
                          </div>
                          <div className='text-sm muted-text'>{tx.date}</div>
                        </div>
                      </div>
                      <div className='text-right'>
                        <div className='font-bold text-main'>
                          ${tx.value.toLocaleString()}
                        </div>
                        <Badge
                          className={`text-xs font-medium mt-1 ${
                            tx.status === 'Completed'
                              ? 'bg-green-500/20 text-green-500 border-green-500/40'
                              : 'bg-yellow-500/20 text-yellow-500 border-yellow-500/40'
                          }`}
                        >
                          {tx.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Active Wallets */}
          <Card className='glass-card-enhanced'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardTitle className='text-xl font-bold text-main'>
                  Active Wallets
                </CardTitle>
                <Button variant='ghost' size='sm' className='glass-button'>
                  <Plus className='w-4 h-4' />
                </Button>
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              {activeWallets.map((wallet, index) => (
                <div key={index} className='glass-item p-4'>
                  <div className='flex items-center justify-between mb-4'>
                    <div className='flex items-center gap-4'>
                      <div className='w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-md'>
                        <span className='font-bold text-sm'>
                          {wallet.asset}
                        </span>
                      </div>
                      <div>
                        <div className='font-semibold text-main'>
                          {wallet.name}
                        </div>
                        <div className='text-sm muted-text'>
                          {wallet.network}
                        </div>
                      </div>
                    </div>
                    <Badge variant='outline' className='glass-badge'>
                      {wallet.network}
                    </Badge>
                  </div>
                  <div className='flex items-center justify-between'>
                    <div className='text-sm muted-text'>Balance</div>
                    <div className='font-bold primary-text'>
                      {wallet.balance} {wallet.asset}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Modals */}
      <ActionModal
        isOpen={activeModal === 'deposit'}
        onClose={() => setActiveModal(null)}
        type='deposit'
      />
      <ActionModal
        isOpen={activeModal === 'exchange'}
        onClose={() => setActiveModal(null)}
        type='exchange'
      />
      <ActionModal
        isOpen={activeModal === 'send'}
        onClose={() => setActiveModal(null)}
        type='send'
      />
    </div>
  );
}
