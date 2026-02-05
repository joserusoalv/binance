import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { map } from 'rxjs/operators';
import { DashboardModel, SelectOption, Theme } from './models/binance.models';
import { BinanceService } from './services/binance.service';
import { WINDOW } from './tokens/window.token';

// Standalone Components
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { PortfolioSummaryComponent } from './components/portfolio-summary/portfolio-summary.component';
import { TickerDetailsComponent } from './components/ticker-details/ticker-details.component';
import { TickerGridComponent } from './components/ticker-grid/ticker-grid.component';

@Component({
  selector: 'app-root',
  imports: [
    ReactiveFormsModule,
    FormlyModule,
    HeaderComponent,
    PortfolioSummaryComponent,
    TickerGridComponent,
    FooterComponent,
    MatDialogModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit {
  private readonly binanceService = inject(BinanceService);
  private readonly window = inject(WINDOW);
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);

  readonly theme = signal<Theme>(
    this.window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  );
  readonly form = new FormGroup({});

  readonly model = signal<DashboardModel>({
    selectedSymbols: this.binanceService.selectedSymbols(),
  });

  readonly viewMode = signal<'grid' | 'table'>('grid');

  protected readonly availableOptions$ = toObservable(this.binanceService.availableSymbols).pipe(
    map((symbols): SelectOption[] =>
      symbols.map((s) => ({
        label: s.replace('USDT', ''),
        value: s,
      })),
    ),
  );

  readonly fields: FormlyFieldConfig[] = [
    {
      key: 'selectedSymbols',
      type: 'chip-select',
      props: {
        label: 'Select Currencies',
        placeholder: 'Search and select...',
        options: this.availableOptions$,
        required: true,
      },
    },
  ];

  readonly tickers = this.binanceService.tickers;
  readonly btcTicker = this.binanceService.btcTicker;
  readonly isLoading = this.binanceService.isLoading;

  constructor() {
    effect(() => {
      this.document.documentElement.setAttribute('data-theme', this.theme());
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const symbolsParam = params['symbols'];
      let targetSymbols: string[] = [];

      if (symbolsParam) {
        targetSymbols = symbolsParam.split(',').filter((s: string) => s);
      }

      const current = this.model().selectedSymbols;
      // Simple equality check to avoid infinite loops if onModelChange writes back
      if (!this.areArraysEqual(current, targetSymbols)) {
        this.model.update((m) => ({ ...m, selectedSymbols: targetSymbols }));
        this.binanceService.updateSelectedSymbols(targetSymbols);
      }
    });
  }

  private areArraysEqual(a: string[], b: string[]): boolean {
    if (a.length !== b.length) return false;
    const sortedA = [...a].sort();
    const sortedB = [...b].sort();
    return sortedA.every((val, index) => val === sortedB[index]);
  }

  toggleTheme(): void {
    this.theme.update((t) => (t === 'light' ? 'dark' : 'light'));
  }

  onModelChange(): void {
    // We update the signal to notify any observers (if any) and then sync with service
    this.model.update((m) => ({ ...m }));
    this.binanceService.updateSelectedSymbols(this.model().selectedSymbols);

    // Sync to URL
    const symbols = this.model().selectedSymbols.join(',');
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { symbols: symbols || null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  handleSuggestion(symbol: string): void {
    const current = this.model().selectedSymbols;
    if (!current.includes(symbol)) {
      this.model.update((m) => ({
        ...m,
        selectedSymbols: [...current, symbol],
      }));
      this.onModelChange();
    }
  }

  handleRestoreDefaults(): void {
    this.binanceService.resetToDefaults();
    this.model.set({
      selectedSymbols: [...this.binanceService.selectedSymbols()],
    });
    this.onModelChange();
  }

  handleTickerSelection(symbol: string): void {
    this.dialog.open(TickerDetailsComponent, {
      data: { symbol },
      width: '95vw',
      height: '90vh',
      maxWidth: '1800px',
      panelClass: 'ticker-details-dialog-v2',
    });
  }
}
