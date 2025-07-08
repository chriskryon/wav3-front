import React, { useEffect, useState } from "react";
import { useExchangeContext } from '@/context/ExchangeContext';
import { NetworkIcon } from '@/components/ui/network-icon';
import { ClipboardCopy } from 'lucide-react';
import { toast } from 'sonner';


interface DepositStepProps {
  data: any;
  onBack: () => void;
  onNext: () => void;
}

export const DepositStep: React.FC<DepositStepProps> = ({ data, onBack, onNext }) => {
  const { loading } = useExchangeContext();
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleCopyAddress = () => {
    if (data?.wallet_address) {
      navigator.clipboard.writeText(data.wallet_address);
      toast.success('Wallet address copied to clipboard!');
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full p-6 bg-white/70 rounded-3xl shadow-xl backdrop-blur-md overflow-y-auto">
      <div className="text-center">
        <h2 className="text-xl font-bold text-[#1ea3ab]">Deposit Instruction</h2>
        <p className="text-sm text-gray-500">Follow the instructions below to complete your deposit.</p>
        <p className="text-sm text-gray-500 mt-1">
          Time remaining: <span className="font-bold text-[#1ea3ab]">{formatTime(timeLeft)}</span>
        </p>
      </div>

      <div className="flex flex-col gap-3 p-3 rounded-lg shadow bg-wav3/10 border border-wav3/30">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-500">Cryptocurrency:</span>
          <div className="flex items-center gap-2">
            <NetworkIcon symbol={data?.asset?.symbol} className="w-6 h-6" />
            <span className="text-lg font-bold text-[#1ea3ab]">{data?.asset?.name}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-500">Network:</span>
          <span className="text-lg font-bold text-[#1ea3ab]">{data?.network}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-500">Amount:</span>
          <span className="text-lg font-bold text-[#1ea3ab]">{data?.amount}</span>
        </div>
      </div>

      <p className="text-sm text-gray-500 mt-3 text-center">
        Please make sure to deposit the right amount to the right address. Otherwise, your payment may take longer to be processed.
      </p>

      <div className="flex flex-col items-center mt-4">
        <div className="w-full max-w-md bg-white rounded-xl border border-gray-200 p-2 flex items-center gap-2">
          <NetworkIcon symbol={data?.asset?.symbol} className="w-6 h-6" />
          <span
            className="text-base font-mono font-semibold text-[#1ea3ab] break-all truncate flex-1 select-all"
            title={data?.wallet_address}
          >
            {data?.wallet_address}
          </span>
          <button
            type="button"
            onClick={handleCopyAddress}
            className="ml-2 p-2 rounded-full hover:bg-[#e6f7f8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1ea3ab] transition"
            aria-label="Copy wallet address"
          >
            <ClipboardCopy className="w-5 h-5 text-[#1ea3ab]" />
          </button>
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <button
          onClick={onBack}
          className="flex-1 bg-gray-200 text-[#1ea3ab] py-2 rounded-lg shadow hover:bg-gray-300"
        >
          Return
        </button>
        <button
          onClick={onNext}
          disabled={loading}
          className="flex-1 bg-[#1ea3ab] text-white py-2 rounded-lg shadow hover:bg-[#188a91]"
        >
          {loading ? 'Loading...' : 'Deposit Made'}
        </button>
      </div>
    </div>
  );
};
