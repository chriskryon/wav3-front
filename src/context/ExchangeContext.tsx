/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */
import type React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { QuoteResponse } from '@/entities/types';
import { listAssets } from '@/services/asset-api-service';

interface ExchangeContextProps {
  step: 'quote' | 'pre-deposit' | 'confirm' | 'deposit' | 'success';
  setStep: React.Dispatch<React.SetStateAction<'quote' | 'pre-deposit' | 'confirm' | 'deposit' | 'success'>>;
  quoteData: any;
  setQuoteData: React.Dispatch<React.SetStateAction<any>>;
  orderData: any;
  setOrderData: React.Dispatch<React.SetStateAction<any>>;
  assets: any[];
  setAssets: React.Dispatch<React.SetStateAction<any[]>>;
  sourceAsset: any;
  setSourceAsset: React.Dispatch<React.SetStateAction<any>>;
  targetAsset: any;
  setTargetAsset: React.Dispatch<React.SetStateAction<any>>;
  sourceAmount: string;
  setSourceAmount: React.Dispatch<React.SetStateAction<string>>;
  timer: number;
  setTimer: React.Dispatch<React.SetStateAction<number>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  quoteResult: QuoteResponse | null;
  setQuoteResult: React.Dispatch<React.SetStateAction<QuoteResponse | null>>;
  orderResult: any;
  setOrderResult: React.Dispatch<React.SetStateAction<any>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  navigateToStep: (nextStep: 'quote' | 'pre-deposit' | 'confirm' | 'deposit' | 'success') => void;
  sendRequest: (
    requestFn: () => Promise<any>,
    onSuccess?: (response: any) => void,
    onError?: (error: any) => void
  ) => Promise<void>;
}

const ExchangeContext = createContext<ExchangeContextProps | undefined>(undefined);

export const ExchangeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [step, setStep] = useState<'quote' | 'pre-deposit' | 'confirm' | 'deposit' | 'success'>('quote');
  const [quoteData, setQuoteData] = useState<any>(null);
  const [orderData, setOrderData] = useState<any>(null);
  const [sourceAsset, setSourceAsset] = useState<any>(null);
  const [targetAsset, setTargetAsset] = useState<any>(null);
  const [sourceAmount, setSourceAmount] = useState<string>('');
  const [timer, setTimer] = useState<number>(20);
  const [loading, setLoading] = useState<boolean>(false);
  const [quoteResult, setQuoteResult] = useState<QuoteResponse | null>(null);
  const [orderResult, setOrderResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: assets = [], isLoading: assetsLoading } = useQuery({
    queryKey: ['exchange-assets'],
    queryFn: async () => {
      const cryptoAssets = await listAssets('crypto');
      const fiatAssets = await listAssets('fiat');
      return [...(cryptoAssets.assets || []), ...(fiatAssets.assets || [])];
    },
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (assets.length > 0 && (!sourceAsset || !targetAsset)) {
      console.log('Assets loaded:', assets);
      setSourceAsset(assets[0]);
      setTargetAsset(assets[1]);
    }
  }, [assets]);

  const navigateToStep = (nextStep: 'quote' | 'pre-deposit' | 'confirm' | 'deposit' | 'success') => {
    setError(null);
    console.log(`Navigating to step: ${nextStep}`);
    setStep(nextStep);
  };

  const sendRequest = async (
    requestFn: () => Promise<any>,
    onSuccess?: (response: any) => void,
    onError?: (error: any) => void
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await requestFn();
      if (onSuccess) onSuccess(response);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      if (onError) onError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ExchangeContext.Provider
      value={{
        step,
        setStep,
        quoteData,
        setQuoteData,
        orderData,
        setOrderData,
        assets,
        setAssets: () => {},
        sourceAsset,
        setSourceAsset,
        targetAsset,
        setTargetAsset,
        sourceAmount,
        setSourceAmount,
        timer,
        setTimer,
        loading: loading || assetsLoading,
        setLoading,
        quoteResult,
        setQuoteResult,
        orderResult,
        setOrderResult,
        error,
        setError,
        navigateToStep,
        sendRequest,
      }}
    >
      {children}
    </ExchangeContext.Provider>
  );
};

export const useExchangeContext = () => {
  const context = useContext(ExchangeContext);
  if (!context) {
    throw new Error('useExchangeContext must be used within an ExchangeProvider');
  }
  return context;
};