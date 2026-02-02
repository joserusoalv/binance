import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MARKET_CONFIG } from '../../constants/app.constants';
import { TickerData } from '../../models/binance.models';
import { TickerCardComponent } from '../ticker-card/ticker-card.component';

@Component({
  selector: 'app-ticker-grid',
  imports: [TickerCardComponent],
  template: `
    <main class="grid-container">
      @if (isLoading()) {
        <div class="status-overlay">
          <div class="spinner"></div>
          <p>{{ loadingMessage }}</p>
        </div>
      } @else if (tickers().length > 0) {
        @for (ticker of tickers(); track ticker.symbol) {
          <app-ticker-card [ticker]="ticker"></app-ticker-card>
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

  suggestionClicked = output<string>();
  restoreDefaults = output<void>();

  readonly loadingMessage = 'Connecting to Binance...';
  readonly emptyMessage = 'Your dashboard is empty';
  readonly emptyIcon = '🔍';
  readonly suggestionLabel = 'Quick start:';
  readonly footerNote = 'Or use the search bar above to find any USDT pair';

  readonly quickStartSymbols = MARKET_CONFIG.QUICK_START_SYMBOLS;
}
