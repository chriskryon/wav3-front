import { TokenBTC, TokenETH, TokenXRP, TokenUSDT } from '@web3icons/react';
import React from 'react';

interface TokenIconProps {
  symbol: string;
  variant?: 'background' | 'branded' | 'mono';
  size?: number;
  color?: string;
  className?: string;
}

const iconMap: Record<string, React.ElementType> = {
  btc: TokenBTC,
  BTC: TokenBTC,
  eth: TokenETH,
  ETH: TokenETH,
  xrp: TokenXRP,
  XRP: TokenXRP,
  usdt: TokenUSDT,
  USDT: TokenUSDT,
};

export function TokenIcon({
  symbol,
  variant = 'background',
  size = 28,
  color = '#fff',
  className = '',
}: TokenIconProps) {
  const Icon = iconMap[symbol] || null;
  if (!Icon) return null;
  return (
    <Icon variant={variant} size={size} color={color} className={className} />
  );
}
