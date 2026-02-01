import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { FormlyModule, FormlyFieldConfig } from '@ngx-formly/core';
import { TickerData, DashboardModel, Theme } from '../../models/binance.models';
import { APP_CONFIG } from '../../constants/app.constants';

@Component({
  selector: 'app-header',
  imports: [ReactiveFormsModule, FormlyModule, DecimalPipe],
  template: `
    <header class="header">
      <div class="header-left">
        <div class="logo">
          <span class="icon">{{ config.LOGO_ICON }}</span>
          <h1>{{ config.TITLE }}</h1>
        </div>
      </div>
      
      <div class="filter-section">
        <form [formGroup]="form()">
          <formly-form 
            [form]="form()" 
            [fields]="fields()" 
            [model]="model()"
            (modelChange)="modelChange.emit()">
          </formly-form>
        </form>
      </div>

      <div class="header-right">
        @if (btcTicker(); as btc) {
          <div class="market-overview">
            <div class="stat">
              <span class="label">{{ btcLabel }}</span>
              <span class="value" [class.up]="btc.direction === 'up'" [class.down]="btc.direction === 'down'">
                \${{ btc.price | number:'1.2-2' }}
              </span>
            </div>
          </div>
        }

        <button class="theme-toggle" (click)="themeToggle.emit()" type="button" [attr.aria-label]="toggleAriaLabel()">
          @if (theme() === 'dark') {
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
          } @else {
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
          }
        </button>
      </div>
    </header>
  `,
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  theme = input.required<Theme>();
  form = input.required<FormGroup>();
  fields = input.required<FormlyFieldConfig[]>();
  model = input.required<DashboardModel>();
  btcTicker = input.required<TickerData | undefined>();

  themeToggle = output<void>();
  modelChange = output<void>();

  readonly config = APP_CONFIG;
  readonly btcLabel = `BTC/${APP_CONFIG.QUOTE_ASSET}`;

  readonly toggleAriaLabel = computed(() => 
    `Switch to ${this.theme() === 'light' ? 'dark' : 'light'} mode`
  );
}
