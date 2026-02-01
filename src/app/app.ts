import { Component, ChangeDetectionStrategy, inject, signal, effect, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormlyModule, FormlyFieldConfig } from '@ngx-formly/core';
import { map } from 'rxjs/operators';
import { BinanceService } from './services/binance.service';

// New Components
import { HeaderComponent } from './components/header/header.component';
import { TickerGridComponent } from './components/ticker-grid/ticker-grid.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
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
  private binanceService = inject(BinanceService);
  private injector = inject(Injector);
  
  theme = signal<'light' | 'dark'>('dark');
  form = new FormGroup({});
  model = {
    selectedSymbols: this.binanceService.selectedSymbols()
  };

  protected readonly availableOptions$ = toObservable(this.binanceService.availableSymbols, { injector: this.injector }).pipe(
    map(symbols => symbols.map(s => ({ 
      label: s.replace('USDT', ''), 
      value: s 
    })))
  );

  fields: FormlyFieldConfig[] = [
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

  tickers = this.binanceService.tickers;
  btcTicker = this.binanceService.btcTicker;
  isLoading = this.binanceService.isLoading;

  constructor() {
    effect(() => {
      document.documentElement.setAttribute('data-theme', this.theme());
    });
  }

  toggleTheme() {
    this.theme.update(t => t === 'light' ? 'dark' : 'light');
  }

  onModelChange() {
    this.binanceService.updateSelectedSymbols(this.model.selectedSymbols);
  }

  handleSuggestion(symbol: string) {
    if (!this.model.selectedSymbols.includes(symbol)) {
      this.model.selectedSymbols = [...this.model.selectedSymbols, symbol];
      this.onModelChange();
    }
  }

  handleRestoreDefaults() {
    this.binanceService.resetToDefaults();
    this.model.selectedSymbols = this.binanceService.selectedSymbols();
  }
}
