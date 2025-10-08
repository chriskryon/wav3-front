import type React from 'react';
import { useState, useEffect } from 'react';
import { useExchangeContext } from '@/context/ExchangeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AssetSelect } from '../AssetSelect';
import { RefreshCw, ArrowUpDown, ToggleLeft, ToggleRight } from 'lucide-react';
import { getQuote } from '@/services/exchange-api-service';
import Wav3Loading from '@/components/loading-wav3';

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

  const [error, setError] = useState<string | null>(contextError || null);
  const [amountType, setAmountType] = useState<'source' | 'target'>('source'); // Novo estado para tipo de amount
  const [targetAmount, setTargetAmount] = useState<string>(''); // Novo estado para target amount

  // Update targetAsset dynamically based on sourceAsset changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: <->
    useEffect(() => {
    if (assets && assets.length > 0) {
      if (contextSourceAsset?.type === 'crypto') {
        setContextTargetAsset(assets.find((a) => a.symbol === 'BRL'));
      } else if (contextSourceAsset?.type === 'fiat') {
        setContextTargetAsset(assets.find((a) => a.symbol === 'USDT'));
      }
    }
  }, [contextSourceAsset, assets]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <->
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
          // Enviar apenas o campo correto baseado no tipo selecionado
          ...(amountType === 'source' 
            ? { source_amount: Number(sourceAmount), target_amount: 0 }
            : { source_amount: 0, target_amount: Number(targetAmount) }
          ),
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

  // Filtrar apenas para não mostrar o mesmo asset selecionado no source
  const filteredTargetAssets = assets.filter((asset) => {
    return asset.symbol !== contextSourceAsset?.symbol;
  });

  if (!assets || assets.length === 0) {
    return <Wav3Loading />;
  }

  return (
    <div className="flex flex-col gap-4 h-full p-4 bg-white rounded-xl border border-gray-200 overflow-y-auto">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#1ea3ab]/10 mb-3">
          <RefreshCw className="w-4 h-4 text-[#1ea3ab]" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Get a Quote</h2>
        <p className="text-sm text-gray-600">Enter your exchange details to get an instant quote</p>
      </div>

      <div className="space-y-4">
        {/* Amount Type Toggle */}
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              {amountType === 'source' ? 'Specify how much you want to pay' : 'Specify how much you want to receive'}
            </span>
            <Button
              type="button"
              onClick={() => {
                setAmountType(amountType === 'source' ? 'target' : 'source');
                // Limpar ambos os campos ao trocar
                setSourceAmount('');
                setTargetAmount('');
              }}
              className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded-md transition-colors"
            >
              {amountType === 'source' ? (
                <>
                  <ToggleLeft className="w-4 h-4 text-[#1ea3ab]" />
                  <span className="text-xs">Pay Amount</span>
                </>
              ) : (
                <>
                  <ToggleRight className="w-4 h-4 text-[#1ea3ab]" />
                  <span className="text-xs">Receive Amount</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Amount Section */}
        <div className="space-y-2">
          <label htmlFor="amount-input" className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {amountType === 'source' ? 'Amount You Want to Pay' : 'Amount You Want to Receive'}
          </label>
          <div className="relative">
            <Input
              id="amount-input"
              type="number"
              placeholder="0.00"
              value={amountType === 'source' ? sourceAmount : targetAmount}
              onChange={(e) => {
                if (amountType === 'source') {
                  setSourceAmount(e.target.value);
                  setTargetAmount(''); // Limpar o outro campo
                } else {
                  setTargetAmount(e.target.value);
                  setSourceAmount(''); // Limpar o outro campo
                }
              }}
              className="text-lg font-mono bg-white p-3 rounded-lg border border-gray-300 focus:border-[#1ea3ab] focus:ring-1 focus:ring-[#1ea3ab] transition-colors placeholder:text-gray-400"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">
              {amountType === 'source' 
                ? contextSourceAsset?.symbol 
                : contextTargetAsset?.symbol
              }
            </div>
          </div>
          <p className="text-xs text-gray-500">
            {amountType === 'source' 
              ? `Enter the ${contextSourceAsset?.symbol || 'source'} amount you want to exchange`
              : `Enter the ${contextTargetAsset?.symbol || 'target'} amount you want to receive`
            }
          </p>
        </div>

        {/* Exchange Pair Section */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
          {/* From Asset */}
          <div className="space-y-2">
            <label htmlFor="from-asset-select" className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              You Pay
            </label>
            <AssetSelect
              value={contextSourceAsset?.symbol}
              onChange={(symbol) => setContextSourceAsset(assets.find((a) => a.symbol === symbol))}
              assets={assets}
              className="w-full bg-white border-gray-300 focus:border-[#1ea3ab] focus:ring-1 focus:ring-[#1ea3ab]"
            />
          </div>

          {/* Swap Button */}
          <div className="flex justify-center py-1">
            <Button
              type="button"
              onClick={() => {
                const temp = contextSourceAsset;
                setContextSourceAsset(contextTargetAsset);
                setContextTargetAsset(temp);
              }}
              className="bg-[#1ea3ab] text-white p-2 rounded-lg hover:bg-[#188a91] transition-colors border border-[#1ea3ab]"
            >
              <ArrowUpDown className="w-4 h-4" />
            </Button>
          </div>

          {/* To Asset */}
          <div className="space-y-2">
            <label htmlFor="to-asset-select" className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              You Receive
            </label>
            <AssetSelect
              value={contextTargetAsset?.symbol}
              onChange={(symbol) => setContextTargetAsset(assets.find((a) => a.symbol === symbol))}
              assets={filteredTargetAssets}
              className="w-full bg-white border-gray-300 focus:border-[#1ea3ab] focus:ring-1 focus:ring-[#1ea3ab]"
            />
          </div>
        </div>
      </div>

      {/* Get Quote Button */}
      <div className="mt-auto pt-3">
        <Button
          type="button"
          onClick={handleGetQuote}
          disabled={
            loading || 
            (amountType === 'source' ? !sourceAmount : !targetAmount) || 
            contextSourceAsset?.symbol === contextTargetAsset?.symbol
          }
          className="w-full bg-[#1ea3ab] text-white py-3 px-4 rounded-lg border border-[#1ea3ab] hover:bg-[#188a91] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-3">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Getting Quote...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3 group-hover:gap-4 transition-all duration-300">
              <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
              <span>Get Quote</span>
            </div>
          )}
        </Button>
      </div>

      {/* Error Display */}
      {(error || contextError) && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <p className="text-red-700 text-sm font-medium">{error || contextError}</p>
          </div>
        </div>
      )}
    </div>
  );
};
