import React from 'react';
import { renderAssetIconUnified } from '../AssetSelect';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RefreshCw } from 'lucide-react';

interface ConfirmStepProps {
  sourceAsset: any;
  targetAsset: any;
  quote: any;
  timer: number;
  loading: boolean;
  onBack: () => void;
  onConfirm: () => void;
  onRefresh: () => void;
}

export const ConfirmStep: React.FC<ConfirmStepProps> = ({
  sourceAsset,
  targetAsset,
  quote,
  timer,
  loading,
  onBack,
  onConfirm,
  onRefresh,
}) => (
  <div className='flex flex-col gap-8'>
    <div className='text-center mb-4'>
      <h2 className='text-3xl md:text-4xl font-extrabold text-[#1ea3ab] mb-2 tracking-tight'>
        Confirm Exchange
      </h2>
      <p className='text-lg md:text-xl text-gray-500 font-medium'>
        Review and confirm your exchange details.
      </p>
    </div>
    <div className='mt-2 rounded-2xl border-2 border-[#1ea3ab]/30 bg-gradient-to-br from-[#e6f7f8] via-white to-[#d0f3f6] p-8 flex flex-col gap-4 shadow-xl'>
      <div className='flex items-center gap-5 mb-4 justify-center'>
        {renderAssetIconUnified(sourceAsset, 40)}
        <span className='font-bold text-[#1ea3ab] text-2xl'>
          {sourceAsset.symbol}
        </span>
        {renderAssetIconUnified(targetAsset, 40)}
        <span className='font-bold text-[#1ea3ab] text-2xl'>
          {targetAsset.symbol}
        </span>
      </div>
      <div className='flex flex-col sm:flex-row gap-4 sm:gap-10'>
        <div className='flex-1'>
          <Label className='text-sm text-[#1ea3ab] font-semibold'>
            You pay
          </Label>
          <div className='font-mono text-xl text-[#1ea3ab] bg-white/70 rounded-xl px-4 py-2 mt-2 break-all shadow-inner border-2 border-dashed border-[#1ea3ab]/30'>
            {sourceAsset.type === 'fiat'
              ? Number(quote.source_amount).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : quote.source_amount}{' '}
            {sourceAsset.symbol}
          </div>
        </div>
        <div className='flex-1'>
          <Label className='text-sm text-[#1ea3ab] font-semibold'>
            You receive
          </Label>
          <div className='font-mono text-xl text-[#1ea3ab] bg-white/70 rounded-xl px-4 py-2 mt-2 break-all shadow-inner border-2 border-dashed border-[#1ea3ab]/30'>
            {targetAsset.type === 'fiat'
              ? Number(quote.target_amount_estimate).toLocaleString(
                  undefined,
                  { minimumFractionDigits: 2, maximumFractionDigits: 2 },
                )
              : quote.target_amount_estimate}{' '}
            {targetAsset.symbol}
          </div>
        </div>
      </div>
      <div className='flex items-center gap-3 mt-4'>
        <span className='text-base text-gray-500'>Rate:</span>
        <span className='font-mono text-lg text-[#1ea3ab]'>
          1 {sourceAsset.symbol} ≈ {quote.price} {targetAsset.symbol}
        </span>
        <span className='ml-auto text-base text-gray-400'>
          Valid for: {timer}s
        </span>
        <Button
          size='icon'
          variant='ghost'
          className='ml-2'
          onClick={onRefresh}
          disabled={loading}
        >
          <RefreshCw className='w-6 h-6 text-[#1ea3ab]' />
        </Button>
      </div>
      <div className='flex gap-4 mt-6'>
        <Button
          className='flex-1 bg-gray-200 hover:bg-gray-300 text-[#1ea3ab] font-bold shadow text-lg py-4 rounded-xl'
          onClick={onBack}
          disabled={loading}
        >
          Back
        </Button>
        <Button
          className='flex-1 bg-[#1ea3ab] hover:bg-[#1ea3ab]/90 text-white font-bold shadow-lg text-lg py-4 rounded-xl'
          onClick={onConfirm}
          disabled={timer === 0 || loading}
        >
          Confirm Exchange
        </Button>
      </div>
    </div>
  </div>
);
