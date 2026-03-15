# Domain Routes Blueprint

Lazy-loaded routes with guards and nested children. The shell is the **only** entry point to a domain.

## File: `domains/<domain>/shell/routes.ts`

```typescript
import { Routes } from '@angular/router';
import { authGuard } from '@core/auth/guards/auth.guard';
import { roleGuard } from '@core/auth/guards/role.guard';

export const <DOMAIN>_ROUTES: Routes = [
  {
    path: '',
    // Guards run before any lazy chunk is downloaded
    canActivate: [authGuard],
    // Shell layout component wraps all domain routes (nav, sidebar, etc.)
    loadComponent: () =>
      import('../features/<domain>-shell/<domain>-shell.component').then(
        (m) => m.<Domain>ShellComponent
      ),
    children: [
      // Default redirect
      { path: '', redirectTo: 'list', pathMatch: 'full' },

      // List view
      {
        path: 'list',
        loadComponent: () =>
          import('../features/<domain>-list/<domain>-list.component').then(
            (m) => m.<Domain>ListComponent
          ),
      },

      // Detail view — guarded by role
      {
        path: ':id',
        canActivate: [roleGuard('admin')],
        loadComponent: () =>
          import('../features/<domain>-detail/<domain>-detail.component').then(
            (m) => m.<Domain>DetailComponent
          ),
      },
    ],
  },
];
```

## File: `app.routes.ts` — Root integration

```typescript
import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  // Eager-load the shell route (no content, just redirects)
  { path: '', redirectTo: '<domain>', pathMatch: 'full' },

  // Lazy-load the entire domain by its shell routes
  {
    path: '<domain>',
    loadChildren: () =>
      import('./domains/<domain>/shell/routes').then(
        (m) => m.<DOMAIN>_ROUTES
      ),
  },

  // Wildcard — always last
  {
    path: '**',
    loadComponent: () =>
      import('./shared/ui/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
];
```

## Key Rules

| Rule | Rationale |
|------|-----------|
| Guards on parent route | Guard runs once for the entire domain, not per child |
| `loadComponent` for the shell | Shell itself is lazy — no eager root-level imports |
| `loadChildren` in `app.routes.ts` | Entire domain chunk only downloaded when navigated to |
| `redirectTo` as default child | Avoids empty-path ambiguity |
| Wildcard `**` always last | Router matches in order; wildcard must be the fallback |
