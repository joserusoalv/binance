import { Injectable, signal, computed, inject, OnDestroy, DestroyRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TickerData, TickerWebSocketMessage } from '../models/binance.models';

@Injectable({
  providedIn: 'root'
})
export class BinanceService implements OnDestroy {
  private http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private socket: WebSocket | null = null;
  private readonly REST_API_URL = 'https://api1.binance.com/api/v3/ticker/24hr';
  private readonly EXCHANGE_INFO_URL = 'https://api1.binance.com/api/v3/exchangeInfo';
  private readonly WS_URL = 'wss://stream.binance.com:9443/ws/!ticker@arr';

  // State
  private allTickersMap = signal<Map<string, TickerData>>(new Map());
  readonly availableSymbols = signal<string[]>([]);
  readonly selectedSymbols = signal<string[]>(['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'ADAUSDT', 'XRPUSDT']);
  readonly isLoading = signal(true);

  readonly DEFAULT_SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'ADAUSDT', 'XRPUSDT'];

  resetToDefaults() {
    this.selectedSymbols.set([...this.DEFAULT_SYMBOLS]);
  }

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

  private fetchAvailableSymbols() {
    this.http.get<any>(this.EXCHANGE_INFO_URL)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => {
        const symbols = data.symbols
          .filter((s: any) => s.status === 'TRADING' && s.quoteAsset === 'USDT')
          .map((s: any) => s.symbol)
          .sort();
        this.availableSymbols.set(symbols);
      });
  }

  private initialize() {
    // Initial load from REST API
    this.http.get<any[]>(this.REST_API_URL)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => {
        const initialMap = new Map<string, TickerData>();
        
        for (const item of data) {
          if (item.symbol.endsWith('USDT')) {
            initialMap.set(item.symbol, {
              symbol: item.symbol,
              price: parseFloat(item.lastPrice),
              priceChangePercent: parseFloat(item.priceChangePercent),
              volume: parseFloat(item.volume),
              high: parseFloat(item.highPrice),
              low: parseFloat(item.lowPrice),
              lastUpdated: Date.now()
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

    this.socket = new WebSocket(this.WS_URL);

    this.socket.onmessage = (event) => {
      const messages: TickerWebSocketMessage[] = JSON.parse(event.data);
      this.updateTickers(messages);
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    this.socket.onclose = () => {
      console.log('WebSocket connection closed.');
    };
  }

  private updateTickers(messages: TickerWebSocketMessage[]) {
    this.allTickersMap.update(currentMap => {
      const newMap = new Map(currentMap);
      let hasChanges = false;
      
      for (const msg of messages) {
        // We update all tickers in the map, regardless of whether they are selected,
        // so that if the user selects them later, they have fresh data.
        if (newMap.has(msg.s)) {
          const current = newMap.get(msg.s)!;
          const newPrice = parseFloat(msg.c);
          
          let direction: 'up' | 'down' | 'neutral' = 'neutral';
          if (newPrice > current.price) direction = 'up';
          else if (newPrice < current.price) direction = 'down';

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
        } else if (msg.s.endsWith('USDT')) {
            // If it's a new USDT pair we haven't seen in the initial REST call
            newMap.set(msg.s, {
                symbol: msg.s,
                price: parseFloat(msg.c),
                priceChangePercent: parseFloat(msg.P),
                volume: parseFloat(msg.q),
                high: parseFloat(msg.h),
                low: parseFloat(msg.l),
                lastUpdated: Date.now(),
                direction: 'neutral'
            });
            hasChanges = true;
        }
      }
      
      return hasChanges ? newMap : currentMap;
    });
  }

  updateSelectedSymbols(symbols: string[]) {
    this.selectedSymbols.set(symbols);
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  ngOnDestroy() {
    this.disconnect();
  }
}
