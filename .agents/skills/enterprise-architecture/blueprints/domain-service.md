# Domain Service Blueprint

A complete, production-ready data-access service using `httpResource`, Zod validation, and atomic signals.

## File: `domains/<domain>/data-access/<domain>.service.ts`

```typescript
import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { httpResource } from '@angular/common/http';
import { <Entity>Schema, type <Entity> } from './schemas/<entity>.schema';

@Injectable({ providedIn: 'root' })
export class <Domain>Service {
  // ── Private atomic state ────────────────────────────────────────────────────
  readonly #selectedId = signal<string | null>(null);

  // ── HTTP Resources (reactive, lazy, auto-cancel) ────────────────────────────
  // Fetches a list; re-fetches automatically if URL dependencies change
  readonly #listResource = httpResource<<Entity>[]>(
    () => '/api/<entity>',
    { parse: (data) => <Entity>Schema.array().parse(data) }
  );

  // Fetches a single entity only when #selectedId is set
  readonly #detailResource = httpResource<<Entity>>(
    () => {
      const id = this.#selectedId();
      if (!id) return undefined; // Suspended — no request sent
      return `/api/<entity>/${id}`;
    },
    { parse: <Entity>Schema.parse }
  );

  // ── Public read-only API ────────────────────────────────────────────────────
  readonly items = this.#listResource.value;
  readonly isLoading = this.#listResource.isLoading;
  readonly error = this.#listResource.error;

  readonly selectedId = this.#selectedId.asReadonly();
  readonly detail = this.#detailResource.value;
  readonly isDetailLoading = this.#detailResource.isLoading;

  // ── Derived state (computed) ────────────────────────────────────────────────
  readonly totalCount = computed(() => this.items()?.length ?? 0);

  // Derived from both list and selected — only re-evaluates when either changes
  readonly selectedItem = computed(() =>
    this.items()?.find((item) => item.id === this.#selectedId()) ?? null
  );

  // ── Commands (the only mutation surface) ───────────────────────────────────
  selectItem(id: string): void {
    this.#selectedId.set(id);
  }

  clearSelection(): void {
    this.#selectedId.set(null);
  }
}
```

## Key Rules

| Rule | Rationale |
|------|-----------|
| All `signal()` fields are `#private` | Enforces unidirectional data flow |
| `httpResource` with `parse` option | Runtime validation at the boundary; avoids `any` |
| `undefined` returned from resource factory | Suspends the request declaratively |
| `computed()` for all derived state | Prevents redundant re-renders |
| Public methods for state mutations | Single entry point per action; easy to audit |
