import { DecimalPipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { APP_CONFIG } from '../../constants/app.constants';
import { ImageFallbackDirective } from '../../directives/image-fallback.directive';
import { TickerData } from '../../models/binance.models';
import { CryptoIconPipe } from '../../pipes/crypto-icon.pipe';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-ticker-card',
  imports: [DecimalPipe, NgOptimizedImage, CryptoIconPipe, ImageFallbackDirective, MatIconModule],
  host: {
    '(click)': 'select.emit(ticker().symbol)',
    class: 'clickable-card',
  },
  template: `
    <div
      class="crypto-card"
      [class.flash-up]="ticker().direction === 'up'"
      [class.flash-down]="ticker().direction === 'down'"
    >
      <div class="card-header">
        <div class="symbol-wrapper">
          <img
            [ngSrc]="ticker().symbol | cryptoIcon"
            width="24"
            height="24"
            class="crypto-icon"
            alt=""
            appImageFallback
          />
          <span class="symbol">{{ displaySymbol() }}</span>
          @if (holding()) {
            <span class="holding-badge" title="Portfolio Holding">
              <mat-icon>account_balance_wallet</mat-icon>
            </span>
          }
        </div>
        <span
          class="price-change"
          [class.positive]="ticker().priceChangePercent > 0"
          [class.negative]="ticker().priceChangePercent < 0"
        >
          {{ changePrefix() }}{{ ticker().priceChangePercent | number: '1.2-2' }}%
        </span>
      </div>

      <div class="price-section">
        <span
          class="price"
          [class.up]="ticker().direction === 'up'"
          [class.down]="ticker().direction === 'down'"
        >
          \${{ ticker().price | number: priceFormat() }}
        </span>
      </div>

      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-label">24h High</span>
          <span class="stat-value">{{ ticker().high | number: '1.2-2' }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">24h Low</span>
          <span class="stat-value">{{ ticker().low | number: '1.2-2' }}</span>
        </div>
        <div class="stat-item full-width">
          <span class="stat-label">Volume ({{ config.QUOTE_ASSET }})</span>
          <span class="stat-value">{{ ticker().volume | number: '1.0-0' }}</span>
        </div>
      </div>

      @if (holding()) {
        <div class="holding-overlay" [class.up]="holdingPnL() >= 0" [class.down]="holdingPnL() < 0">
          <div class="holding-pnl">
            {{ holdingPnL() >= 0 ? '+' : '' }}{{ holdingPnLPercent() | number: '1.2-2' }}%
          </div>
          <div class="holding-amount">
            {{ holding()?.amount | number: '1.1-4' }} {{ displaySymbol() }}
          </div>
        </div>
      }
    </div>
  `,
  styleUrl: './ticker-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TickerCardComponent {
  ticker = input.required<TickerData>();
  select = output<string>();
  readonly config = APP_CONFIG;
  private portfolioService = inject(PortfolioService);

  // Use computed signals for derived state - much more efficient than getters or functions in templates
  readonly displaySymbol = computed(() => this.ticker().symbol.replace(APP_CONFIG.QUOTE_ASSET, ''));
  readonly changePrefix = computed(() => (this.ticker().priceChangePercent > 0 ? '+' : ''));
  readonly priceFormat = computed(() => (this.ticker().price < 1 ? '1.2-6' : '1.2-4'));

  readonly holding = computed(() =>
    this.portfolioService.holdings().find((h) => h.symbol === this.ticker().symbol),
  );

  readonly holdingPnL = computed(() => {
    const h = this.holding();
    if (!h) return 0;
    return (this.ticker().price - h.avgPrice) * h.amount;
  });

  readonly holdingPnLPercent = computed(() => {
    const h = this.holding();
    if (!h || !h.avgPrice) return 0;
    return ((this.ticker().price - h.avgPrice) / h.avgPrice) * 100;
  });
}
