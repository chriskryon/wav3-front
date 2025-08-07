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
import { orders } from './orders/mock';

export default function OverviewPage() {
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
