import { Injectable, signal, computed, inject, DestroyRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { 
  TickerData, 
  TickerWebSocketMessageSchema, 
  RestTickerSchema, 
  ExchangeInfoSchema,
  TickerWebSocketMessage,
  RestTicker,
  ExchangeInfo
} from '../models/binance.models';
import { MARKET_CONFIG, APP_CONFIG } from '../constants/app.constants';
import { WINDOW } from '../tokens/window.token';
import { map } from 'rxjs/operators';
import { z } from 'zod';

@Injectable({
  providedIn: 'root'
})
export class BinanceService {
  private http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private window = inject(WINDOW);
  private socket: WebSocket | null = null;
  
  private readonly REST_API_URL = 'https://api1.binance.com/api/v3/ticker/24hr';
  private readonly EXCHANGE_INFO_URL = 'https://api1.binance.com/api/v3/exchangeInfo';
  private readonly WS_URL = 'wss://stream.binance.com:9443/ws/!ticker@arr';

  // State
  private allTickersMap = signal<Map<string, TickerData>>(new Map());
  readonly availableSymbols = signal<string[]>([]);
  readonly selectedSymbols = signal<string[]>([...MARKET_CONFIG.DEFAULT_SYMBOLS]);
  readonly isLoading = signal(true);

  // Derived signals
  readonly tickers = computed(() => {
    const selected = this.selectedSymbols();
    const all = this.allTickersMap();
    return selected.map(s => all.get(s)).filter((t): t is TickerData => !!t);
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
    this.http.get<unknown>(this.EXCHANGE_INFO_URL)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map(data => {
          try {
            return ExchangeInfoSchema.parse(data);
          } catch (e) {
            console.error('ExchangeInfo validation failed:', e);
            return { symbols: [] } as ExchangeInfo;
          }
        })
      )
      .subscribe(data => {
        const symbols = data.symbols
          .filter(s => s.status === 'TRADING' && s.quoteAsset === APP_CONFIG.QUOTE_ASSET)
          .map(s => s.symbol)
          .sort();
        this.availableSymbols.set(symbols);
      });
  }

  private initialize() {
    this.http.get<unknown[]>(this.REST_API_URL)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map(data => {
          try {
            return z.array(RestTickerSchema).parse(data);
          } catch (e) {
            console.error('RestTicker validation failed:', e);
            return [] as RestTicker[];
          }
        })
      )
      .subscribe(data => {
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
              direction: 'neutral'
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
    this.allTickersMap.update(currentMap => {
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
          direction
        });
        hasChanges = true;
      }
      
      return hasChanges ? newMap : currentMap;
    });
  }

  updateSelectedSymbols(symbols: string[]) {
    this.selectedSymbols.set([...symbols]);
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}
