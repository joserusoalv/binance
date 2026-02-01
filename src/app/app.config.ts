import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideFormlyCore, provideFormlyConfig } from '@ngx-formly/core';
import { withFormlyMaterial } from '@ngx-formly/material';
import { ChipSelectType } from './formly/chip-select.type';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    // provideAnimationsAsync(),
    provideFormlyCore({
      validationMessages: [
        { name: 'required', message: 'This field is required' },
      ],
      types: [
        { name: 'chip-select', component: ChipSelectType }
      ]
    }),
    provideFormlyConfig(withFormlyMaterial()),
  ]
};
