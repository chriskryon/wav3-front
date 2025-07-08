
import { NetworkBitcoin, NetworkEthereum, NetworkTron, NetworkXrp, TokenBTC, TokenETH, TokenUSDC, TokenUSDT, TokenXRP } from '@web3icons/react';
import { US, CO, MX, BR, AR, EU } from 'country-flag-icons/react/3x2';

export const ICONS_CRYPTO_FIAT = {
    BTC: TokenBTC,
    ETH: TokenETH,
    XRP: TokenXRP,
    USDT: TokenUSDT,
    USDC: TokenUSDC,
    USD: US,
    COP: CO,
    MXN: MX,
    BRL: BR,
    EUR: EU,
    ARS: AR,
    'ERC-20': NetworkEthereum,
    BITCOIN: NetworkBitcoin,
    RIPPLE: NetworkXrp,
    TRON: NetworkTron,
};
