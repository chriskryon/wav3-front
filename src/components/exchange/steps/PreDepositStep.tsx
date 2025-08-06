import type React from 'react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useExchangeContext } from '@/context/ExchangeContext';
import { NetworkIcon } from '@/components/ui/network-icon';
import { useToast } from '@/hooks/use-toast'; // Importando o hook de toast
import { getQuote } from '@/services/exchange-api-service';
import Wav3Loading from '@/components/loading-wav3';

interface PreDepositStepProps {
  onBack: () => void;
  onConfirm: (orderData: any) => void;
}

export const PreDepositStep: React.FC<PreDepositStepProps> = ({ onBack, onConfirm }) => {
  const { quoteResult, sourceAsset, targetAsset, setLoading, setError, setQuoteResult, setOrderResult, navigateToStep } = useExchangeContext();
  const [timer, setTimer] = useState(20);
  const [error, setLocalError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchQuote = async () => {
    if (!quoteResult) return;

    const cryptoAsset = sourceAsset.type === 'crypto' ? sourceAsset : targetAsset;
    const networkName = cryptoAsset.networks?.[0]?.name || '';

    const payload = {
      source_asset: quoteResult.source_asset,
      target_asset: quoteResult.target_asset,
      network: networkName,
      source_amount: quoteResult.source_amount,
      product: 'exchange',
    };

    setLoading(true);
    setError(null);

    try {
        console.log('Fetching updated quote with payload:', payload);
      const updatedQuote = await getQuote(payload);
      setQuoteResult(updatedQuote as any);
      console.log('Updated Quote:', updatedQuote);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch updated quote.');
      console.error('Error fetching updated quote:', error);
    } finally {
      setLoading(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <->
  useEffect(() => {
    const interval = setInterval(() => {
      fetchQuote();
      setTimer(20);
    }, 20000);

    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(countdown);
    };
  }, [quoteResult, sourceAsset, targetAsset]); // Adicionado dependências para garantir atualização correta

  const handleConfirm = async () => {
    console.log('handleConfirm called');

    if (!quoteResult) {
      console.log('quoteResult is null');
      return;
    }

    const cryptoAsset = sourceAsset.type === 'crypto' ? sourceAsset : targetAsset;
    const networkName = cryptoAsset.networks?.[0]?.name || '';

    const payload = {
      source_asset: quoteResult.source_asset,
      target_asset: quoteResult.target_asset,
      network: networkName,
      source_amount: quoteResult.source_amount,
      target_amount: quoteResult.target_amount_estimate,
    };

    console.log('Payload:', payload);

    setLoading(true);
    setError(null);
    setLocalError(null);

    try {
      
      // Mock response condizente para ETH
      const mockResponse = {
        amount: quoteResult.source_amount,
        asset: {
          large_image_url: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
          medium_image_url: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
          name: 'Ethereum',
          small_image_url: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
          symbol: 'ETH',
          type: 'crypto',
        },
        date_time: new Date().toISOString(),
        deposit: true,
        exp_time: Math.floor(Date.now() / 1000) + 1800,
        message: 'Order created successfully.',
        network: networkName,
        tag: '',
        wallet_address: '0x1234567890abcdef1234567890abcdef12345678',
      };

      console.log('Mock Order created successfully:', mockResponse);
      setOrderResult(mockResponse);
      navigateToStep('deposit');
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to create order.';
      setError(errorMessage);
      setLocalError(errorMessage);
      console.error('Error creating order:', error);
    } finally {
      setLoading(false);
    }
  };

  // Updated formatCurrency to handle dynamic decimal places
  const formatCurrency = (amount: number, symbol: string): string => {
    const currencyMap: Record<string, { locale: string; currency: string }> = {
      BRL: { locale: 'pt-BR', currency: 'BRL' },
      USD: { locale: 'en-US', currency: 'USD' },
      EUR: { locale: 'de-DE', currency: 'EUR' },
      COP: { locale: 'es-CO', currency: 'COP' },
      MXN: { locale: 'es-MX', currency: 'MXN' },
      ARS: { locale: 'es-AR', currency: 'ARS' },
    };

    const currencyInfo = currencyMap[symbol];

    if (currencyInfo) {
      return new Intl.NumberFormat(currencyInfo.locale, {
        style: 'currency',
        currency: currencyInfo.currency,
        minimumFractionDigits: amount % 1 === 0 ? 2 : undefined,
        maximumFractionDigits: 8,
      }).format(amount);
    }
    return `${amount} ${symbol}`;
  };

  if (!quoteResult) {
    return (
      <Wav3Loading />
    );
  }

  return (
    <div className="flex flex-col gap-4 h-full p-2 bg-white rounded-xl border border-gray-200 overflow-y-auto">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#1ea3ab]/10 mb-1">
          <svg className="w-4 h-4 text-[#1ea3ab]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <title>Quote Summary</title>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-.3">Quote Summary</h2>
        <p className="text-sm text-gray-600">Review the details before proceeding</p>
        
        {/* Timer Badge */}
        <div className="inline-flex items-center gap-1 bg-gray-50 text-gray-700 px-3 py-1 rounded-lg mt-3 border border-gray-200">
          <div className="w-1.5 h-1.5 bg-[#1ea3ab] rounded-full"></div>
          <span className="text-xs font-medium">Updates in {timer}s</span>
        </div>
      </div>

      {/* Quote Details Card */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-4">
        {/* Exchange Visual */}
        <div className="text-center">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Exchange Details</h3>
          <div className="flex items-center justify-center gap-4">
            {/* You Pay */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                <NetworkIcon symbol={sourceAsset.symbol} className="w-6 h-6" />
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 font-medium">You Pay</div>
                <div className="text-sm font-semibold text-gray-900">
                  {formatCurrency(quoteResult.source_amount || 0, sourceAsset.symbol)}
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-lg bg-[#1ea3ab] flex items-center justify-center shadow-sm">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <title>Exchange Arrow</title>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Swap</span>
            </div>

            {/* You Receive */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                <NetworkIcon symbol={targetAsset.symbol} className="w-6 h-6" />
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 font-medium">You Receive</div>
                <div className="text-sm font-semibold text-gray-900">
                  {formatCurrency(quoteResult.target_amount_estimate || 0, targetAsset.symbol)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rate Information */}
        {quoteResult.price_reference && (
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">Exchange Rate</span>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  1 {sourceAsset.symbol} ≈ {formatCurrency(quoteResult.price_reference || 0, targetAsset.symbol)}
                </div>
                <div className="text-xs text-gray-500">Live market rate</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 mt-auto pt-3">
        <Button
          type="button"
          onClick={onBack}
          variant="outline"
          className="flex-1 bg-white border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors font-medium"
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={handleConfirm}
          className="flex-1 bg-[#1ea3ab] text-white py-2 px-4 rounded-lg border border-[#1ea3ab] hover:bg-[#188a91] transition-colors font-medium"
        >
          <span className="flex items-center justify-center gap-1">
            Create Order
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <title>Create</title>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
        </Button>
      </div>
    </div>
  );
};
