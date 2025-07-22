/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ActionModal } from '@/components/action-modal';
import { FakeDataAlert } from '@/components/FakeDataAlert';
import { ICONS_CRYPTO_FIAT as icons } from '@/lib/icon-utils';
import { listAssets } from '@/services/asset-api-service';
import Image from 'next/image';

export default function OverviewPage() {

  // Mock de balances (até integração com API real)
  const balances = {
    crypto: 123456.78,
    fiat: 654321.12,
    total: 777777.90,
  };

  // Mock de transações (até integração com API real)
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
  const [activeModal, setActiveModal] = useState<string | null>(null);

  if (typeof window !== 'undefined') {
    console.log('Objeto icons:', icons);
    console.log('BTC do icons:', icons.BTC);
  }

  // Função para renderizar o ícone, seja componente React ou string (URL)
  // Agora aceita um variant opcional para passar para os componentes
  function renderAssetIcon(symbol: string, fallbackUrl: string, variant: 'background' | 'default' = 'default') {
    const IconComponent = (icons as Record<string, any>)[symbol];
    if (IconComponent) {
      const isReactComponent = typeof IconComponent === 'function' || (typeof IconComponent === 'object' && IconComponent !== null);
      if (isReactComponent) {
        return <IconComponent className="w-10 h-10 shadow" variant={variant} />;
      } else if (typeof IconComponent === 'string') {
        return <Image src={IconComponent} alt={symbol} width={40} height={40} className="rounded-full border shadow bg-white" />;
        // return <img src={IconComponent} alt={symbol} className="w-10 h-10 rounded-full border shadow bg-white" />;
      }
    }
    // Fallback para o ícone da API se não estiver no objeto icons
      return <Image src={fallbackUrl} alt={symbol} width={40} height={40} className="rounded-full border shadow bg-white" />;
    // return <img src={fallbackUrl} alt={symbol} className="w-10 h-10 rounded-full border shadow bg-white" />;
  }

  // Tabs para filtro de assets
  const [assetsTab, setAssetsTab] = useState<'all' | 'crypto' | 'fiat'>('all');

  // Query para cada tipo de asset
  const { data: cryptoAssets, isLoading: isCryptoLoading } = useQuery({
    queryKey: ['assets', 'crypto'],
    queryFn: async () => await listAssets('crypto'),
    staleTime: 1000 * 60,
  });
  const { data: fiatAssets, isLoading: isFiatLoading } = useQuery({
    queryKey: ['assets', 'fiat'],
    queryFn: async () => await listAssets('fiat'),
    staleTime: 1000 * 60,
  });

  // Soma dos assets de ambos para o ALL
  const allAssets = [
    ...(cryptoAssets?.assets || []),
    ...(fiatAssets?.assets || []),
  ];

  let filteredAssets: any[] = [];
  let isAssetsLoading = false;
  if (assetsTab === 'all') {
    filteredAssets = allAssets;
    isAssetsLoading = isCryptoLoading || isFiatLoading;
  } else if (assetsTab === 'crypto') {
    filteredAssets = cryptoAssets?.assets || [];
    isAssetsLoading = isCryptoLoading;
  } else if (assetsTab === 'fiat') {
    filteredAssets = fiatAssets?.assets || [];
    isAssetsLoading = isFiatLoading;
  }

  // Monta objeto para mapear symbol -> { name, icon }
  let assetIconMap: Record<string, { name: string; icon: string }> = {};
  if (allAssets.length > 0) {
    allAssets.forEach((asset: any) => {
      assetIconMap[asset.symbol] = {
        name: asset.name,
        icon: asset.small_image_url,
      };
    });
    if (typeof window !== 'undefined') {
      console.log('Assets loaded:');
      Object.entries(assetIconMap).forEach(([symbol, { name, icon }]) => {
        console.log(`symbol: ${symbol}, name: ${name}, icon: ${icon}`);
      });
    }
  }

  return (
    <div className='min-h-screen p-8 bg-background'>
      <div className='max-w-7xl mx-auto space-y-8'>
        <FakeDataAlert />

        {/* Balance Cards (mock) */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <Card className='glass-card-enhanced glass-hover transition-transform transform hover:scale-105'>
            <CardHeader className='pb-4'>
              <div className='flex items-center justify-between'>
                <CardTitle className='text-sm text-muted-foreground font-medium'>
                  Total Portfolio
                </CardTitle>
                <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 text-white flex items-center justify-center shadow-md'>
                  <DollarSign className='w-5 h-5' />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-4xl font-extrabold text-primary'>
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

          <Card className='glass-card-enhanced glass-hover transition-transform transform hover:scale-105'>
            <CardHeader className='pb-4'>
              <div className='flex items-center justify-between'>
                <CardTitle className='text-sm text-muted-foreground font-medium'>
                  Crypto Balance
                </CardTitle>
                <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 text-white flex items-center justify-center shadow-md'>
                  <Wallet className='w-5 h-5' />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-3xl font-bold text-primary'>
                ${balances.crypto.toLocaleString()}
              </div>
              <div className='text-sm text-muted-foreground mt-1'>
                {((balances.crypto / balances.total) * 100).toFixed(1)}% of total
              </div>
            </CardContent>
          </Card>

          <Card className='glass-card-enhanced glass-hover transition-transform transform hover:scale-105'>
            <CardHeader className='pb-4'>
              <div className='flex items-center justify-between'>
                <CardTitle className='text-sm text-muted-foreground font-medium'>
                  Fiat Balance
                </CardTitle>
                <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white flex items-center justify-center shadow-md'>
                  <DollarSign className='w-5 h-5' />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-3xl font-bold text-primary'>
                ${balances.fiat.toLocaleString()}
              </div>
              <div className='text-sm text-muted-foreground mt-1'>
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

        {/* Recent Transactions + Assets lado a lado (como antes) */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Recent Transactions (mock, até API real) */}
          <Card className='glass-card-enhanced'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardTitle className='text-xl font-bold text-main'>
                  Recent Orders
                </CardTitle>
                <Button variant='ghost' size='sm' className='glass-button'>
                  <RefreshCw className='w-4 h-4' />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className='space-y-4 max-h-80 scroll-area'>
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
              </div>
            </CardContent>
          </Card>

          {/* Assets */}
          <Card className="glass-card-enhanced border border-wav3 px-4 py-3 rounded-xl shadow-md backdrop-blur-md">
            <CardHeader className="pb-2 pt-3 px-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold text-main">Assets</CardTitle>
                {/* Botão '+' removido */}
              </div>
            </CardHeader>
            <CardContent className="space-y-2 max-h-72 scroll-area px-4 pb-4 pt-1">
              <Tabs value={assetsTab} onValueChange={(v) => setAssetsTab(v as 'all' | 'crypto' | 'fiat')} className="w-full mb-2">
                <TabsList className="glass-tabs mb-1 p-0.5 gap-1">
                  <TabsTrigger value="all" className="glass-tab-trigger text-xs px-2 py-1 min-w-[48px]">All</TabsTrigger>
                  <TabsTrigger value="crypto" className="glass-tab-trigger text-xs px-2 py-1 min-w-[48px]">Crypto</TabsTrigger>
                  <TabsTrigger value="fiat" className="glass-tab-trigger text-xs px-2 py-1 min-w-[48px]">Fiat</TabsTrigger>
                </TabsList>
              </Tabs>
              {isAssetsLoading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mr-2"></div>
                  <span className="text-main font-semibold text-sm">Loading assets...</span>
                </div>
              ) : filteredAssets.length === 0 ? (
                <div className="text-center text-muted text-xs">No assets found.</div>
              ) : (
                // Refined individual asset cards
                filteredAssets.map((asset: any) => (
                  <div
                    key={asset.id}
                    className="glass-item flex items-center gap-4 border border-wav3/30 px-4 py-3 rounded-lg mb-2 shadow-md backdrop-blur-md hover:shadow-lg transition-shadow duration-300"
                  >
                    {renderAssetIcon(asset.symbol, asset.small_image_url, 'background')}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-main text-sm truncate">
                        {asset.name} <span className="text-xs text-muted">({asset.symbol})</span>
                      </div>
                      <div className="text-xs muted-text truncate">
                        {(asset.networks || []).map((n: any) => n.name).join(', ')}
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="glass-badge text-xs px-3 py-1 bg-primary/10 text-primary border-primary/30 rounded-full"
                    >
                      {asset.type}
                    </Badge>
                  </div>
                ))
              )}
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
