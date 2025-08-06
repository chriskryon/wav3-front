import type React from 'react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useExchangeContext } from '@/context/ExchangeContext';
import { NetworkIcon } from '@/components/ui/network-icon';
import { useToast } from '@/hooks/use-toast'; // Importando o hook de toast
import { getQuote } from '@/services/exchange-api-service';

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
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Loading quote details...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 h-full p-6 bg-white/70 rounded-3xl shadow-xl backdrop-blur-md overflow-y-auto">
      <div className="text-center">
        <h2 className="text-xl font-bold text-[#1ea3ab]">Quote Summary</h2>
        <p className="text-sm text-gray-500">Review the details before proceeding.</p>
        <p className="text-sm text-gray-500 mt-2">
          Next update in: <span className="font-bold text-[#1ea3ab]">{timer}s</span>
        </p>
      </div>

      <div className="flex flex-col gap-4 p-4 rounded-lg shadow bg-wav3/10 border border-wav3/30">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-500">You Pay:</span>
          <div className="flex items-center gap-2">
            <NetworkIcon symbol={sourceAsset.symbol} className="w-6 h-6" />
            <span className="text-lg font-bold text-[#1ea3ab]">
              {formatCurrency(quoteResult.source_amount || 0, sourceAsset.symbol)}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-500">You Receive:</span>
          <div className="flex items-center gap-2">
            <NetworkIcon symbol={targetAsset.symbol} className="w-6 h-6" />
            <span className="text-lg font-bold text-[#1ea3ab]">
              {formatCurrency(quoteResult.target_amount_estimate || 0, targetAsset.symbol)}
            </span>
          </div>
        </div>
        {quoteResult.price_reference && (
          <div className="flex items-center justify-between border-t pt-2 mt-2">
            <span className="text-sm font-semibold text-gray-500">Rate:</span>
            <span className="text-sm text-gray-500">
              1 {sourceAsset.symbol} ≈ {formatCurrency(quoteResult.price_reference || 0, targetAsset.symbol)}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-center">
            <p className="text-sm">{error}</p>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <Button
          onClick={onBack}
          className="flex-1 bg-gray-200 text-[#1ea3ab] py-2 rounded-lg shadow hover:bg-gray-300"
        >
          Back
        </Button>
        <Button
          onClick={handleConfirm}
          className="flex-1 bg-[#1ea3ab] text-white py-2 rounded-lg shadow hover:bg-[#188a91]"
        >
          Create Order
        </Button>
      </div>
    </div>
  );
};
