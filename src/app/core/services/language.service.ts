import { Injectable, inject, LOCALE_ID } from '@angular/core';

export interface Language {
  code: string;
  label: string;
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  #currentLocale = inject(LOCALE_ID);

  readonly languages: Language[] = [
    { code: 'en-US', label: 'English' },
    { code: 'es', label: 'Español' }
  ];

  get currentLanguageCode(): string {
    return this.#currentLocale;
  }

  /**
   * Switches the application language by redirecting to the target locale's URL.
   * This triggers a full page reload as native Angular i18n requires separate bundles.
   */
  switchLanguage(languageCode: string): void {
    if (languageCode === this.#currentLocale) return;

    const currentPath = window.location.pathname;
    const currentLocalePrefix = `/${this.#currentLocale}/`;
    
    // Determine the new path based on the target language code
    let newPath: string;
    
    if (currentPath.startsWith(currentLocalePrefix)) {
      newPath = currentPath.replace(currentLocalePrefix, `/${languageCode}/`);
    } else {
      // Fallback or root handling
      newPath = `/${languageCode}${currentPath}`;
    }

    // Standard native i18n behavior: full reload to the localized bundle
    window.location.assign(newPath);
  }
}
