---
name: Angular Signals
description: Best practices and patterns for Signal-based state management in Angular 21.
---

# Angular Signals Skill

## 1. Context (Input)
Before implementing signals, I must:
- [ ] Determine if the state is local (component) or shared (service).
- [ ] Identify dependencies to see if a `computed()` signal is needed.
- [ ] Check if the state needs to be writable or read-only for consumers.

## 2. Contract (Output)
When using signals, I will deliver:
- Reactive state using `signal()`.
- Derived state using `computed()`.
- Controlled access in services using `asReadonly()`.
- Component communication via `input()`, `output()`, and `model()`.

## 3. Guardrails
- **NEVER** use `mutate()` (deprecated).
- **NEVER** write to signals inside a `computed()` or directly in a template.
- **NEVER** use `effect()` for state propagation; use `computed()` instead.
- **ALWAYS** use `computed()` for any state derived from other signals.
- **ALWAYS** keep signal setters private in services, exposing only the readonly version.

## 4. Gold Standard Patterns
Refer to these blueprints:
- [Reactive Service Blueprint](./blueprints/signal-service.md)

### Key Snippet: Service State
```typescript
@Injectable({ providedIn: 'root' })
export class DataService {
  #state = signal<DataState>({ items: [], loading: false });
  
  // Expose as readonly
  state = this.#state.asReadonly();
  
  // Derived state
  itemsCount = computed(() => this.state().items.length);

  updateItems(items: Item[]) {
    this.#state.update(s => ({ ...s, items }));
  }
}
```

## 5. Verification (Checklist)
- [ ] `computed()` is used for all derived data.
- [ ] `effect()` is used ONLY for external side effects (logging, DOM APIs).
- [ ] No circular signal updates are present.
- [ ] Service state is exposed via `asReadonly()`.
- [ ] `update()` or `set()` is used instead of manual assignments.
