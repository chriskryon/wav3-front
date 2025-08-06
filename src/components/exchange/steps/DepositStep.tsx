import { useEffect, useState } from "react";
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
    <div className="flex flex-col gap-4 h-full p-4 bg-white rounded-xl border border-gray-200 overflow-y-auto">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Deposit Instructions</h2>
        <p className="text-sm text-gray-600 mb-2">Complete your deposit to continue</p>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
          <span className="text-sm font-medium text-amber-700">
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Order Details</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Asset</span>
            <div className="flex items-center gap-1.5">
              <NetworkIcon symbol={data?.asset?.symbol} className="w-4 h-4" />
              <span className="font-medium text-gray-900 text-sm">{data?.asset?.name}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Network</span>
            <span className="font-medium text-gray-900 text-sm">{data?.network}</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-[#1ea3ab]/5 rounded border border-[#1ea3ab]/20">
            <span className="text-sm font-medium text-gray-600">Amount</span>
            <span className="font-bold text-[#1ea3ab] text-sm">{data?.amount}</span>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
        <p className="text-xs text-amber-700">
          Please ensure you deposit the correct amount to the specified address. Incorrect deposits may delay processing.
        </p>
      </div>

      <div className="bg-white rounded-lg p-3 border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Wallet Address</span>
          <button
            type="button"
            onClick={handleCopyAddress}
            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-600 hover:text-[#1ea3ab] hover:bg-gray-50 rounded transition-colors"
          >
            <ClipboardCopy className="w-3 h-3" />
            Copy
          </button>
        </div>
        <div className="bg-gray-50 rounded border border-gray-200 p-2 break-all">
          <span className="text-sm font-mono text-gray-900">{data?.wallet_address}</span>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors"
        >
          Return
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={loading}
          className="flex-1 px-3 py-2 text-sm font-medium text-white bg-[#1ea3ab] border border-[#1ea3ab] rounded-lg hover:bg-[#188a91] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Loading...' : 'Deposit Made'}
        </button>
      </div>
    </div>
  );
};
