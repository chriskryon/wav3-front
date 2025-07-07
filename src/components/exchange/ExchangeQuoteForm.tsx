'use client';

import { useState, useEffect } from 'react';
import { QuoteStep } from './steps/QuoteStep';
import { ConfirmStep } from './steps/ConfirmStep';
import { SuccessStep } from './steps/SuccessStep';
import { DepositInstructionStep } from './steps/DepositInstructionStep';
import { listAssets, getQuote, createOrder } from '@/services/api-service';
import { useQuery } from '@tanstack/react-query';
import type { QuoteRequest, QuoteResponse } from '@/entities/types';

export function ExchangeQuoteForm() {
  const [mounted, setMounted] = useState(false);
  const { data: cryptoData, isLoading: loadingCrypto, error: errorCrypto } = useQuery({
    queryKey: ['exchange-assets', 'crypto'],
    queryFn: async () => {
      const res = await listAssets({ type: 'crypto' });
      return res.assets || [];
    },
    staleTime: 1000 * 60,
  });
  
  const { data: fiatData, isLoading: loadingFiat, error: errorFiat } = useQuery({
    queryKey: ['exchange-assets', 'fiat'],
    queryFn: async () => {
      const res = await listAssets({ type: 'fiat' });
      return res.assets || [];
    },
    staleTime: 1000 * 60,
  });

  // Unifica os assets
  const assets = [
    ...(cryptoData || []),
    ...(fiatData || []),
  ];

  // Estados dependentes dos assets reais
  const [sourceAsset, setSourceAsset] = useState<any>(null);
  const [targetAsset, setTargetAsset] = useState<any>(null);
  const [network, setNetwork] = useState('');
  const [sourceAmount, setSourceAmount] = useState('1');
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(20);
  const [direction, setDirection] = useState<'pay' | 'receive'>('pay');
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0); // 0: form, 1: confirm, 2: success, 3: deposit
  const [order, setOrder] = useState<any>(null);

  const handleGetQuote = async () => {
    setLoading(true);
    setError(null);
    try {
      // Sempre envia o network name do asset crypto
      let networkName = network;
      let cryptoAsset = null;
      if (sourceAsset && sourceAsset.type === 'crypto') {
        cryptoAsset = sourceAsset;
      } else if (targetAsset && targetAsset.type === 'crypto') {
        cryptoAsset = targetAsset;
      }
      if (cryptoAsset && cryptoAsset.networks && cryptoAsset.networks.length > 0) {
        const netObj = cryptoAsset.networks.find((n: any) => n.id === network || n.name === network) || cryptoAsset.networks[0];
        if (netObj && netObj.name) {
          networkName = netObj.name;
        }
      }
      const payload: QuoteRequest = {
        source_asset: sourceAsset.symbol,
        target_asset: targetAsset.symbol,
        network: networkName, // sempre o name do asset crypto
        product: 'exchange',
        source_amount: direction === 'pay' ? Number(sourceAmount) : undefined,
        target_amount: direction === 'receive' ? Number(sourceAmount) : undefined,
      };
      const response: QuoteResponse = await getQuote(payload);
      // Inclui os objetos de asset completos no resultado do quote
      setQuote({ ...response, sourceAsset, targetAsset });
      setStep(1);
      setTimer(20);
    } catch (err: any) {
      setQuote(null);
      setError(err.message || 'Erro ao obter cotação.');
    } finally {
      setLoading(false);
    }
  };

  // Timer para quote expirar
  useEffect(() => {
    if (!quote) return;
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [quote, timer]);

  // Atualiza network ao trocar asset
  useEffect(() => {
    // Sempre seleciona o network do asset crypto
    let cryptoAsset = null;
    if (sourceAsset && sourceAsset.type === 'crypto') {
      cryptoAsset = sourceAsset;
    } else if (targetAsset && targetAsset.type === 'crypto') {
      cryptoAsset = targetAsset;
    }
    if (cryptoAsset && cryptoAsset.networks && cryptoAsset.networks.length > 0) {
      setNetwork(cryptoAsset.networks[0]?.id || '');
    }
  }, [sourceAsset, targetAsset]);

  // Inicializa os assets quando carregar
  useEffect(() => {
    setMounted(true);
    if (assets && assets.length > 1 && (!sourceAsset || !targetAsset)) {
      setSourceAsset(assets[0]);
      setTargetAsset(assets[1]);
    }
  }, [assets]);

  // Troca direção (pay/receive)
  const handleSwap = () => {
    setSourceAsset(targetAsset);
    setTargetAsset(sourceAsset);
    setQuote(null);
    setTimer(20);
  };

  // Loading e erro de assets
  if (!mounted || loadingCrypto || loadingFiat || !sourceAsset || !targetAsset) {
    return <div className='text-center text-lg text-[#1ea3ab] py-10'>Loading assets...</div>;
  }
  if (errorCrypto || errorFiat || !assets || assets.length === 0) {
    return <div className='text-center text-lg text-red-500 py-10'>Error loading assets.</div>;
  }

  // Stepper UI
  // Helper para filtrar assets de acordo com a seleção
  const getFilteredAssets = (type: 'crypto' | 'fiat') => assets.filter((a) => a.type === type);

  // Determina os assets disponíveis para cada lado
  const sourceAssetOptions = targetAsset && targetAsset.type === 'fiat' ? getFilteredAssets('crypto') : getFilteredAssets('fiat');
  const targetAssetOptions = sourceAsset && sourceAsset.type === 'fiat' ? getFilteredAssets('crypto') : getFilteredAssets('fiat');

  return (
    <div className="w-full max-w-xl mx-auto glass-card-enhanced/80 border-2 border-wav3 rounded-3xl shadow-2xl p-4 md:p-6 flex flex-col gap-6 mt-4 mb-4 min-h-[500px] justify-center relative backdrop-blur-xl bg-white/70">
      {/* Stepper header */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className={`flex flex-col items-center ${step === 0 ? 'text-[#1ea3ab]' : 'text-gray-400'}`}>
          <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold border-2 ${step === 0 ? 'border-[#1ea3ab] bg-[#e6f7f8]' : 'border-gray-300 bg-white'}`}>
            1
          </div>
          <span className="text-xs mt-1">Quote</span>
        </div>
        <div className="w-6 h-1 bg-gradient-to-r from-[#1ea3ab] to-gray-200 rounded-full" />
        <div className={`flex flex-col items-center ${step === 1 ? 'text-[#1ea3ab]' : 'text-gray-400'}`}>
          <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold border-2 ${step === 1 ? 'border-[#1ea3ab] bg-[#e6f7f8]' : 'border-gray-300 bg-white'}`}>
            2
          </div>
          <span className="text-xs mt-1">Confirm</span>
        </div>
        <div className="w-6 h-1 bg-gradient-to-r from-[#1ea3ab] to-gray-200 rounded-full" />
        <div className={`flex flex-col items-center ${step === 2 ? 'text-[#1ea3ab]' : 'text-gray-400'}`}>
          <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold border-2 ${step === 2 ? 'border-[#1ea3ab] bg-[#e6f7f8]' : 'border-gray-300 bg-white'}`}>
            3
          </div>
          <span className="text-xs mt-1">Success</span>
        </div>
      </div>

      {/* Step 0: Formulário de cotação */}
      {step === 0 && (
        <div className="p-0 md:p-2">
          <QuoteStep
            assets={assets}
            sourceAsset={sourceAsset}
            targetAsset={targetAsset}
            sourceAmount={sourceAmount}
            direction={direction}
            loading={loading}
            error={error}
            // Só permite selecionar CRYPTO se o outro for FIAT, e vice-versa
            onSourceAssetChange={(val) => {
              const found = assets.find((a) => a.symbol === val);
              if (found) setSourceAsset(found);
              setQuote(null);
            }}
            onTargetAssetChange={(val) => {
              const found = assets.find((a) => a.symbol === val);
              if (found) setTargetAsset(found);
              setQuote(null);
            }}
            onSourceAmountChange={setSourceAmount}
            onSwap={handleSwap}
            onGetQuote={handleGetQuote}
          />
        </div>
      )}

      {/* Step 1: Confirmação da troca */}
      {step === 1 && quote && (
        <div className="p-0 md:p-2">
          <ConfirmStep
            sourceAsset={sourceAsset}
            targetAsset={targetAsset}
            quote={quote}
            timer={timer}
            loading={loading}
            onBack={() => setStep(0)}
            onConfirm={async () => {
              setLoading(true);
              setError(null);
              try {
                // Always send network name
                let networkName = network;
                let cryptoAsset = null;
                if (sourceAsset && sourceAsset.type === 'crypto') {
                  cryptoAsset = sourceAsset;
                } else if (targetAsset && targetAsset.type === 'crypto') {
                  cryptoAsset = targetAsset;
                }
                if (cryptoAsset && cryptoAsset.networks && cryptoAsset.networks.length > 0) {
                  const netObj = cryptoAsset.networks.find((n: any) => n.id === network || n.name === network) || cryptoAsset.networks[0];
                  if (netObj && netObj.name) {
                    networkName = netObj.name;
                  }
                }
                const orderPayload = {
                  source_asset: sourceAsset.symbol,
                  target_asset: targetAsset.symbol,
                  network: networkName,
                  source_amount: direction === 'pay' ? Number(sourceAmount) : 0,
                  target_amount: direction === 'receive' ? Number(sourceAmount) : 0,
                };
                const orderRes = await createOrder(orderPayload);
                setOrder(orderRes);
                setStep(3);
              } catch (err: any) {
                setError(err.message || 'Erro ao criar ordem.');
              } finally {
                setLoading(false);
              }
            }}
            onRefresh={handleGetQuote}
          />
        </div>
      )}

      {/* Step 2: Sucesso */}
      {step === 2 && (
        <div className="p-0 md:p-2">
          <SuccessStep
            onNewExchange={() => {
              setStep(0);
              setQuote(null);
              setTimer(20);
              setOrder(null);
            }}
          />
        </div>
      )}

      {/* Step 3: Instruções de Depósito */}
      {step === 3 && order && (
        <div className="p-0 md:p-2">
          <DepositInstructionStep
            order={order}
            onReturn={() => setStep(1)}
            onDepositMade={() => setStep(2)}
          />
        </div>
      )}
    </div>
  );
}
