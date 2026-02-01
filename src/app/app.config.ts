import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideFormlyCore, provideFormlyConfig } from '@ngx-formly/core';
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
