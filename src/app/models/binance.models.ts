import { z } from 'zod';

// WebSocket Ticker Message Schema (Binance !ticker@arr)
export const TickerWebSocketMessageSchema = z.object({
  e: z.string() /* Event type */,
  E: z.number() /* Event time */,
  s: z.string() /* Symbol */,
  p: z.string() /* Price change */,
  P: z.string() /* Price change percent */,
  w: z.string() /* Weighted average price */,
  x: z.string() /* First price */,
  c: z.string() /* Last price */,
  Q: z.string() /* Last quantity */,
  b: z.string() /* Best bid price */,
  B: z.string() /* Best bid quantity */,
  a: z.string() /* Best ask price */,
  A: z.string() /* Best ask quantity */,
  o: z.string() /* Open price */,
  h: z.string() /* High price */,
  l: z.string() /* Low price */,
  v: z.string() /* Total traded base asset volume */,
  q: z.string() /* Total traded quote asset volume */,
  O: z.number() /* Statistics open time */,
  C: z.number() /* Statistics close time */,
  F: z.number() /* First trade ID */,
  L: z.number() /* Last trade ID */,
  n: z.number() /* Total number of trades */,
});

export type TickerWebSocketMessage = z.infer<typeof TickerWebSocketMessageSchema>;

// REST API Ticker Schema
export const RestTickerSchema = z.object({
  symbol: z.string(),
  lastPrice: z.string(),
  priceChangePercent: z.string(),
  volume: z.string(),
  highPrice: z.string(),
  lowPrice: z.string(),
});

export type RestTicker = z.infer<typeof RestTickerSchema>;

// Exchange Info Schema
export const ExchangeInfoSchema = z.object({
  symbols: z.array(
    z.object({
      symbol: z.string(),
      status: z.string(),
      quoteAsset: z.string(),
    }),
  ),
});

export type ExchangeInfo = z.infer<typeof ExchangeInfoSchema>;

// Internal UI Data
export interface TickerData {
  symbol: string;
  price: number;
  priceChangePercent: number;
  volume: number;
  high: number;
  low: number;
  lastUpdated: number;
  direction: 'up' | 'down' | 'neutral';
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface DashboardModel {
  selectedSymbols: string[];
}

export type Theme = 'light' | 'dark';

// Klines (Candlesticks)
export const KlineSocketMessageSchema = z.object({
  e: z.string(),
  E: z.number(),
  s: z.string(),
  k: z.object({
    t: z.number(), // Start time
    T: z.number(), // End time
    s: z.string(), // Symbol
    i: z.string(), // Interval
    o: z.string(), // Open
    c: z.string(), // Close
    h: z.string(), // High
    l: z.string(), // Low
    v: z.string(), // Volume
    x: z.boolean(), // Is closed
  }),
});

export type KlineSocketMessage = z.infer<typeof KlineSocketMessageSchema>;

export const TradeWebSocketMessageSchema = z.object({
  e: z.literal('trade'),
  E: z.number(),
  s: z.string(),
  t: z.number(),
  p: z.string(),
  q: z.string(),
  T: z.number(),
  m: z.boolean(),
});

export type TradeWebSocketMessage = z.infer<typeof TradeWebSocketMessageSchema>;

export interface CandlestickData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  value?: number; // Volume
}

// Order Book (Depth)
export const OrderBookSchema = z.object({
  lastUpdateId: z.number().optional(),
  bids: z.array(z.array(z.string())), // [price, quantity]
  asks: z.array(z.array(z.string())), // [price, quantity]
});

export type OrderBook = z.infer<typeof OrderBookSchema>;

export interface OrderBookLevel {
  price: number;
  quantity: number;
  total?: number;
}

export interface RecentTrade {
  id: number;
  price: number;
  quantity: number;
  time: number;
  isBuyerMaker: boolean;
}

export interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  condition: 'above' | 'below';
  createdAt: number;
  active: boolean;
}

export interface PortfolioHolding {
  symbol: string;
  amount: number;
  avgPrice: number;
}
