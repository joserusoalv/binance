import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { provideFormlyConfig, provideFormlyCore } from '@ngx-formly/core';
import { withFormlyMaterial } from '@ngx-formly/material';
import { ChipSelectType } from './formly/chip-select.type';
import { provideWindow } from './tokens/window.token';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    provideWindow(),
    provideAnimationsAsync(),
    importProvidersFrom(MatSnackBarModule),
    { provide: 'MAT_SNACK_BAR_DEFAULT_OPTIONS', useValue: { duration: 3000 } },
    provideFormlyCore({
      validationMessages: [{ name: 'required', message: 'This field is required' }],
      types: [{ name: 'chip-select', component: ChipSelectType }],
    }),
    provideFormlyConfig(withFormlyMaterial()),
  ],
};
