import React from 'react';
import { ICONS_CRYPTO_FIAT } from '@/lib/assetIcons';
import { CircleDollarSign } from 'lucide-react';

interface NetworkIconProps {
  symbol: keyof typeof ICONS_CRYPTO_FIAT;
  className?: string;
}

export const NetworkIcon: React.FC<NetworkIconProps> = ({ symbol, className }) => {
  const IconComponent = ICONS_CRYPTO_FIAT[symbol] || null;

  return IconComponent ? (
    <IconComponent className={className} />
  ) : (
    <CircleDollarSign className={className} />
  );
};

export default NetworkIcon;