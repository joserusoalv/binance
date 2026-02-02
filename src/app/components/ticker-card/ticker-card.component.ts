import { DecimalPipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { APP_CONFIG } from '../../constants/app.constants';
import { ImageFallbackDirective } from '../../directives/image-fallback.directive';
import { TickerData } from '../../models/binance.models';
import { CryptoIconPipe } from '../../pipes/crypto-icon.pipe';

@Component({
  selector: 'app-ticker-card',
  imports: [DecimalPipe, NgOptimizedImage, CryptoIconPipe, ImageFallbackDirective],
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
    </div>
  `,
  styleUrl: './ticker-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TickerCardComponent {
  ticker = input.required<TickerData>();
  readonly config = APP_CONFIG;

  // Use computed signals for derived state - much more efficient than getters or functions in templates
  readonly displaySymbol = computed(() => this.ticker().symbol.replace(APP_CONFIG.QUOTE_ASSET, ''));
  readonly changePrefix = computed(() => (this.ticker().priceChangePercent > 0 ? '+' : ''));
  readonly priceFormat = computed(() => (this.ticker().price < 1 ? '1.2-6' : '1.2-4'));
}
