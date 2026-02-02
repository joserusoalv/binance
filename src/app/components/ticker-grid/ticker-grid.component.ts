import { DecimalPipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MARKET_CONFIG } from '../../constants/app.constants';
import { ImageFallbackDirective } from '../../directives/image-fallback.directive';
import { TickerData } from '../../models/binance.models';
import { CryptoIconPipe } from '../../pipes/crypto-icon.pipe';
import { TickerCardComponent } from '../ticker-card/ticker-card.component';

@Component({
  selector: 'app-ticker-grid',
  imports: [
    TickerCardComponent,
    DecimalPipe,
    NgOptimizedImage,
    MatIconModule,
    CryptoIconPipe,
    ImageFallbackDirective,
  ],
  template: `
    <main class="grid-container">
      @if (isLoading()) {
        <div class="status-overlay">
          <div class="spinner"></div>
          <p>{{ loadingMessage }}</p>
        </div>
      } @else if (sortedTickers().length > 0) {
        @if (viewMode() === 'grid') {
          <div class="grid-layout">
            @for (ticker of sortedTickers(); track ticker.symbol) {
              <app-ticker-card
                [ticker]="ticker"
                (select)="tickerSelected.emit($event)"
              ></app-ticker-card>
            }
          </div>
        } @else {
          <div class="table-container">
            <table class="ticker-table">
              <thead>
                <tr>
                  <th class="sortable text-left" (click)="toggleSort('symbol')">
                    Coin
                    @if (sortColumn() === 'symbol') {
                      <mat-icon class="sort-icon">{{
                        sortDirection() === 'asc' ? 'arrow_upward' : 'arrow_downward'
                      }}</mat-icon>
                    }
                  </th>
                  <th class="sortable text-right" (click)="toggleSort('price')">
                    Price
                    @if (sortColumn() === 'price') {
                      <mat-icon class="sort-icon">{{
                        sortDirection() === 'asc' ? 'arrow_upward' : 'arrow_downward'
                      }}</mat-icon>
                    }
                  </th>
                  <th class="sortable text-right" (click)="toggleSort('priceChangePercent')">
                    24h Change
                    @if (sortColumn() === 'priceChangePercent') {
                      <mat-icon class="sort-icon">{{
                        sortDirection() === 'asc' ? 'arrow_upward' : 'arrow_downward'
                      }}</mat-icon>
                    }
                  </th>
                  <th class="sortable text-right hide-mobile" (click)="toggleSort('high')">
                    24h High
                    @if (sortColumn() === 'high') {
                      <mat-icon class="sort-icon">{{
                        sortDirection() === 'asc' ? 'arrow_upward' : 'arrow_downward'
                      }}</mat-icon>
                    }
                  </th>
                  <th class="sortable text-right hide-mobile" (click)="toggleSort('low')">
                    24h Low
                    @if (sortColumn() === 'low') {
                      <mat-icon class="sort-icon">{{
                        sortDirection() === 'asc' ? 'arrow_upward' : 'arrow_downward'
                      }}</mat-icon>
                    }
                  </th>
                  <th class="sortable text-right hide-small" (click)="toggleSort('volume')">
                    24h Volume
                    @if (sortColumn() === 'volume') {
                      <mat-icon class="sort-icon">{{
                        sortDirection() === 'asc' ? 'arrow_upward' : 'arrow_downward'
                      }}</mat-icon>
                    }
                  </th>
                </tr>
              </thead>
              <tbody>
                @for (ticker of sortedTickers(); track ticker.symbol) {
                  <tr
                    (click)="tickerSelected.emit(ticker.symbol)"
                    class="ticker-row"
                    [class.flash-up]="ticker.direction === 'up'"
                    [class.flash-down]="ticker.direction === 'down'"
                  >
                    <td>
                      <div class="coin-cell">
                        <img
                          [ngSrc]="ticker.symbol | cryptoIcon"
                          width="24"
                          height="24"
                          appImageFallback
                          alt=""
                        />
                        <span class="symbol">{{ ticker.symbol.replace('USDT', '') }}</span>
                        <span class="pair">/USDT</span>
                      </div>
                    </td>
                    <td class="text-right">
                      <span
                        class="price"
                        [class.up]="ticker.direction === 'up'"
                        [class.down]="ticker.direction === 'down'"
                      >
                        \${{ ticker.price | number: (ticker.price < 1 ? '1.2-6' : '1.2-4') }}
                      </span>
                    </td>
                    <td class="text-right">
                      <span
                        class="change"
                        [class.positive]="ticker.priceChangePercent > 0"
                        [class.negative]="ticker.priceChangePercent < 0"
                      >
                        {{ ticker.priceChangePercent > 0 ? '+' : ''
                        }}{{ ticker.priceChangePercent | number: '1.2-2' }}%
                      </span>
                    </td>
                    <td class="text-right hide-mobile">
                      <span class="stat-val">\${{ ticker.high | number: '1.2-4' }}</span>
                    </td>
                    <td class="text-right hide-mobile">
                      <span class="stat-val">\${{ ticker.low | number: '1.2-4' }}</span>
                    </td>
                    <td class="text-right hide-small">
                      <span class="stat-val">\${{ ticker.volume | number: '1.0-0' }}</span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      } @else {
        <div class="status-overlay empty">
          <span class="empty-icon">{{ emptyIcon }}</span>
          <p>{{ emptyMessage }}</p>
          <div class="suggestions">
            <span>{{ suggestionLabel }}</span>
            <button class="suggestion-btn" (click)="restoreDefaults.emit()">
              Restore Defaults
            </button>
            @for (item of quickStartSymbols; track item) {
              <button class="suggestion-btn" (click)="suggestionClicked.emit(item + 'USDT')">
                {{ item }}
              </button>
            }
          </div>
          <small>{{ footerNote }}</small>
        </div>
      }
    </main>
  `,
  styleUrl: './ticker-grid.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TickerGridComponent {
  tickers = input.required<TickerData[]>();
  isLoading = input<boolean>(false);
  viewMode = input<'grid' | 'table'>('grid');

  suggestionClicked = output<string>();
  restoreDefaults = output<void>();
  tickerSelected = output<string>();

  // Sorting
  sortColumn = signal<keyof TickerData | 'symbol'>('symbol');
  sortDirection = signal<'asc' | 'desc'>('asc');

  sortedTickers = computed(() => {
    const data = [...this.tickers()];
    const col = this.sortColumn();
    const dir = this.sortDirection();

    return data.sort((a, b) => {
      let valA = a[col as keyof TickerData];
      let valB = b[col as keyof TickerData];

      if (typeof valA === 'string' && typeof valB === 'string') {
        return dir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }

      if (typeof valA === 'number' && typeof valB === 'number') {
        return dir === 'asc' ? valA - valB : valB - valA;
      }

      return 0;
    });
  });

  toggleSort(column: keyof TickerData | 'symbol') {
    if (this.sortColumn() === column) {
      this.sortDirection.update((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('desc'); // Default to descending for numbers usually better
      if (column === 'symbol') this.sortDirection.set('asc');
    }
  }

  readonly loadingMessage = 'Connecting to Binance...';
  readonly emptyMessage = 'Your dashboard is empty';
  readonly emptyIcon = '🔍';
  readonly suggestionLabel = 'Quick start:';
  readonly footerNote = 'Or use the search bar above to find any USDT pair';

  readonly quickStartSymbols = MARKET_CONFIG.QUICK_START_SYMBOLS;
}
