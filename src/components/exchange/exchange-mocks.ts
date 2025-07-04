export const MOCK_ASSETS = [
  {
    id: 'fc7066e7-669e-4d5e-8f39-a93c4be4df64',
    name: 'Bitcoin',
    symbol: 'BTC',
    type: 'crypto',
    active: true,
    small_image_url:
      'https://storage.googleapis.com/cryptoassets_images/20px/BTC-20.png',
    medium_image_url:
      'https://storage.googleapis.com/cryptoassets_images/35px/BTC-35.png',
    large_image_url:
      'https://storage.googleapis.com/cryptoassets_images/69px/BTC-69.png',
    networks: [{ id: '7251cbcb-bb27-4ab1-8213-833205727103', name: 'bitcoin' }],
  },
  {
    id: '2f4b229f-3626-458a-9604-db3959d2cb7f',
    name: 'Ethereum',
    symbol: 'ETH',
    type: 'crypto',
    active: true,
    small_image_url:
      'https://storage.googleapis.com/cryptoassets_images/20px/ETH-20.png',
    medium_image_url:
      'https://storage.googleapis.com/cryptoassets_images/35px/ETH-35.png',
    large_image_url:
      'https://storage.googleapis.com/cryptoassets_images/69px/ETH-69.png',
    networks: [{ id: 'c9921534-4523-4e0c-9745-53228c1c90e4', name: 'erc-20' }],
  },
  {
    id: 'mxn',
    name: 'Peso Mexicano',
    symbol: 'MXN',
    type: 'fiat',
    active: true,
    small_image_url: 'https://flagcdn.com/20x15/mx.png',
    medium_image_url: 'https://flagcdn.com/32x24/mx.png',
    large_image_url: 'https://flagcdn.com/64x48/mx.png',
    networks: [],
  },
  {
    id: 'brl',
    name: 'Real Brasileiro',
    symbol: 'BRL',
    type: 'fiat',
    active: true,
    small_image_url: 'https://flagcdn.com/20x15/br.png',
    medium_image_url: 'https://flagcdn.com/32x24/br.png',
    large_image_url: 'https://flagcdn.com/64x48/br.png',
    networks: [],
  },
  {
    id: 'usd',
    name: 'US Dollar',
    symbol: 'USD',
    type: 'fiat',
    active: true,
    small_image_url: 'https://flagcdn.com/20x15/us.png',
    medium_image_url: 'https://flagcdn.com/32x24/us.png',
    large_image_url: 'https://flagcdn.com/64x48/us.png',
    networks: [],
  },
];

// Gera mocks de cotação para todos os pares FIAT <-> CRYPTO
const cryptos = ['BTC', 'ETH'];
const fiats = ['USD', 'BRL', 'MXN'];

export const MOCK_QUOTES: {
  [key: string]: {
    price: number;
    symbol: string;
    target_amount_estimate: number;
    source_amount: number;
    target_amount: number;
  };
} = {};

cryptos.forEach((crypto) => {
  fiats.forEach((fiat) => {
    // FIAT -> CRYPTO
    MOCK_QUOTES[`${fiat}_${crypto}`] = {
      price: Math.random() * (1 / (Math.random() * 0.0001 + 0.00001)),
      symbol: `${fiat}${crypto}`,
      target_amount_estimate: Math.random() * 0.01 + 0.001,
      source_amount: 1,
      target_amount: Math.random() * 0.01 + 0.001,
    };
    // CRYPTO -> FIAT
    MOCK_QUOTES[`${crypto}_${fiat}`] = {
      price: Math.random() * 100000 + 10000,
      symbol: `${crypto}${fiat}`,
      target_amount_estimate: Math.random() * 1000 + 100,
      source_amount: 1,
      target_amount: Math.random() * 1000 + 100,
    };
  });
});
