export const APP_CONFIG = {
  TITLE: 'CryptoPulse',
  LOGO_ICON: '⚡',
  FOOTER_TEXT: '© 2026 CryptoPulse • Real-time Binance Feed • Professional Dashboard',
  QUOTE_ASSET: 'USDT',
} as const;

export const MARKET_CONFIG = {
  DEFAULT_SYMBOLS: ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'ADAUSDT', 'XRPUSDT'],
  QUICK_START_SYMBOLS: ['BTC', 'ETH', 'SOL'],
  PRESETS: {
    L1s: ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'ADAUSDT', 'AVAXUSDT', 'NEARUSDT', 'DOTUSDT'],
    DeFi: ['UNIUSDT', 'AAVEUSDT', 'LINKUSDT', 'MKRUSDT', 'SNXUSDT', 'CRVUSDT'],
    AI: ['FETUSDT', 'RENDERUSDT', 'NEARUSDT', 'TAOUSDT', 'ARUSDT'],
  } as Record<string, string[]>,
  AVAILABLE_PRESET_KEYS: ['L1s', 'DeFi', 'AI'],
} as const;
