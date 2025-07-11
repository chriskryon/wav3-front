import React, { useState, useEffect } from 'react';
import { useExchangeContext } from '@/context/ExchangeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AssetSelect } from '../AssetSelect';
import { RefreshCw } from 'lucide-react';
import { getQuote } from '@/services/api-service';
import { useRequest } from '@/hooks/useRequest';
import { ArrowUpDown } from 'lucide-react';

export const QuoteStep: React.FC = () => {
  const {
    sourceAsset: contextSourceAsset,
    setSourceAsset: setContextSourceAsset,
    targetAsset: contextTargetAsset,
    setTargetAsset: setContextTargetAsset,
    sourceAmount,
    setSourceAmount,
    loading,
    setLoading,
    assets,
    setQuoteResult,
    navigateToStep,
    sendRequest,
    error: contextError,
  } = useExchangeContext();

  const { executeRequest } = useRequest();
  const [error, setError] = useState<string | null>(contextError || null);

  // Update targetAsset dynamically based on sourceAsset changes
  useEffect(() => {
    if (assets && assets.length > 0) {
      if (contextSourceAsset?.type === 'crypto') {
        setContextTargetAsset(assets.find((a) => a.symbol === 'BRL'));
      } else if (contextSourceAsset?.type === 'fiat') {
        setContextTargetAsset(assets.find((a) => a.symbol === 'USDT'));
      }
    }
  }, [contextSourceAsset, assets]);

  useEffect(() => {
    if (assets && assets.length > 0) {
      setContextSourceAsset(assets.find((a) => a.symbol === 'BTC'));
      setContextTargetAsset(assets.find((a) => a.symbol === 'BRL'));
    }
  }, [assets]);

  const handleGetQuote = () => {
    setLoading(true);
    setError(null);
    sendRequest(
      async () => {
        const cryptoAsset = contextSourceAsset.type === 'crypto' ? contextSourceAsset : contextTargetAsset;
        const networkName = cryptoAsset.networks?.[0]?.name || '';

        const payload = {
          source_asset: contextSourceAsset.symbol,
          target_asset: contextTargetAsset.symbol,
          network: networkName,
          product: 'exchange',
          source_amount: Number(sourceAmount),
        };
        
        const response = await getQuote(payload);

        console.log('Quote response:', response);
        setQuoteResult(response);
        return response;
      },
      () => {
        console.log('Quote request successful');
        navigateToStep('pre-deposit');
      }
    );
  };

  // Filtrar ativos para o campo "To" com base no tipo do ativo selecionado no campo "From"
  const filteredTargetAssets = assets.filter((asset) => {
    if (contextSourceAsset?.type === 'crypto') {
      return asset.type === 'fiat';
    } else if (contextSourceAsset?.type === 'fiat') {
      return asset.type === 'crypto';
    }
    return true;
  });

  if (!assets || assets.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg font-semibold text-[#1ea3ab]">Carregando ativos...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 h-full p-6 bg-white/70 rounded-3xl shadow-xl backdrop-blur-md overflow-y-auto">
      <div className="text-center">
        <h2 className="text-xl font-bold text-[#1ea3ab]">Get a Quote</h2>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="amount-input" className="text-sm font-semibold text-[#1ea3ab]">Amount</label>
          <Input
            id="amount-input"
            type="number"
            placeholder="Enter amount"
            value={sourceAmount}
            onChange={(e) => setSourceAmount(e.target.value)}
            className="text-lg font-mono bg-white/60 p-4 rounded-lg shadow-inner border border-[#1ea3ab]/30 focus:ring-2 focus:ring-[#1ea3ab]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="from-asset-select" className="text-sm font-semibold text-[#1ea3ab]">From</label>
          <AssetSelect
            value={contextSourceAsset?.symbol}
            onChange={(symbol) => setContextSourceAsset(assets.find((a) => a.symbol === symbol))}
            assets={assets}
            className="w-full"
          />
        </div>

        <div className="flex justify-center items-center gap-2">
          <Button
            onClick={() => {
              const temp = contextSourceAsset;
              setContextSourceAsset(contextTargetAsset);
              setContextTargetAsset(temp);
            }}
            className="bg-gradient-to-r from-[#1ea3ab] to-[#188a91] text-white p-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:ring-[#1ea3ab]"
          >
            <ArrowUpDown className="w-6 h-6" />
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="to-asset-select" className="text-sm font-semibold text-[#1ea3ab]">To</label>
          <AssetSelect
            value={contextTargetAsset?.symbol}
            onChange={(symbol) => setContextTargetAsset(assets.find((a) => a.symbol === symbol))}
            assets={filteredTargetAssets}
            className="w-full"
          />
        </div>
      </div>

      <Button
        onClick={handleGetQuote}
        disabled={loading || !sourceAmount || contextSourceAsset.symbol === contextTargetAsset.symbol}
        className="w-full bg-[#1ea3ab] text-white py-2 rounded-lg shadow-lg hover:bg-[#188a91]"
      >
        {loading ? <RefreshCw className="animate-spin" /> : 'Get Quote'}
      </Button>

      {(error || contextError) && <p className="text-red-500 text-sm text-center">{error || contextError}</p>}
    </div>
  );
};
