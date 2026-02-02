import { ChangeDetectionStrategy, Component } from '@angular/core';
import { APP_CONFIG } from '../../constants/app.constants';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="footer">
      <p>{{ config.FOOTER_TEXT }}</p>
    </footer>
  `,
  styles: [
    `
      .footer {
        padding: var(--space-lg);
        text-align: center;
        color: var(--text-muted);
        font-size: var(--font-size-xs);
        border-top: var(--border-width) solid var(--border-subtle);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  readonly config = APP_CONFIG;
}
