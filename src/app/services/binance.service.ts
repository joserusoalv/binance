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
  private readonly WS_URL = 'wss://stream.binance.com:9443/ws/!ticker@arr';

  // State
  private tickersSignal = signal<Map<string, TickerData>>(new Map());

  // Derived signals
  readonly tickers = computed(() => Array.from(this.tickersSignal().values()));
  readonly btcTicker = computed(() => this.tickersSignal().get('BTCUSDT'));

  constructor() {
    this.initialize();
  }

  private initialize() {
    // Definimos los pares que nos interesan
    const majorPairs = new Set(['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'ADAUSDT', 'XRPUSDT', 'DOTUSDT', 'DOGEUSDT', 'MATICUSDT', 'AVAXUSDT']);

    // Initial load from REST API
    // Usamos takeUntilDestroyed para asegurar limpieza si el servicio se destruye
    this.http.get<any[]>(this.REST_API_URL)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => {
        const initialMap = new Map<string, TickerData>();
        
        for (const item of data) {
          if (majorPairs.has(item.symbol)) {
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
        
        this.tickersSignal.set(initialMap);
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
      // Reintento solo si no hemos destruido el servicio
      console.log('WebSocket connection closed.');
    };
  }

  private updateTickers(messages: TickerWebSocketMessage[]) {
    this.tickersSignal.update(currentMap => {
      // Evitamos crear un nuevo mapa si no hay cambios relevantes, 
      // aunque para Signals, mutation directa del mapa no dispararía el cambio,
      // por eso creamos una copia superficial.
      const newMap = new Map(currentMap);
      let hasChanges = false;
      
      for (const msg of messages) {
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
        }
      }
      
      return hasChanges ? newMap : currentMap;
    });
  }

  /**
   * Permite cerrar la conexión manualmente si fuera necesario
   */
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
