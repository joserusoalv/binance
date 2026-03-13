import { Routes } from '@angular/router';

export const registrationRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./registration.component').then(c => c.RegistrationComponent)
  }
];
