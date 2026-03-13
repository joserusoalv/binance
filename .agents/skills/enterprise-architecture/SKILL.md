---
name: Enterprise Architecture (DDD)
description: Scalable, domain-driven architectural patterns for Angular applications.
---

# Enterprise Architecture (DDD)

Maintain a clean separation of concerns using a Domain-Driven Design (DDD) inspired structure. This ensures the application remains scalable as features grow.

## Folder Structure (Domain-Based)

Structure features by domain, not by technical type:

```text
src/app/domains/
  ├── auth/
  ├── portfolio/
  │   ├── data-access/      # Services, Interfaces, State (Signals)
  │   ├── features/         # Smart Components (Routes)
  │   ├── ui/               # Presentational Components (Dumb)
  │   └── utils/            # Domain-specific helpers/pipes
  └── shared/               # Global components (Buttons, Inputs)
```

## Component Types

### Smart Components (Features)
-   Connected to Services/Signals.
-   Handle routing and side effects.
-   Orchestrate UI/Presentational components.

### Presentational Components (UI)
-   Receive data via `@Input` (Signals preferred: `input()`).
-   Emit events via `@Output` (Signals preferred: `output()`).
-   No direct service injection.
-   Purely visual and interactive.

## Data Access Patterns

1.  **Centralized State**: Use Services with private `signal` and public `asReadonly()` to expose state.
2.  **Immutability**: Ensure signals hold immutable data (use partial updates or spread operators).
3.  **Zod Validation**: Validate incoming API data in the Service layer before it reaches the View.

## Runtime Data Validation (Zod)

In Enterprise projects, never trust the backend types implicitly. Use Zod to validate data at the network boundary:

1.  **Define Schemas**: Create schemas that mirror your domain interfaces.
2.  **Parse at Source**: Use `Schema.parse(data)` inside your Service's `pipe(map())` or `rxResource` loader.
3.  **Fail Early**: Catch mapping errors immediately rather than having `undefined` bugs in UI components.

```typescript
const MySchema = z.object({ id: z.string() });
// In service:
this.http.get('/api').pipe(map(d => MySchema.parse(d)));
```

## Cross-Cutting Rules

1.  **Lazy Loading**: Every domain feature should be lazy-loaded by default.
2.  **Shared vs. Core**: Shared contains UI components; Core contains singleton services (Auth, Config).
3.  **Strict Typing**: No `any` allowed. Use interfaces or types for every data structure.
