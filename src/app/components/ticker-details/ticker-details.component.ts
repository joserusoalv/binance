import { CommonModule, DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {
  CandlestickSeries,
  createChart,
  IChartApi,
  ISeriesApi,
  LineSeries,
} from 'lightweight-charts';
import { Subject, takeUntil } from 'rxjs';
import { CandlestickData, OrderBookLevel, RecentTrade } from '../../models/binance.models';
import { AlertService } from '../../services/alert.service';
import { BinanceService } from '../../services/binance.service';
import { PortfolioService } from '../../services/portfolio.service';
import { calculateSMA } from '../../utils/indicators.utils';

@Component({
  selector: 'app-ticker-details',
  imports: [
    CommonModule,
    DecimalPipe,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
  ],
  template: `
    <div class="details-container">
      <header class="details-header">
        <div class="title-info">
          <h2>{{ data.symbol }}</h2>
          <span
            class="current-price"
            [class.up]="ticker()?.direction === 'up'"
            [class.down]="ticker()?.direction === 'down'"
          >
            $ {{ ticker()?.price | number: '1.2-6' }}
          </span>
        </div>
        <div class="header-actions">
          <div class="indicator-selectors">
            <button
              [class.active]="showSMA7()"
              (click)="toggleIndicator('SMA7')"
              class="indicator-btn"
            >
              SMA 7
            </button>
            <button
              [class.active]="showSMA25()"
              (click)="toggleIndicator('SMA25')"
              class="indicator-btn"
            >
              SMA 25
            </button>
          </div>
          <div class="period-selector">
            <button [class.active]="interval() === '1m'" (click)="updateInterval('1m')">1m</button>
            <button [class.active]="interval() === '1h'" (click)="updateInterval('1h')">1h</button>
            <button [class.active]="interval() === '1d'" (click)="updateInterval('1d')">1d</button>
          </div>
          <button class="close-btn" (click)="dialogRef.close()" aria-label="Close dialog">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </header>

      <div class="ticker-details-layout">
        <div class="chart-main">
          <div #chartContainer class="chart-container"></div>
        </div>

        <aside class="sidebar-section">
          <nav class="sidebar-tabs">
            <button [class.active]="activeTab() === 'book'" (click)="activeTab.set('book')">
              Order Book
            </button>
            <button [class.active]="activeTab() === 'trades'" (click)="activeTab.set('trades')">
              Trades
            </button>
            <button [class.active]="activeTab() === 'alerts'" (click)="activeTab.set('alerts')">
              Alerts
              @if (symbolAlerts().length > 0) {
                <span class="tab-badge">{{ symbolAlerts().length }}</span>
              }
            </button>
            <button
              [class.active]="activeTab() === 'portfolio'"
              (click)="activeTab.set('portfolio')"
            >
              Portfolio
              @if (holding()) {
                <span class="tab-badge dot"></span>
              }
            </button>
          </nav>

          <div class="sidebar-content">
            @switch (activeTab()) {
              @case ('book') {
                <div class="order-book-section">
                  <div class="book-container">
                    <div class="book-side asks">
                      <div class="book-header">
                        <span>Price</span>
                        <span>Quantity</span>
                        <span>Total</span>
                      </div>
                      @for (ask of orderBook().asks.slice().reverse(); track ask.price) {
                        <div class="book-row ask">
                          <span class="price">{{ ask.price | number: '1.2-6' }}</span>
                          <span class="qty">{{ ask.quantity | number: '1.2-4' }}</span>
                          <span class="total">{{ ask.total | number: '1.0-2' }}</span>
                          <div
                            class="depth-bar"
                            [style.width.%]="((ask.total || 0) / maxTotal()) * 100"
                          ></div>
                        </div>
                      }
                    </div>

                    <div class="spread">
                      Spread: {{ spread() | number: '1.2-6' }} ({{
                        spreadPercentage() | number: '1.2-2'
                      }}%)
                    </div>

                    <div class="book-side bids">
                      @for (bid of orderBook().bids; track bid.price) {
                        <div class="book-row bid">
                          <span class="price">{{ bid.price | number: '1.2-6' }}</span>
                          <span class="qty">{{ bid.quantity | number: '1.2-4' }}</span>
                          <span class="total">{{ bid.total | number: '1.0-2' }}</span>
                          <div
                            class="depth-bar"
                            [style.width.%]="((bid.total || 0) / maxTotal()) * 100"
                          ></div>
                        </div>
                      }
                    </div>
                  </div>
                </div>
              }
              @case ('trades') {
                <div class="trades-section">
                  <div class="trades-container">
                    <div class="trades-header">
                      <span>Price</span>
                      <span>Amount</span>
                      <span>Time</span>
                    </div>
                    <div class="trades-list">
                      @for (trade of trades(); track trade.id) {
                        <div
                          class="trade-row"
                          [class.buy]="!trade.isBuyerMaker"
                          [class.sell]="trade.isBuyerMaker"
                        >
                          <span class="price">{{ trade.price | number: '1.2-6' }}</span>
                          <span class="qty">{{ trade.quantity | number: '1.2-4' }}</span>
                          <span class="time">{{ trade.time | date: 'HH:mm:ss' }}</span>
                        </div>
                      }
                    </div>
                  </div>
                </div>
              }
              @case ('alerts') {
                <div class="alerts-section">
                  <div class="alerts-form">
                    <div class="input-group">
                      <input type="number" [(ngModel)]="alertPrice" placeholder="Price..." />
                      <select [(ngModel)]="alertCondition">
                        <option value="above">Above</option>
                        <option value="below">Below</option>
                      </select>
                    </div>
                    <button (click)="addAlert()" class="add-alert-btn">Set Alert</button>
                  </div>

                  <div class="alerts-list">
                    @for (alert of symbolAlerts(); track alert.id) {
                      <div class="alert-item" [class.inactive]="!alert.active">
                        <div class="alert-info">
                          <span class="alert-condition">{{
                            alert.condition === 'above' ? '▲' : '▼'
                          }}</span>
                          <span class="alert-price"
                            >$ {{ alert.targetPrice | number: '1.2-6' }}</span
                          >
                        </div>
                        <button (click)="removeAlert(alert.id)" class="delete-alert-btn">×</button>
                      </div>
                    }
                    @if (symbolAlerts().length === 0) {
                      <div class="no-alerts">No alerts set for this symbol.</div>
                    }
                  </div>
                </div>
              }
              @case ('portfolio') {
                <div class="portfolio-section">
                  @if (holding()) {
                    <div class="holding-summary">
                      <div class="stat">
                        <span class="label">Amount</span>
                        <span class="value">{{ holding()?.amount | number: '1.2-4' }}</span>
                      </div>
                      <div class="stat">
                        <span class="label">Avg Price</span>
                        <span class="value">$ {{ holding()?.avgPrice | number: '1.2-6' }}</span>
                      </div>
                      <div
                        class="stat pnl"
                        [class.up]="symbolPnL() >= 0"
                        [class.down]="symbolPnL() < 0"
                      >
                        <span class="label">PnL</span>
                        <span class="value">
                          {{ symbolPnL() >= 0 ? '+' : '' }}{{ symbolPnL() | number: '1.2-2' }} ({{
                            symbolPnLPercent() | number: '1.2-2'
                          }}%)
                        </span>
                      </div>
                    </div>
                  }

                  <div class="portfolio-form">
                    <div class="input-group">
                      <input type="number" [(ngModel)]="portAmount" placeholder="Amount..." />
                      <input type="number" [(ngModel)]="portPrice" placeholder="Buy Price..." />
                    </div>
                    <div class="button-group">
                      <button (click)="updateHolding()" class="update-holding-btn">
                        Set Position
                      </button>
                      @if (holding()) {
                        <button
                          (click)="portfolioService.removePosition(data.symbol)"
                          class="remove-holding-btn"
                        >
                          Reset
                        </button>
                      }
                    </div>
                  </div>
                </div>
              }
            }
          </div>
        </aside>
      </div>
    </div>
  `,
  styleUrl: './ticker-details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TickerDetailsComponent implements OnInit, OnDestroy {
  readonly data = inject(MAT_DIALOG_DATA) as { symbol: string };
  readonly dialogRef = inject(MatDialogRef<TickerDetailsComponent>);
  private binanceService = inject(BinanceService);
  protected alertService = inject(AlertService);
  protected portfolioService = inject(PortfolioService);
  private destroy$ = new Subject<void>();

  private chart: IChartApi | null = null;
  private candlestickSeries: ISeriesApi<'Candlestick'> | null = null;
  private sma7Series: ISeriesApi<'Line'> | null = null;
  private sma25Series: ISeriesApi<'Line'> | null = null;
  private chartContainer = viewChild<ElementRef>('chartContainer');
  private fullHistory: CandlestickData[] = [];

  interval = signal('1h');
  activeTab = signal<'book' | 'trades' | 'alerts' | 'portfolio'>('book');
  showSMA7 = signal(false);
  showSMA25 = signal(false);
  ticker = computed(() => this.binanceService.tickers().find((t) => t.symbol === this.data.symbol));
  orderBook = signal<{ bids: OrderBookLevel[]; asks: OrderBookLevel[] }>({ bids: [], asks: [] });
  trades = signal<RecentTrade[]>([]);

  // Alert Form State
  alertPrice = 0;
  alertCondition: 'above' | 'below' = 'above';

  symbolAlerts = computed(() =>
    this.alertService.alerts().filter((a) => a.symbol === this.data.symbol),
  );

  // Portfolio State
  portAmount = 0;
  portPrice = 0;
  holding = this.portfolioService.getHolding(this.data.symbol);

  symbolPnL = computed(() => {
    const h = this.holding();
    const t = this.ticker();
    if (!h || !t) return 0;
    return (t.price - h.avgPrice) * h.amount;
  });

  symbolPnLPercent = computed(() => {
    const h = this.holding();
    const t = this.ticker();
    if (!h || !h.avgPrice || !t) return 0;
    return ((t.price - h.avgPrice) / h.avgPrice) * 100;
  });

  maxTotal = computed(() => {
    const bids = this.orderBook().bids;
    const asks = this.orderBook().asks;
    const maxBid = bids.length > 0 ? bids[bids.length - 1].total || 0 : 0;
    const maxAsk = asks.length > 0 ? asks[asks.length - 1].total || 0 : 0;
    return Math.max(maxBid, maxAsk, 1);
  });

  spread = computed(() => {
    const bids = this.orderBook().bids;
    const asks = this.orderBook().asks;
    if (bids.length > 0 && asks.length > 0) {
      return asks[0].price - bids[0].price;
    }
    return 0;
  });

  spreadPercentage = computed(() => {
    const bids = this.orderBook().bids;
    if (bids.length > 0 && this.spread() > 0) {
      return (this.spread() / bids[0].price) * 100;
    }
    return 0;
  });

  ngOnInit() {
    this.initChart();
    this.loadData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.chart) {
      this.chart.remove();
    }
  }

  private initChart() {
    const container = this.chartContainer()?.nativeElement;
    if (!container) return;

    this.chart = createChart(container, {
      layout: {
        background: { color: 'transparent' },
        textColor: '#848e9c',
      },
      grid: {
        vertLines: { color: 'rgba(71, 77, 87, 0.1)' },
        horzLines: { color: 'rgba(71, 77, 87, 0.1)' },
      },
      crosshair: {
        mode: 0,
      },
      timeScale: {
        borderColor: 'rgba(71, 77, 87, 0.2)',
        timeVisible: true,
      },
      rightPriceScale: {
        borderColor: 'rgba(71, 77, 87, 0.2)',
      },
    });

    this.candlestickSeries = this.chart.addSeries(CandlestickSeries, {
      upColor: '#2ebd85',
      downColor: '#f6465d',
      borderVisible: false,
      wickUpColor: '#2ebd85',
      wickDownColor: '#f6465d',
    });

    this.sma7Series = this.chart.addSeries(LineSeries, {
      color: '#f3ba2f', // Binance Yellow
      lineWidth: 1,
      visible: false,
      title: 'SMA 7',
    });

    this.sma25Series = this.chart.addSeries(LineSeries, {
      color: '#9652e0', // Purple
      lineWidth: 1,
      visible: false,
      title: 'SMA 25',
    });

    // Handle resize
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries.length === 0 || !this.chart) return;
      const { width, height } = entries[0].contentRect;
      this.chart.applyOptions({ width, height });
    });
    resizeObserver.observe(container);
  }

  private loadData() {
    // 1. Chart Data
    this.binanceService
      .getKlines(this.data.symbol, this.interval())
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.fullHistory = data as CandlestickData[];
        if (this.candlestickSeries) {
          this.candlestickSeries.setData(this.fullHistory as any);
          this.updateIndicators();
        }
      });

    this.binanceService
      .getKlineStream(this.data.symbol, this.interval())
      .pipe(takeUntil(this.destroy$))
      .subscribe((update) => {
        const index = this.fullHistory.findIndex((k) => k.time === update.time);
        if (index !== -1) {
          this.fullHistory[index] = update;
        } else {
          this.fullHistory.push(update);
        }

        if (this.candlestickSeries) {
          this.candlestickSeries.update(update as any);
          this.updateIndicators();
        }
      });

    // 2. Order Book Data
    this.binanceService
      .getOrderBook(this.data.symbol)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => this.orderBook.set(data));

    this.binanceService
      .getOrderBookStream(this.data.symbol)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => this.orderBook.set(data));

    // 3. Recent Trades
    this.binanceService
      .getRecentTrades(this.data.symbol, 30)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => this.trades.set(data));

    this.binanceService
      .getTradeStream(this.data.symbol)
      .pipe(takeUntil(this.destroy$))
      .subscribe((newTrade) => {
        this.trades.update((current) => [newTrade, ...current].slice(0, 30));
      });
  }

  addAlert() {
    if (this.alertPrice <= 0) return;
    this.alertService.addAlert(this.data.symbol, this.alertPrice, this.alertCondition);
    this.alertPrice = 0; // Reset
  }

  updateHolding() {
    if (this.portAmount < 0 || this.portPrice <= 0) return;
    this.portfolioService.setAbsolutePosition(this.data.symbol, this.portAmount, this.portPrice);
  }

  removeAlert(id: string) {
    this.alertService.removeAlert(id);
  }

  updateInterval(newInterval: string) {
    this.interval.set(newInterval);
    // Reload chart data
    this.loadData();
  }

  toggleIndicator(type: 'SMA7' | 'SMA25') {
    if (type === 'SMA7') {
      this.showSMA7.update((v) => !v);
      this.sma7Series?.applyOptions({ visible: this.showSMA7() });
    } else {
      this.showSMA25.update((v) => !v);
      this.sma25Series?.applyOptions({ visible: this.showSMA25() });
    }
    this.updateIndicators();
  }

  private updateIndicators() {
    if (this.showSMA7() && this.sma7Series) {
      this.sma7Series.setData(calculateSMA(this.fullHistory, 7) as any);
    }
    if (this.showSMA25() && this.sma25Series) {
      this.sma25Series.setData(calculateSMA(this.fullHistory, 25) as any);
    }
  }
}
