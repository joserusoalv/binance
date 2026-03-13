import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'registration',
    loadChildren: () => import('./features/registration/registration.routes').then(m => m.registrationRoutes)
  },
  {
    path: '',
    redirectTo: 'registration',
    pathMatch: 'full'
  }
];
