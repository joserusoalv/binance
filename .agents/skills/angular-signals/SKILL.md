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
- [ ] Determine if a child state must reset when a parent input signal changes (`linkedSignal`).

## 2. Contract (Output)
When using signals, I will deliver:
- Reactive state using `signal()`.
- Derived state using `computed()`.
- Controlled access in services using `asReadonly()`.
- Component communication via `input()`, `output()`, and `model()`.
- Dependent-reset patterns using `linkedSignal()`.

## 3. Guardrails
- **NEVER** use `mutate()` (deprecated).
- **NEVER** write to signals inside a `computed()` or directly in a template.
- **NEVER** use `effect()` for state propagation; use `computed()` instead.
- **ALWAYS** prefer atomic signals (`#items = signal([])`) over state objects (`#state = signal({})`) to avoid unnecessary re-evaluations of unrelated `computed` signals.
- **ALWAYS** use `computed()` for any state derived from other signals.
- **ALWAYS** keep signal setters private in services, exposing only the readonly version.
- **ALWAYS** use `untracked()` inside `effect()` to read signals that should NOT create a reactive dependency.
- **ALWAYS** use `linkedSignal()` to reset a local writable signal whenever a source signal (e.g., an `input()`) changes.

## 4. Gold Standard Patterns

Refer to these blueprints:
- [Reactive Service Blueprint](./blueprints/signal-service.md)

### Pattern 1: Atomic Service State
```typescript
@Injectable({ providedIn: 'root' })
export class DataService {
  // Atomic signals: each computed only re-evaluates when its own source changes
  #items = signal<Item[]>([]);
  #loading = signal(false);

  // Expose as readonly
  items = this.#items.asReadonly();
  isLoading = this.#loading.asReadonly();

  // Only re-evaluates when #items changes — NOT when #loading changes
  itemsCount = computed(() => this.items().length);

  updateItems(items: Item[]) { this.#items.set(items); }
  setLoading(loading: boolean) { this.#loading.set(loading); }
}
```

### Pattern 2: `untracked()` — Reading Without Creating a Dependency
Use `untracked()` when you need to read a signal inside an `effect()` (or a function called from one) without registering it as a reactive dependency. This prevents unintentional re-runs.

```typescript
effect(() => {
  // This DOES create a dependency — effect re-runs when activeUser changes
  const user = this.activeUser();

  // This does NOT create a dependency — we only want the current value, not reactivity
  const config = untracked(() => this.appConfig());

  console.log(`User ${user.name} loaded with config version ${config.version}`);
});
```

> **Rule:** If you read a signal inside `effect()` and you don't want that signal to trigger the effect, wrap it with `untracked()`.

### Pattern 3: `linkedSignal()` — Resetting Local State on Input Change ⭐ Angular 21
`linkedSignal` creates a **writable** signal whose value is automatically reset whenever its source signal changes. It is the canonical solution for "reset a local selection when the list changes."

```typescript
@Component({ ... })
export class ProductListComponent {
  // Source: a required input signal
  products = input.required<Product[]>();

  // linkedSignal: resets to the first product whenever `products` changes
  selectedProduct = linkedSignal(() => this.products()[0]);

  // The user can still manually update it — it remains writable
  selectProduct(product: Product) {
    this.selectedProduct.set(product);
  }
}
```

**Advanced — with `previous` value access:**
```typescript
selectedProduct = linkedSignal<Product[], Product>({
  source: this.products,
  computation: (newProducts, previous) =>
    // Try to keep the previous selection if it still exists in the new list
    newProducts.find(p => p.id === previous?.value?.id) ?? newProducts[0],
});
```

> **Rule:** Prefer `linkedSignal()` over manually resetting state inside `effect()`. It is declarative, avoids side-effects, and correctly handles the writable-signal contract.

## 5. Verification (Checklist)
- [ ] Atomic signals are used for uncorrelated state (no single state-object anti-pattern).
- [ ] `computed()` is used for all derived data.
- [ ] `effect()` is used ONLY for external side effects (logging, DOM APIs, analytics).
- [ ] `untracked()` wraps any signal read inside `effect()` that should not trigger re-runs.
- [ ] `linkedSignal()` is used wherever a local writable state must reset on an input change.
- [ ] No circular signal updates are present.
- [ ] Service state is exposed via `asReadonly()`.
- [ ] `set()` or `update()` is used instead of manual assignments.
