import type React from 'react';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { TokenIcon } from '@/components/ui/token-icon';
import { US, CO, MX, BR, AR, EU } from 'country-flag-icons/react/3x2';

// Custom icon for USDC, USFRIF, USDRIF (replace with your SVG or component as needed)
const CustomUsdcUsfrifIcon = ({ size = 32 }: { size?: number }) => (
  <span
    className={size === 32 ? "w-8 h-8 rounded-full bg-white border border-[#00109b] flex items-center justify-center" : "w-5 h-5 rounded-full bg-white border border-[#00109b] flex items-center justify-center"}
    style={{ width: size, height: size }}
  >
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <title>Asset Selection</title>
      <circle cx="12" cy="12" r="12" fill="#00109b"/>
      <text x="12" y="16" textAnchor="middle" fontSize={size === 32 ? 10 : 8} fill="white" fontWeight="bold">USDC</text>
    </svg>
  </span>
);

interface Asset {
  symbol: string;
  name: string;
  type: string;
}

interface AssetSelectProps {
  value: string;
  onChange: (symbol: string) => void;
  assets: Asset[];
  excludeSymbol?: string;
  className?: string;
}

export const AssetSelect: React.FC<AssetSelectProps> = ({
  value,
  onChange,
  assets,
  excludeSymbol,
  className = '',
}) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className={`w-full h-12 rounded-xl flex items-center justify-start border-2 border-[#00109b]/40 bg-[#f6fcfd] shadow hover:bg-[#e6f7f8] px-4 ${className}`}>
      <div className='flex flex-row items-center gap-3 w-full'>
        {renderAssetIcon(assets.find(a => a.symbol === value))}
        <span className='text-base font-semibold text-[#00109b]'>
          {assets.find(a => a.symbol === value)?.name} ({value})
        </span>
      </div>
    </SelectTrigger>
    <SelectContent className='max-h-64 overflow-y-auto bg-[#f6fcfd]/60 backdrop-blur-sm bg-opacity-90 rounded-xl shadow-lg border border-[#00109b]/20'>
      {assets.filter(a => !excludeSymbol || a.symbol !== excludeSymbol).map((asset) => (
        <SelectItem
          key={asset.symbol}
          value={asset.symbol}
          className='flex items-center gap-2 py-1 px-2 rounded-lg transition-colors hover:bg-[#58b3b8] focus:bg-[#e6f7f8] cursor-pointer min-h-[36px]'
        >
          <span className='flex flex-row items-center gap-2'>
            {renderAssetIconSmall(asset)}
            <span className='text-sm font-medium text-[#00109b] truncate'>
              {asset.name} ({asset.symbol})
            </span>
          </span>
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);


export function renderAssetIconUnified(asset?: Asset, size: number = 32) {
  if (!asset) {
    return (
      <span
        className={size >= 32 ? "w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-lg" : "w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs"}
        style={{ width: size, height: size }}
      >
        ?
      </span>
    );
  }
  // USDC, USFRIF, USDRIF always use the custom icon
  if (asset.symbol === 'USDC' || asset.symbol === 'USFRIF' || asset.symbol === 'USDRIF') {
    return <CustomUsdcUsfrifIcon size={size} />;
  }
  if (asset.type === 'crypto') {
    try {
      return <TokenIcon symbol={asset.symbol} size={size} color={asset.symbol === 'ETH' ? '#00109b' : undefined} />;
    } catch {
      return (
        <span
          className={size >= 32 ? "w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-lg" : "w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs"}
          style={{ width: size, height: size }}
        >
          ?
        </span>
      );
    }
  }
  // Dynamically set width/height for country flags
  const flagStyle = { width: size, height: size, borderRadius: '9999px' };
  const flagIcons: Record<string, React.ReactNode> = {
    USD: <US title='United States' style={flagStyle} />,
    EUR: <EU title='Eurozone' style={flagStyle} />,
    BRL: <BR title='Brazil' style={flagStyle} />,
    MXN: <MX title='Mexico' style={flagStyle} />,
    COP: <CO title='Colombia' style={flagStyle} />,
    ARS: <AR title='Argentina' style={flagStyle} />,
  };
  if (flagIcons[asset.symbol]) return flagIcons[asset.symbol];
  // Default icon for unknown asset
  return (
    <span
      className={size >= 32 ? "w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-lg" : "w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs"}
      style={{ width: size, height: size }}
    >
      ?
    </span>
  );
}

// Wrappers for usage
export function renderAssetIcon(asset?: Asset) {
  return renderAssetIconUnified(asset, 32);
}

export function renderAssetIconSmall(asset?: Asset) {
  return renderAssetIconUnified(asset, 22);
}
