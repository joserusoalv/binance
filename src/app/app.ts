import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { BinanceService } from './services/binance.service';

@Component({
  selector: 'app-root',
  imports: [DecimalPipe],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  private binanceService = inject(BinanceService);
  
  tickers = this.binanceService.tickers;
  btcTicker = this.binanceService.btcTicker;
}
