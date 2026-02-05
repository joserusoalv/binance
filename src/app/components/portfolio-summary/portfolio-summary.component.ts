import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AlertService } from '../../services/alert.service';
import { BinanceService } from '../../services/binance.service';
import { CsvExportService } from '../../services/csv-export.service';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-portfolio-summary',
  imports: [DecimalPipe, MatIconModule],
  template: `
    @if (portfolioService.hasHoldings()) {
      <div class="summary-container" [class.collapsed]="isCollapsed()">
        <div class="summary-header" (click)="toggleCollapse()">
          <div class="header-left">
            <mat-icon class="header-icon">account_balance_wallet</mat-icon>
            <h2>Portfolio Global</h2>
            <span class="holdings-count">{{ portfolioService.holdings().length }} posiciones</span>
          </div>
          <div class="header-actions">
            <div class="export-menu">
              <button
                class="export-btn"
                type="button"
                (click)="toggleExportMenu(); $event.stopPropagation()"
                title="Exportar datos"
              >
                <mat-icon>download</mat-icon>
              </button>
              @if (showExportMenu()) {
                <div class="export-dropdown">
                  <button (click)="exportPortfolio(); showExportMenu.set(false)">
                    <mat-icon>account_balance_wallet</mat-icon>
                    <span>Portfolio</span>
                  </button>
                  <button (click)="exportAlerts(); showExportMenu.set(false)">
                    <mat-icon>notifications</mat-icon>
                    <span>Alertas</span>
                  </button>
                </div>
              }
            </div>
            <button class="collapse-btn" type="button">
              <mat-icon>{{ isCollapsed() ? 'expand_more' : 'expand_less' }}</mat-icon>
            </button>
          </div>
        </div>

        @if (!isCollapsed()) {
          <div class="summary-content">
            <div class="stats-grid">
              <div class="stat-card primary">
                <span class="stat-label">Valor Total</span>
                <span class="stat-value"
                  >\${{ portfolioService.totalValue() | number: '1.2-2' }}</span
                >
              </div>

              <div class="stat-card">
                <span class="stat-label">Inversión</span>
                <span class="stat-value secondary"
                  >\${{ portfolioService.totalCost() | number: '1.2-2' }}</span
                >
              </div>

              <div
                class="stat-card pnl"
                [class.profit]="portfolioService.totalPnL() > 0"
                [class.loss]="portfolioService.totalPnL() < 0"
              >
                <span class="stat-label">Ganancia/Pérdida</span>
                <div class="pnl-values">
                  <span class="stat-value"
                    >{{ portfolioService.totalPnL() > 0 ? '+' : '' }}\${{
                      portfolioService.totalPnL() | number: '1.2-2'
                    }}</span
                  >
                  <span class="pnl-percent"
                    >({{ portfolioService.totalPnLPercent() > 0 ? '+' : ''
                    }}{{ portfolioService.totalPnLPercent() | number: '1.2-2' }}%)</span
                  >
                </div>
              </div>

              @if (portfolioService.bestPerformer(); as best) {
                <div class="stat-card performer best">
                  <span class="stat-label">🏆 Mejor</span>
                  <div class="performer-info">
                    <span class="performer-symbol">{{ best!.symbol.replace('USDT', '') }}</span>
                    <span class="performer-pnl">+{{ best!.pnlPercent | number: '1.2-2' }}%</span>
                  </div>
                </div>
              }

              @if (portfolioService.worstPerformer(); as worst) {
                <div class="stat-card performer worst">
                  <span class="stat-label">📉 Peor</span>
                  <div class="performer-info">
                    <span class="performer-symbol">{{ worst!.symbol.replace('USDT', '') }}</span>
                    <span class="performer-pnl">{{ worst!.pnlPercent | number: '1.2-2' }}%</span>
                  </div>
                </div>
              }
            </div>
          </div>
        }
      </div>
    } @else {
      <div class="empty-state">
        <mat-icon class="empty-icon">account_balance_wallet</mat-icon>
        <p class="empty-message">No tienes inversiones simuladas</p>
        <small class="empty-hint"
          >Haz clic en cualquier moneda y añade una posición para empezar</small
        >
      </div>
    }
  `,
  styleUrl: './portfolio-summary.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioSummaryComponent {
  readonly portfolioService = inject(PortfolioService);
  readonly binanceService = inject(BinanceService);
  readonly csvExportService = inject(CsvExportService);
  readonly alertService = inject(AlertService);
  readonly isCollapsed = signal(false);
  readonly showExportMenu = signal(false);

  toggleCollapse() {
    this.isCollapsed.update((v) => !v);
  }

  toggleExportMenu() {
    this.showExportMenu.update((v) => !v);
  }

  exportPortfolio() {
    const holdings = this.portfolioService.holdings();
    const tickers = this.binanceService.tickers();

    const exportData = holdings.map((h) => {
      const ticker = tickers.find((t) => t.symbol === h.symbol);
      const currentPrice = ticker?.price || h.avgPrice;
      const value = h.amount * currentPrice;
      const cost = h.amount * h.avgPrice;
      const pnl = value - cost;
      const pnlPercent = (pnl / cost) * 100;

      return {
        Symbol: h.symbol,
        Amount: h.amount,
        'Avg Price': h.avgPrice,
        'Current Price': currentPrice,
        'Total Value': value,
        'Total Cost': cost,
        'PnL ($)': pnl,
        'PnL (%)': pnlPercent,
      };
    });

    this.csvExportService.exportToCsv(exportData, 'portfolio');
  }

  exportAlerts() {
    const alerts = this.alertService.alerts();

    const exportData = alerts.map((a) => ({
      Symbol: a.symbol,
      'Target Price': a.targetPrice,
      Condition: a.condition === 'above' ? 'Above' : 'Below',
      Active: a.active ? 'Yes' : 'No',
      'Created At': new Date(a.createdAt).toLocaleString(),
    }));

    this.csvExportService.exportToCsv(exportData, 'alerts');
  }
}
