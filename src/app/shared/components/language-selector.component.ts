import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { LanguageService } from '../../core/services/language.service';

/**
 * Native Language Selector
 * - Uses LanguageService to trigger full page reloads for native i18n.
 * - Simple Material-based menu for UX.
 */
@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatMenuModule, MatIconModule],
  template: `
    <button mat-icon-button [matMenuTriggerFor]="langMenu" aria-label="Select language">
      <mat-icon>translate</mat-icon>
    </button>
    <mat-menu #langMenu="matMenu">
      @for (lang of languages; track lang.code) {
        <button mat-menu-item (click)="switchLang(lang.code)">
          <mat-icon [class.active]="currentLang === lang.code">
            {{ currentLang === lang.code ? 'check' : '' }}
          </mat-icon>
          <span>{{ lang.label }}</span>
        </button>
      }
    </mat-menu>
  `,
  styles: `
    .active {
      color: var(--primary-color, #007bff);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LanguageSelectorComponent {
  private langService = inject(LanguageService);
  
  languages = this.langService.languages;
  currentLang = this.langService.currentLanguageCode;

  switchLang(code: string) {
    this.langService.switchLanguage(code);
  }
}
