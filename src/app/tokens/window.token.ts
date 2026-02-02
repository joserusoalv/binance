import { isPlatformBrowser } from '@angular/common';
import { FactoryProvider, inject, InjectionToken, PLATFORM_ID } from '@angular/core';

export const WINDOW = new InjectionToken<Window & { WebSocket: typeof WebSocket }>('WindowToken');

export const provideWindow = (): FactoryProvider => ({
  provide: WINDOW,
  useFactory: () => {
    const platformId = inject(PLATFORM_ID);
    if (isPlatformBrowser(platformId)) {
      return window;
    }
    return {} as Window; // Fallback for SSR
  },
});
