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
  <div className="glass-card-enhanced/90 border-2 border-wav3 rounded-2xl shadow-xl p-3 md:p-5 flex flex-col gap-4 backdrop-blur-xl bg-white/80">
    <div className='text-center mb-2'>
      <h2 className='text-2xl md:text-3xl font-bold text-[#1ea3ab] mb-1 tracking-tight'>
        Requesting a Quote
      </h2>
      <p className='text-base md:text-lg text-gray-500 font-medium'>
        Get a quote for buying and selling cryptocurrencies.
      </p>
    </div>
    <div className='flex flex-col gap-3'>
      {/* Card Send */}
      <div className='flex flex-col gap-2'>
        <span className='text-sm font-semibold text-[#1ea3ab] mb-1 ml-1'>Send</span>
        <div className='flex flex-row gap-2 bg-white/70 glass-card-enhanced/60 border border-wav3 rounded-xl p-1 shadow-inner items-center'>
          <Input
            type='number'
            min={0}
            value={direction === 'pay' ? sourceAmount : ''}
            onChange={(e) => onSourceAmountChange(e.target.value)}
            className='flex-1 text-2xl font-mono border-none bg-transparent focus:ring-0 focus:border-none outline-none px-4 py-0 h-16 rounded-xl shadow-none'
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
          className='h-12 w-12 rounded-xl border-2 border-wav3 flex items-center justify-center bg-white/70 hover:bg-[#e6f7f8] shadow transition-colors text-[#1ea3ab] text-xl backdrop-blur-lg'
          onClick={onSwap}
          style={{ zIndex: 2 }}
        >
          <ArrowRightLeft className='w-7 h-7' />
        </Button>
      </div>
      {/* Card Get */}
      <div className='flex flex-col gap-2'>
        <span className='text-sm font-semibold text-[#1ea3ab] mb-1 ml-1'>Get</span>
        <div className='flex flex-row gap-2 w-full bg-white/70 glass-card-enhanced/60 border border-wav3 rounded-xl p-1 shadow-inner items-center'>
          <AssetSelect
            value={targetAsset.symbol}
            onChange={onTargetAssetChange}
            assets={
              sourceAsset
                ? sourceAsset.type === 'fiat'
                  ? assets.filter(a => a.type === 'crypto')
                  : assets.filter(a => a.type === 'fiat')
                : []
            }
            excludeSymbol={sourceAsset.symbol}
            className='w-full'
          />
        </div>
      </div>
      {/* Min/Max/Reserves info (placeholder) */}
    </div>
    <Button
      className='w-full bg-[#1ea3ab] hover:bg-[#188a91] text-white font-semibold shadow mt-3 text-base py-3 rounded-xl glass-card-enhanced/80 border border-wav3 backdrop-blur-lg transition-all duration-200'
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
