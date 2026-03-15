---
name: Enterprise Architecture (DDD)
description: Strict domain-driven design (DDD) patterns optimized for Angular 21 and Signal-based state.
---

# Enterprise Architecture (DDD) Skill

## 1. Context (Input)

Before designing or modifying any domain structure, I must:

- [ ] **Bounded Context**: Identify if the feature belongs to an existing domain or requires a new one.
- [ ] **Dependency Direction**: Check if the domain needs to consume `core/` (singletons) or `shared/` (generic UI/utils). Dependencies never flow upward.
- [ ] **Layer Check**: Determine if the requirement is Orchestration (Feature/Smart) or Visual (UI/Dumb). Never mix them.
- [ ] **Data Origin**: Confirm if data comes from HTTP, WebSocket, or local storage to choose the right resource primitive.

## 2. Contract (Output)

Every domain I produce will have:

- **Strict Layering**: `data-access` → `features` → `ui`. No shortcuts.
- **Lazy Loading**: Every domain entry routed via `loadChildren` or `loadComponent`.
- **Type Safety at the Edge**: Zod schemas validate and transform all external data (API/Storage).
- **Public API via Barrel**: Each layer exposes only what other layers need through `index.ts`.
- **Unidirectional Flow**: Services hold `private #state` signals; components only call public methods.

## 3. Guardrails

- **NEVER** import a `Feature` component inside another `Feature`. Features are siblings; compose via `ui/` or shared services.
- **NEVER** use `HttpClient` directly. **ALWAYS** use `httpResource()` with a Zod schema for parsing and type safety.
- **NEVER** eager-load a domain. **ALWAYS** use `loadChildren` or `loadComponent` for lazy loading.
- **NEVER** inject a domain-specific service into a `ui/` (Dumb) component. Props flow via `@Input`/`input()`.
- **NEVER** let `shared/` depend on any `domains/` module. Shared must be truly generic.
- **ALWAYS** define a `shell/` folder as the domain's entry point, containing routes, guards, and layout wrappers.
- **ALWAYS** use `private #state` in data-access services to enforce unidirectional data flow via atomic signals.
- **ALWAYS** place Zod schemas in `data-access/schemas/` and derive TypeScript types from them with `z.infer`.

## 4. Gold Standard Patterns

Refer to these blueprints for full implementations:

- [Domain Service Blueprint](./blueprints/domain-service.md)
- [Zod Schema Blueprint](./blueprints/zod-schema.md)
- [Domain Routes Blueprint](./blueprints/domain-routes.md)

---

### Pattern 1: Canonical Folder Structure

```text
src/app/
  ├── core/                     # App-wide singletons (Auth, Interceptors, Env)
  │   ├── auth/
  │   └── interceptors/
  ├── shared/                   # Truly generic, domain-agnostic UI + utils
  │   ├── ui/                   # Generic components (Button, Modal, Spinner)
  │   └── utils/                # Pure functions, pipes, generic validators
  └── domains/
      └── <domain>/
          ├── shell/            # Entry point: routes.ts, guards, layout wrappers
          ├── data-access/      # httpResource services, Zod schemas, Signal state
          │   └── schemas/      # Zod schemas + inferred types
          ├── features/         # Smart Components (inject services, own routes)
          ├── ui/               # Dumb/Presentational Components (Input/Output only)
          └── utils/            # Domain-specific pure functions / validators
```

---

### Pattern 2: Data-Access Service with `httpResource` + Zod

The canonical pattern for fetching remote data. Uses `httpResource()` for reactive loading state and Zod for runtime validation at the boundary.

```typescript
// domains/market/data-access/market.service.ts
@Injectable({ providedIn: 'root' })
export class MarketService {
  readonly #http = inject(HttpClient);

  // Atomic signals — only related computed() signals re-evaluate on change
  readonly #selectedSymbol = signal<string>('BTCUSDT');

  // httpResource: reactive, lazy, auto-cancels on signal change
  readonly #tickerResource = httpResource<Ticker>(
    () => `/api/v3/ticker/24hr?symbol=${this.#selectedSymbol()}`,
    { parse: TickerSchema.parse }
  );

  // Public read-only API
  readonly selectedSymbol = this.#selectedSymbol.asReadonly();
  readonly ticker = this.#tickerResource.value;
  readonly isLoading = this.#tickerResource.isLoading;
  readonly error = this.#tickerResource.error;

  // Derived state — only re-evaluates when ticker changes
  readonly priceChange = computed(() => {
    const t = this.ticker();
    return t ? parseFloat(t.priceChangePercent) : 0;
  });

  // Command — the only way to mutate state from outside
  selectSymbol(symbol: string): void {
    this.#selectedSymbol.set(symbol);
  }
}
```

---

### Pattern 3: Zod Schema at the Edge

Schemas live in `data-access/schemas/`. TypeScript types are **always** derived from the schema — never declared separately.

```typescript
// domains/market/data-access/schemas/ticker.schema.ts
import { z } from 'zod';

export const TickerSchema = z.object({
  symbol: z.string(),
  lastPrice: z.string(),
  priceChangePercent: z.string(),
  volume: z.string(),
  highPrice: z.string(),
  lowPrice: z.string(),
});

// Single source of truth: TypeScript type derived from the schema
export type Ticker = z.infer<typeof TickerSchema>;
```

---

### Pattern 4: Lazy Domain Routes (`shell/routes.ts`)

Every domain is lazy-loaded. The shell contains the authoritative route definition for the domain.

```typescript
// domains/market/shell/routes.ts
import { Routes } from '@angular/router';
import { authGuard } from '@core/auth';

export const MARKET_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../features/market-shell/market-shell.component').then(
        (m) => m.MarketShellComponent
      ),
    children: [
      {
        path: 'overview',
        loadComponent: () =>
          import('../features/market-overview/market-overview.component').then(
            (m) => m.MarketOverviewComponent
          ),
      },
    ],
  },
];
```

The root `app.routes.ts` lazy-loads this shell:

```typescript
// app.routes.ts
{
  path: 'market',
  loadChildren: () =>
    import('./domains/market/shell/routes').then((m) => m.MARKET_ROUTES),
}
```

---

### Pattern 5: Smart Feature vs. Dumb UI Component

**Smart (Feature)** — injects services, owns orchestration logic:

```typescript
// domains/market/features/market-overview/market-overview.component.ts
@Component({
  template: `
    @if (marketService.isLoading()) {
      <app-spinner />
    } @else {
      <app-ticker-card [ticker]="marketService.ticker()!" />
    }
  `,
})
export class MarketOverviewComponent {
  protected readonly marketService = inject(MarketService);
}
```

**Dumb (UI)** — no service injection, purely `input()`/`output()` driven:

```typescript
// domains/market/ui/ticker-card/ticker-card.component.ts
@Component({
  selector: 'app-ticker-card',
  template: `
    <div class="ticker-card">
      <span>{{ ticker().symbol }}</span>
      <span>{{ ticker().lastPrice }}</span>
    </div>
  `,
})
export class TickerCardComponent {
  readonly ticker = input.required<Ticker>();
}
```

---

### Pattern 6: Barrel Files (`index.ts`) — The Public API Contract

Each layer exposes only what the layer above needs. This prevents deep-linking into domain internals.

```typescript
// domains/market/data-access/index.ts
export { MarketService } from './market.service';
export type { Ticker } from './schemas/ticker.schema';
// TickerSchema is NOT re-exported — it's an internal implementation detail
```

## 5. Verification (Checklist)

- [ ] Every domain is lazy-loaded via `loadChildren` or `loadComponent`.
- [ ] No `HttpClient` is used directly; all HTTP calls go through `httpResource()`.
- [ ] All external data (API responses) are parsed through a Zod schema.
- [ ] TypeScript types are `z.infer<typeof Schema>` — never defined separately.
- [ ] `ui/` components have zero service injections; they use only `input()` / `output()`.
- [ ] No cross-domain `Feature` imports exist; sharing happens through `shared/` or services.
- [ ] `shared/` has no imports from any `domains/` module.
- [ ] Each domain layer exposes a minimal `index.ts` barrel — no deep-linking.
- [ ] Service state uses atomic `signal()` fields, not a single state-object signal.
- [ ] All commands that mutate state are explicit public methods on the service.
