import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { renderAssetIconUnified } from '../AssetSelect';
import type { OrderResponse } from '@/entities/types';

interface DepositInstructionStepProps {
  order: OrderResponse;
  onReturn: () => void;
  onDepositMade: () => void;
  onBack: () => void;
  onNext: (data?: any) => void;
}

export const DepositInstructionStep: React.FC<DepositInstructionStepProps> = ({
  order,
  onReturn,
  onDepositMade,
  onBack,
  onNext,
}) => {
  const [timer, setTimer] = useState(order.exp_time || 1200);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const minutes = String(Math.floor(timer / 60)).padStart(2, '0');
  const seconds = String(timer % 60).padStart(2, '0');

  const handleNext = () => {
    const depositData = { /* Simulated deposit data */ };
    onNext(depositData);
  };

  return (
    <div className="flex flex-col gap-4 h-full p-4 bg-white rounded-xl border border-gray-200 overflow-y-auto">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Deposit Instructions</h2>
        <p className="text-sm text-gray-600 mb-3">Send the exact amount to complete your exchange</p>
        
        {/* Timer */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
          <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <title>Timer</title>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium text-amber-700">
            {minutes}:{seconds}
          </span>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Order Summary</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Asset</span>
            <div className="flex items-center gap-1.5">
              {renderAssetIconUnified(order.asset, 16)}
              <span className="font-medium text-gray-900 text-sm">{order.asset?.symbol}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Network</span>
            <span className="font-medium text-gray-900 text-sm">{order.network}</span>
          </div>
          
          <div className="flex items-center justify-between p-2 bg-[#1ea3ab]/5 rounded border border-[#1ea3ab]/20">
            <span className="text-sm font-medium text-gray-600">Amount</span>
            <div className="text-right">
              <div className="font-bold text-[#1ea3ab] font-mono text-sm">
                {order.amount?.toLocaleString(undefined, { maximumFractionDigits: 8 })}
              </div>
              <div className="text-xs text-gray-500">{order.asset?.symbol}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Deposit Address */}
      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Deposit Address</h3>
        
        <div className="bg-amber-50 border border-amber-200 rounded p-2 mb-3">
          <div className="flex items-start gap-1.5">
            <svg className="w-3.5 h-3.5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <title>Warning</title>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-xs text-amber-700">
              Send only <strong>{order.asset?.symbol}</strong> to this address
            </p>
          </div>
        </div>

        <div className="flex items-center bg-white border border-gray-200 rounded overflow-hidden">
          <code className="flex-1 text-xs font-mono px-2 py-2 text-gray-700 break-all">
            {order.wallet_address}
          </code>
          <button
            type="button"
            onClick={() => {
              if (order.wallet_address) {
                navigator.clipboard.writeText(order.wallet_address);
              }
            }}
            className="px-2 py-2 text-gray-400 hover:text-[#1ea3ab] hover:bg-gray-50 border-l border-gray-200 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <title>Copy</title>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 mt-auto pt-3">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onReturn}
            className="flex-1 h-9 text-sm bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Return
          </Button>
          <Button
            onClick={onDepositMade}
            className="flex-1 h-9 text-sm bg-green-600 hover:bg-green-700 text-white"
          >
            Deposit Made
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex-1 h-9 text-sm bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            className="flex-1 h-9 text-sm bg-[#1ea3ab] hover:bg-[#188a91] text-white"
          >
            Next Step
          </Button>
        </div>
      </div>
    </div>
  );
};
