import { Component, ChangeDetectionStrategy, inject, signal, effect, Injector } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormlyModule, FormlyFieldConfig } from '@ngx-formly/core';
import { map } from 'rxjs/operators';
import { BinanceService } from './services/binance.service';
import { DashboardModel, SelectOption, Theme } from './models/binance.models';
import { WINDOW } from './tokens/window.token';

// Standalone Components
import { HeaderComponent } from './components/header/header.component';
import { TickerGridComponent } from './components/ticker-grid/ticker-grid.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [
    ReactiveFormsModule, 
    FormlyModule,
    HeaderComponent,
    TickerGridComponent,
    FooterComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  private readonly binanceService = inject(BinanceService);
  private readonly window = inject(WINDOW);
  private readonly document = inject(DOCUMENT);
  
  readonly theme = signal<Theme>(
    this.window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );
  readonly form = new FormGroup({});
  
  readonly model = signal<DashboardModel>({
    selectedSymbols: this.binanceService.selectedSymbols()
  });

  protected readonly availableOptions$ = toObservable(this.binanceService.availableSymbols).pipe(
    map((symbols): SelectOption[] => symbols.map(s => ({ 
      label: s.replace('USDT', ''), 
      value: s 
    })))
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

  toggleTheme(): void {
    this.theme.update(t => t === 'light' ? 'dark' : 'light');
  }

  onModelChange(): void {
    // We update the signal to notify any observers (if any) and then sync with service
    this.model.update(m => ({ ...m }));
    this.binanceService.updateSelectedSymbols(this.model().selectedSymbols);
  }

  handleSuggestion(symbol: string): void {
    const current = this.model().selectedSymbols;
    if (!current.includes(symbol)) {
      this.model.update(m => ({
        ...m,
        selectedSymbols: [...current, symbol]
      }));
      this.onModelChange();
    }
  }

  handleRestoreDefaults(): void {
    this.binanceService.resetToDefaults();
    this.model.set({
      selectedSymbols: [...this.binanceService.selectedSymbols()]
    });
  }
}
