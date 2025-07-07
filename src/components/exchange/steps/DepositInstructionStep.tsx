import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { renderAssetIconUnified } from '../AssetSelect';
import { OrderResponse } from '@/entities/types';

interface DepositInstructionStepProps {
  order: OrderResponse;
  onReturn: () => void;
  onDepositMade: () => void;
}

export const DepositInstructionStep: React.FC<DepositInstructionStepProps> = ({
  order,
  onReturn,
  onDepositMade,
}) => {
  const [timer, setTimer] = useState(order.exp_time || 1200);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const minutes = String(Math.floor(timer / 60)).padStart(2, '0');
  const seconds = String(timer % 60).padStart(2, '0');

  // Modern circular timer progress (SVG)
  const total = order.exp_time || 1200;
  const percent = Math.max(0, Math.min(1, timer / total));
  const radius = 40;
  const stroke = 6;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - percent * circumference;

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-3xl shadow-2xl p-10 flex flex-col gap-8 border-2 border-[#1ea3ab]/30 mt-6 mb-6 min-h-[480px] justify-center relative">
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl font-extrabold text-[#1ea3ab] tracking-tight">Deposit Instructions</span>
        <span className="relative flex flex-col items-center justify-center min-w-[100px]">
          <svg width={90} height={90} className="mb-1" style={{ display: 'block' }}>
            <circle
              cx={45}
              cy={45}
              r={normalizedRadius}
              fill="none"
              stroke="#e6f7f8"
              strokeWidth={stroke}
            />
            <circle
              cx={45}
              cy={45}
              r={normalizedRadius}
              fill="none"
              stroke="#1ea3ab"
              strokeWidth={stroke}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.5s linear' }}
            />
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="font-mono font-bold"
              fontSize="1.1rem"
              fill="#1ea3ab"
            >
              {minutes}:{seconds}
            </text>
          </svg>
          <span className="text-xs font-semibold text-[#1ea3ab] mt-2 tracking-widest">TIMER</span>
        </span>
      </div>
      <div className="rounded-2xl bg-[#f4f8fa] px-6 py-5 flex flex-col gap-3 border-2 border-[#1ea3ab]/10 shadow-inner">
        <div className="flex items-center gap-2 text-base">
          <span className="text-gray-500 font-medium">Asset:</span>
          <span className="flex items-center gap-2 font-semibold text-gray-800">
            {renderAssetIconUnified(order.asset, 24)} {order.asset?.name || order.asset?.symbol}
          </span>
        </div>
        <div className="flex items-center gap-2 text-base">
          <span className="text-gray-500 font-medium">Network:</span>
          <span className="font-semibold text-gray-800">{order.network}</span>
        </div>
        <div className="flex items-center gap-2 text-base">
          <span className="text-gray-500 font-medium">Amount:</span>
          <span className="font-semibold text-[#1ea3ab] font-mono text-lg">{order.amount?.toLocaleString(undefined, { maximumFractionDigits: 8 })} {order.asset?.symbol}</span>
        </div>
      </div>
      <div className="text-gray-500 text-sm mb-2 mt-2 text-center">
        Please deposit the <span className="font-semibold text-[#1ea3ab]">exact amount</span> to the address below. Incorrect amounts or assets may delay processing.
      </div>
      <div className="flex flex-col gap-1 items-start">
        <span className="font-semibold text-gray-700">Wallet Address:</span>
        <div className="flex items-center gap-2 w-full">
          <span className="font-mono text-base text-gray-800 break-all bg-[#f4f8fa] rounded-lg px-3 py-2 select-all flex-1 border border-[#1ea3ab]/10">{order.wallet_address}</span>
          <button
            type="button"
            className="ml-1 px-2 py-1 rounded-lg bg-[#e6f7f8] hover:bg-[#d0f3f6] border border-[#1ea3ab]/30 text-[#1ea3ab] text-xs font-semibold transition"
            onClick={() => {
              if (order.wallet_address) {
                navigator.clipboard.writeText(order.wallet_address);
              }
            }}
            title="Copy address"
          >
            Copy
          </button>
        </div>
      </div>
      <div className="flex gap-4 mt-6">
        <Button
          variant="outline"
          className="flex-1 border-gray-300 text-[#1ea3ab] bg-white hover:bg-[#e6f7f8] font-bold text-lg py-3 rounded-xl shadow"
          onClick={onReturn}
        >
          Return
        </Button>
        <Button
          className="flex-1 bg-[#1ea3ab] hover:bg-[#1ea3ab]/90 text-white font-bold shadow-lg text-lg py-3 rounded-xl"
          onClick={onDepositMade}
        >
          Deposit Made
        </Button>
      </div>
    </div>
  );
};
