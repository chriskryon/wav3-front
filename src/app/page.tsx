/** biome-ignore-all lint/suspicious/noArrayIndexKey: <-> */
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAccountBalances } from '@/services/account-api-service';
import { BalancesSection } from '@/components/dashboard/BalancesSection';
import { QuickActionsSection } from '@/components/dashboard/QuickActionsSection';
import { RecentOrdersSection } from '@/components/dashboard/RecentOrdersSection';
import { AssetsSection } from '@/components/dashboard/AssetsSection';
import { ActionModal } from '@/components/action-modal';
import { ICONS_CRYPTO_FIAT as icons } from '@/lib/icon-utils';
import { listAssets } from '@/services/asset-api-service';
import Image from 'next/image';

export default function OverviewPage() {
   // Mock de transações (até integração com API real)

  // Mock de orders no formato da API
  const orders = [
    {
      id: "782966f4-229e-4300-a4c9-0f137db68796",
      account_id: "a9349280-db0e-4c04-b861-ebfd9b31f427",
      sub_account_id: "28e50178-3675-43b6-a393-5f8f4426aeb5",
      recipient_email: "testing@wav3.com",
      description: "",
      status: "confirmed",
      source_asset: "BRL",
      source_amount: 0.5,
      target_asset: "BRL",
      target_amount: 0.5,
      total_fee: 0,
      valid_until: "2025-08-07T15:20:10.187073Z",
      created_at: "2025-08-06T15:20:10.187073Z"
    },
    {
      id: "a8e0495a-4375-4e38-ba7d-fa5fc16109bc",
      account_id: "a9349280-db0e-4c04-b861-ebfd9b31f427",
      sub_account_id: "28e50178-3675-43b6-a393-5f8f4426aeb5",
      recipient_email: "",
      description: "",
      status: "confirmed",
      source_asset: "USD",
      source_amount: 10.92,
      target_asset: "BRL",
      target_amount: 10.8509901802,
      total_fee: 0.071,
      valid_until: "2025-08-09T15:06:39.73174Z",
      created_at: "2025-08-06T15:06:39.73174Z"
    },
    {
      id: "7ca97f3e-f36b-491a-9982-8f3eb3182e37",
      account_id: "a9349280-db0e-4c04-b861-ebfd9b31f427",
      sub_account_id: "28e50178-3675-43b6-a393-5f8f4426aeb5",
      recipient_email: "testing@wav3.com",
      description: "Deposit (SubAccount)",
      status: "confirmed",
      source_asset: "BRL",
      source_amount: 0.52,
      target_asset: "BRL",
      target_amount: 0.52,
      total_fee: 0,
      valid_until: "2025-08-08T19:29:59.125302Z",
      created_at: "2025-08-05T19:29:59.125302Z"
    },
    {
      id: "2aea5257-f718-4074-bbb6-d19e894c70dc",
      account_id: "a9349280-db0e-4c04-b861-ebfd9b31f427",
      sub_account_id: "28e50178-3675-43b6-a393-5f8f4426aeb5",
      recipient_email: "",
      description: "",
      status: "confirmed",
      source_asset: "USDT",
      source_amount: 11,
      target_asset: "USD",
      target_amount: 10.9387,
      total_fee: 0.0715,
      valid_until: "2025-07-19T12:12:18.247837Z",
      created_at: "2025-07-16T12:12:18.247837Z"
    }
  ];


  // Fetch balances from API
  const { data: accountBalances, isLoading: isBalancesLoading } = useQuery({
    queryKey: ['accountBalances'],
    queryFn: getAccountBalances,
    staleTime: 1000 * 60,
  });

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

  // Calculate totals
  const fiat = accountBalances
    ? accountBalances.filter((b: any) => b.type === 'fiat' && b.balance !== null).reduce((sum: number, b: any) => sum + Number(b.balance), 0)
    : 0;
  const crypto = accountBalances
    ? accountBalances.filter((b: any) => b.type === 'crypto' && b.balance !== null).reduce((sum: number, b: any) => sum + Number(b.balance), 0)
    : 0;
  const total = accountBalances
    ? accountBalances.filter((b: any) => b.balance !== null).reduce((sum: number, b: any) => sum + Number(b.balance), 0)
    : 0;
  const balances = { crypto, fiat, total };

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
  const assetIconMap: Record<string, { name: string; icon: string }> = {};
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
        <BalancesSection accountBalances={accountBalances} isBalancesLoading={isBalancesLoading} renderAssetIcon={renderAssetIcon} />

        <QuickActionsSection setActiveModal={setActiveModal} />

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <RecentOrdersSection recentTransactions={orders} />
          <AssetsSection
            assetsTab={assetsTab}
            setAssetsTab={setAssetsTab}
            isAssetsLoading={isAssetsLoading}
            filteredAssets={filteredAssets}
            renderAssetIcon={renderAssetIcon}
          />
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
