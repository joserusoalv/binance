import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="footer">
      <p>© 2026 CryptoPulse • Real-time Binance Feed • Professional Dashboard</p>
    </footer>
  `,
  styles: [`
    .footer {
      padding: var(--space-lg);
      text-align: center;
      color: var(--text-muted);
      font-size: var(--font-size-xs);
      border-top: var(--border-width) solid var(--border-subtle);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {}
