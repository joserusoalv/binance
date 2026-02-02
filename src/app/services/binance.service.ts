import { HttpClient } from '@angular/common/http';
import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { z } from 'zod';
import { APP_CONFIG, MARKET_CONFIG } from '../constants/app.constants';
import {
  CandlestickData,
  ExchangeInfo,
  ExchangeInfoSchema,
  KlineSocketMessageSchema,
  OrderBookLevel,
  OrderBookSchema,
  RecentTrade,
  RestTicker,
  RestTickerSchema,
  TickerData,
  TickerWebSocketMessage,
  TickerWebSocketMessageSchema,
  TradeWebSocketMessageSchema,
} from '../models/binance.models';
import { WINDOW } from '../tokens/window.token';

@Injectable({
  providedIn: 'root',
})
export class BinanceService {
  private http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private window = inject(WINDOW);
  private socket: WebSocket | null = null;

  private readonly REST_API_URL = 'https://api1.binance.com/api/v3/ticker/24hr';
  private readonly EXCHANGE_INFO_URL = 'https://api1.binance.com/api/v3/exchangeInfo';
  private readonly KLINES_URL = 'https://api1.binance.com/api/v3/klines';
  private readonly DEPTH_URL = 'https://api1.binance.com/api/v3/depth';
  private readonly TRADES_URL = 'https://api1.binance.com/api/v3/trades';
  private readonly WS_URL = 'wss://stream.binance.com:9443/ws/!ticker@arr';
  private readonly STREAM_BASE_URL = 'wss://stream.binance.com:9443/ws';

  // State
  private allTickersMap = signal<Map<string, TickerData>>(new Map());
  readonly availableSymbols = signal<string[]>([]);
  readonly selectedSymbols = signal<string[]>([...MARKET_CONFIG.DEFAULT_SYMBOLS]);
  readonly isLoading = signal(true);

  // Derived signals
  readonly tickers = computed(() => {
    const selected = this.selectedSymbols();
    const all = this.allTickersMap();
    return selected.map((s) => all.get(s)).filter((t): t is TickerData => !!t);
  });

  readonly btcTicker = computed(() => this.allTickersMap().get('BTCUSDT'));

  constructor() {
    this.fetchAvailableSymbols();
    this.initialize();
  }

  resetToDefaults() {
    this.selectedSymbols.set([...MARKET_CONFIG.DEFAULT_SYMBOLS]);
  }

  private fetchAvailableSymbols() {
    this.http
      .get<unknown>(this.EXCHANGE_INFO_URL)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map((data) => {
          try {
            return ExchangeInfoSchema.parse(data);
          } catch (e) {
            console.error('ExchangeInfo validation failed:', e);
            return { symbols: [] } as ExchangeInfo;
          }
        }),
      )
      .subscribe((data) => {
        const symbols = data.symbols
          .filter((s) => s.status === 'TRADING' && s.quoteAsset === APP_CONFIG.QUOTE_ASSET)
          .map((s) => s.symbol)
          .sort();
        this.availableSymbols.set(symbols);
      });
  }

  private initialize() {
    this.http
      .get<unknown[]>(this.REST_API_URL)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map((data) => {
          try {
            return z.array(RestTickerSchema).parse(data);
          } catch (e) {
            console.error('RestTicker validation failed:', e);
            return [] as RestTicker[];
          }
        }),
      )
      .subscribe((data) => {
        const initialMap = new Map<string, TickerData>();

        for (const item of data) {
          if (item.symbol.endsWith(APP_CONFIG.QUOTE_ASSET)) {
            initialMap.set(item.symbol, {
              symbol: item.symbol,
              price: parseFloat(item.lastPrice),
              priceChangePercent: parseFloat(item.priceChangePercent),
              volume: parseFloat(item.volume),
              high: parseFloat(item.highPrice),
              low: parseFloat(item.lowPrice),
              lastUpdated: Date.now(),
              direction: 'neutral',
            });
          }
        }

        this.allTickersMap.set(initialMap);
        this.isLoading.set(false);
        this.connectWebSocket();
      });
  }

  private connectWebSocket() {
    if (this.socket) {
      this.socket.close();
    }

    if (this.window.WebSocket) {
      this.socket = new this.window.WebSocket(this.WS_URL);

      this.socket.onmessage = (event: MessageEvent) => {
        try {
          const rawData = JSON.parse(event.data);
          const messages = z.array(TickerWebSocketMessageSchema).parse(rawData);
          this.updateTickers(messages);
        } catch (e) {
          console.error('WebSocket Ticker validation failed:', e);
        }
      };

      this.socket.onerror = (error) => console.error('WebSocket Error:', error);
    }
  }

  private updateTickers(messages: TickerWebSocketMessage[]) {
    this.allTickersMap.update((currentMap) => {
      const newMap = new Map(currentMap);
      let hasChanges = false;

      for (const msg of messages) {
        if (!msg.s.endsWith(APP_CONFIG.QUOTE_ASSET)) continue;

        const current = newMap.get(msg.s);
        const newPrice = parseFloat(msg.c);

        let direction: 'up' | 'down' | 'neutral' = 'neutral';
        if (current) {
          if (newPrice > current.price) direction = 'up';
          else if (newPrice < current.price) direction = 'down';
        }

        newMap.set(msg.s, {
          symbol: msg.s,
          price: newPrice,
          priceChangePercent: parseFloat(msg.P),
          volume: parseFloat(msg.q),
          high: parseFloat(msg.h),
          low: parseFloat(msg.l),
          lastUpdated: Date.now(),
          direction,
        });
        hasChanges = true;
      }

      return hasChanges ? newMap : currentMap;
    });
  }

  updateSelectedSymbols(symbols: string[]) {
    this.selectedSymbols.set([...symbols]);
  }

  // Kline (Chart) Data
  getKlines(symbol: string, interval: string = '1h', limit: number = 100) {
    const params = { symbol, interval, limit: limit.toString() };
    return this.http.get<any[][]>(this.KLINES_URL, { params }).pipe(
      map((data) =>
        data.map((k) => ({
          time: k[0] / 1000, // Lightweight Charts uses seconds
          open: parseFloat(k[1]),
          high: parseFloat(k[2]),
          low: parseFloat(k[3]),
          close: parseFloat(k[4]),
          value: parseFloat(k[5]), // Volume
        })),
      ),
    );
  }

  getKlineStream(symbol: string, interval: string = '1h') {
    const ws = new this.window.WebSocket(
      `${this.STREAM_BASE_URL}/${symbol.toLowerCase()}@kline_${interval}`,
    );
    return new Observable<CandlestickData>((subscriber) => {
      ws.onmessage = (event) => {
        try {
          const msg = KlineSocketMessageSchema.parse(JSON.parse(event.data));
          subscriber.next({
            time: msg.k.t / 1000,
            open: parseFloat(msg.k.o),
            high: parseFloat(msg.k.h),
            low: parseFloat(msg.k.l),
            close: parseFloat(msg.k.c),
            value: parseFloat(msg.k.v),
          });
        } catch (e) {
          console.error('Kline WS parse error', e);
        }
      };
      ws.onerror = (e) => subscriber.error(e);
      return () => ws.close();
    });
  }

  // Order Book (Depth) Data
  getOrderBook(symbol: string, limit: number = 20) {
    const params = { symbol, limit: limit.toString() };
    return this.http.get<unknown>(this.DEPTH_URL, { params }).pipe(
      map((data) => {
        const parsed = OrderBookSchema.parse(data);
        return {
          bids: this.processDepthLevels(parsed.bids),
          asks: this.processDepthLevels(parsed.asks),
        };
      }),
    );
  }

  getOrderBookStream(symbol: string, limit: number = 20) {
    const ws = new this.window.WebSocket(
      `${this.STREAM_BASE_URL}/${symbol.toLowerCase()}@depth${limit}@100ms`,
    );
    return new Observable<{ bids: OrderBookLevel[]; asks: OrderBookLevel[] }>((subscriber) => {
      ws.onmessage = (event) => {
        try {
          const parsed = OrderBookSchema.parse(JSON.parse(event.data));
          subscriber.next({
            bids: this.processDepthLevels(parsed.bids),
            asks: this.processDepthLevels(parsed.asks),
          });
        } catch (e) {
          console.error('Depth WS parse error', e);
        }
      };
      ws.onerror = (e) => subscriber.error(e);
      return () => ws.close();
    });
  }

  private processDepthLevels(levels: string[][]): OrderBookLevel[] {
    let total = 0;
    return levels.map(([price, quantity]) => {
      const p = parseFloat(price);
      const q = parseFloat(quantity);
      total += q;
      return { price: p, quantity: q, total };
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  getRecentTrades(symbol: string, limit: number = 20): Observable<RecentTrade[]> {
    const params = { symbol, limit: limit.toString() };
    return this.http.get<any[]>(this.TRADES_URL, { params }).pipe(
      map((trades) =>
        trades.map((t) => ({
          id: t.id,
          price: parseFloat(t.price),
          quantity: parseFloat(t.qty),
          time: t.time,
          isBuyerMaker: t.isBuyerMaker,
        })),
      ),
    );
  }

  getTradeStream(symbol: string): Observable<RecentTrade> {
    const ws = new this.window.WebSocket(`${this.STREAM_BASE_URL}/${symbol.toLowerCase()}@trade`);
    return new Observable<RecentTrade>((subscriber) => {
      ws.onmessage = (event) => {
        try {
          const msg = TradeWebSocketMessageSchema.parse(JSON.parse(event.data));
          subscriber.next({
            id: msg.t,
            price: parseFloat(msg.p),
            quantity: parseFloat(msg.q),
            time: msg.T,
            isBuyerMaker: msg.m,
          });
        } catch (e) {
          console.error('Trade WS parse error', e);
        }
      };
      ws.onerror = (e) => subscriber.error(e);
      return () => ws.close();
    });
  }
}
