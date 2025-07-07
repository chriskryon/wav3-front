import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AssetSelect } from '../AssetSelect';
import { ArrowRightLeft, RefreshCw } from 'lucide-react';

interface QuoteStepProps {
  assets: any[];
  sourceAsset: any;
  targetAsset: any;
  sourceAmount: string;
  direction: 'pay' | 'receive';
  loading: boolean;
  error: string | null;
  onSourceAssetChange: (symbol: string) => void;
  onTargetAssetChange: (symbol: string) => void;
  onSourceAmountChange: (val: string) => void;
  onSwap: () => void;
  onGetQuote: () => void;
}

export const QuoteStep: React.FC<QuoteStepProps> = ({
  assets,
  sourceAsset,
  targetAsset,
  sourceAmount,
  direction,
  loading,
  error,
  onSourceAssetChange,
  onTargetAssetChange,
  onSourceAmountChange,
  onSwap,
  onGetQuote,
}) => (
  <div>
    <div className='text-center mb-4'>
      <h2 className='text-3xl md:text-4xl font-extrabold text-[#1ea3ab] mb-2 tracking-tight'>
        Requesting a Quote
      </h2>
      <p className='text-lg md:text-xl text-gray-500 font-medium'>
        Get a quote for buying and selling cryptocurrencies.
      </p>
    </div>
    <div className='flex flex-col gap-6'>
      {/* Card Send */}
      <div className='flex flex-col gap-2'>
        <span className='text-sm font-semibold text-gray-500 mb-1 ml-1'>Send</span>
        <div className='flex flex-row gap-2'>
          <Input
            type='number'
            min={0}
            value={direction === 'pay' ? sourceAmount : ''}
            onChange={(e) => onSourceAmountChange(e.target.value)}
            className='flex-1 text-2xl font-mono border-none bg-white focus:ring-0 focus:border-none outline-none px-4 py-0 h-16 rounded-xl shadow border border-[#1ea3ab]/20'
            placeholder='0.00'
            style={{ minWidth: 0 }}
          />
          <AssetSelect
            value={sourceAsset.symbol}
            onChange={onSourceAssetChange}
            assets={assets}
            excludeSymbol={targetAsset.symbol}
            className='w-48'
          />
        </div>
      </div>
      {/* Swap Button */}
      <div className='flex justify-center my-1'>
        <Button
          type='button'
          variant='ghost'
          className='h-12 w-12 rounded-2xl border-2 border-[#1ea3ab]/30 flex items-center justify-center bg-white hover:bg-[#e6f7f8] shadow-lg transition-colors text-[#1ea3ab] text-2xl'
          onClick={onSwap}
          style={{ zIndex: 2 }}
        >
          <ArrowRightLeft className='w-7 h-7' />
        </Button>
      </div>
      {/* Card Get */}
      <div className='flex flex-col gap-2'>
        <span className='text-sm font-semibold text-gray-500 mb-1 ml-1'>Get</span>
        <div className='flex flex-row gap-2 w-full'>
          <AssetSelect
            value={targetAsset.symbol}
            onChange={onTargetAssetChange}
            assets={assets}
            excludeSymbol={sourceAsset.symbol}
            className='w-full'
          />
        </div>
      </div>
      {/* Min/Max/Reserves info (placeholder) */}
      
    </div>
    <Button
      className='bg-[#1ea3ab] hover:bg-[#1ea3ab]/90 text-white font-semibold shadow-lg mt-4 text-lg py-4 rounded-xl'
      onClick={onGetQuote}
      disabled={
        loading ||
        sourceAsset.symbol === targetAsset.symbol
      }
    >
      {loading ? (
        <span className='flex items-center gap-2'>
          <RefreshCw className='w-5 h-5 animate-spin' /> Requesting quote...
        </span>
      ) : (
        'Get Quote'
      )}
    </Button>
    {error && (
      <div className='text-red-500 text-center font-medium mt-2'>
        {error}
      </div>
    )}
  </div>
);
