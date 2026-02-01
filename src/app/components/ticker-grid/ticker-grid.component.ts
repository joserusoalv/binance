import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TickerCardComponent } from '../ticker-card/ticker-card.component';

@Component({
  selector: 'app-ticker-grid',
  standalone: true,
  imports: [CommonModule, TickerCardComponent],
  template: `
    <main class="grid-container">
      @if (isLoading()) {
        <div class="status-overlay">
          <div class="spinner"></div>
          <p>Connecting to Binance...</p>
        </div>
      } @else if (tickers().length > 0) {
        @for (ticker of tickers(); track ticker.symbol) {
          <app-ticker-card [ticker]="ticker"></app-ticker-card>
        }
      } @else {
        <div class="status-overlay empty">
          <span class="empty-icon">🔍</span>
          <p>Your dashboard is empty</p>
          <div class="suggestions">
            <span>Quick start:</span>
            <button class="suggestion-btn" (click)="restoreDefaults.emit()">Restore Defaults</button>
            <button class="suggestion-btn" (click)="suggestionClicked.emit('BTCUSDT')">BTC</button>
            <button class="suggestion-btn" (click)="suggestionClicked.emit('ETHUSDT')">ETH</button>
            <button class="suggestion-btn" (click)="suggestionClicked.emit('SOLUSDT')">SOL</button>
          </div>
          <small>Or use the search bar above to find any USDT pair</small>
        </div>
      }
    </main>
  `,
  styleUrl: './ticker-grid.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TickerGridComponent {
  tickers = input.required<any[]>();
  isLoading = input<boolean>(false);

  suggestionClicked = output<string>();
  restoreDefaults = output<void>();
}
