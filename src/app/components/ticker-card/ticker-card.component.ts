import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-ticker-card',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  template: `
    <div class="crypto-card" [class.flash-up]="ticker().direction === 'up'" [class.flash-down]="ticker().direction === 'down'">
      <div class="card-header">
        <span class="symbol">{{ ticker().symbol.replace('USDT', '') }}</span>
        <span class="price-change" [class.positive]="ticker().priceChangePercent > 0" [class.negative]="ticker().priceChangePercent < 0">
          {{ ticker().priceChangePercent > 0 ? '+' : '' }}{{ ticker().priceChangePercent | number:'1.2-2' }}%
        </span>
      </div>
      
      <div class="price-section">
        <span class="price" [class.up]="ticker().direction === 'up'" [class.down]="ticker().direction === 'down'">
          \${{ ticker().price | number:'1.2-4' }}
        </span>
      </div>

      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-label">24h High</span>
          <span class="stat-value">{{ ticker().high | number:'1.2-2' }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">24h Low</span>
          <span class="stat-value">{{ ticker().low | number:'1.2-2' }}</span>
        </div>
        <div class="stat-item full-width">
          <span class="stat-label">Volume (USDT)</span>
          <span class="stat-value">{{ ticker().volume | number:'1.0-0' }}</span>
        </div>
      </div>
    </div>
  `,
  styleUrl: './ticker-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TickerCardComponent {
  ticker = input.required<any>();
}
