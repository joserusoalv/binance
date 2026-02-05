import { computed, inject, Injectable, signal } from '@angular/core';
import { PortfolioHolding } from '../models/binance.models';
import { BinanceService } from './binance.service';

@Injectable({
  providedIn: 'root',
})
export class PortfolioService {
  private binanceService = inject(BinanceService);
  private readonly STORAGE_KEY = 'binance_portfolio';

  // State
  private holdingsSignal = signal<PortfolioHolding[]>([]);
  readonly holdings = this.holdingsSignal.asReadonly();

  // Derived Summary
  readonly totalValue = computed(() => {
    const tickers = this.binanceService.tickers();
    return this.holdingsSignal().reduce((acc, h) => {
      const ticker = tickers.find((t) => t.symbol === h.symbol);
      const currentPrice = ticker?.price || h.avgPrice;
      return acc + h.amount * currentPrice;
    }, 0);
  });

  readonly totalCost = computed(() => {
    return this.holdingsSignal().reduce((acc, h) => acc + h.amount * h.avgPrice, 0);
  });

  readonly totalPnL = computed(() => this.totalValue() - this.totalCost());
  readonly totalPnLPercent = computed(() => {
    const cost = this.totalCost();
    return cost === 0 ? 0 : (this.totalPnL() / cost) * 100;
  });

  readonly hasHoldings = computed(() => this.holdingsSignal().length > 0);

  readonly bestPerformer = computed((): { symbol: string; pnlPercent: number } | null => {
    const tickers = this.binanceService.tickers();
    const holdings = this.holdingsSignal();
    if (holdings.length === 0) return null;

    let best: { symbol: string; pnlPercent: number } | null = null;
    holdings.forEach((h) => {
      const ticker = tickers.find((t) => t.symbol === h.symbol);
      const currentPrice = ticker?.price || h.avgPrice;
      const pnlPercent = ((currentPrice - h.avgPrice) / h.avgPrice) * 100;
      if (!best || pnlPercent > best.pnlPercent) {
        best = { symbol: h.symbol, pnlPercent };
      }
    });
    return best;
  });

  readonly worstPerformer = computed((): { symbol: string; pnlPercent: number } | null => {
    const tickers = this.binanceService.tickers();
    const holdings = this.holdingsSignal();
    if (holdings.length === 0) return null;

    let worst: { symbol: string; pnlPercent: number } | null = null;
    holdings.forEach((h) => {
      const ticker = tickers.find((t) => t.symbol === h.symbol);
      const currentPrice = ticker?.price || h.avgPrice;
      const pnlPercent = ((currentPrice - h.avgPrice) / h.avgPrice) * 100;
      if (!worst || pnlPercent < worst.pnlPercent) {
        worst = { symbol: h.symbol, pnlPercent };
      }
    });
    return worst;
  });

  constructor() {
    this.loadHoldings();
  }

  getHolding(symbol: string) {
    return computed(() => this.holdingsSignal().find((h) => h.symbol === symbol));
  }

  updatePosition(symbol: string, amount: number, price: number) {
    this.holdingsSignal.update((current) => {
      const existing = current.find((h) => h.symbol === symbol);
      if (existing) {
        if (amount <= 0) {
          return current.filter((h) => h.symbol !== symbol);
        }
        // Calculate new average price (simplified simulation)
        const totalAmount = existing.amount + amount;
        const totalCost = existing.amount * existing.avgPrice + amount * price;
        return current.map((h) =>
          h.symbol === symbol
            ? { ...h, amount: totalAmount, avgPrice: totalCost / totalAmount }
            : h,
        );
      } else if (amount > 0) {
        return [...current, { symbol, amount, avgPrice: price }];
      }
      return current;
    });
    this.saveHoldings();
  }

  setAbsolutePosition(symbol: string, amount: number, price: number) {
    this.holdingsSignal.update((current) => {
      const filtered = current.filter((h) => h.symbol !== symbol);
      if (amount <= 0) return filtered;
      return [...filtered, { symbol, amount, avgPrice: price }];
    });
    this.saveHoldings();
  }

  removePosition(symbol: string) {
    this.holdingsSignal.update((current) => current.filter((h) => h.symbol !== symbol));
    this.saveHoldings();
  }

  private loadHoldings() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        this.holdingsSignal.set(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load portfolio', e);
      }
    }
  }

  private saveHoldings() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.holdingsSignal()));
  }
}
