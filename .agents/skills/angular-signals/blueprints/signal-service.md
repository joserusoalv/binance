# Blueprint: Reactive Service & Component Patterns

This blueprint demonstrates the gold standard for Signal-based state in Angular 21, covering three key patterns: **Atomic Signals**, **`untracked()`**, and **`linkedSignal()`**.

---

## Pattern 1: Reactive Service with Atomic Signals

```typescript
@Injectable({
  providedIn: 'root',
})
export class ExampleService {
  // Internal State — atomic signals for uncorrelated state
  #data = signal<Item[]>([]);
  #isLoading = signal(false);

  // Public Exposure — readonly for consumers
  data = this.#data.asReadonly();
  isLoading = this.#isLoading.asReadonly();

  // Derived state — only re-evaluates when #data changes, NOT when #isLoading changes
  dataCount = computed(() => this.data().length);

  setData(newData: Item[]): void {
    this.#data.set(newData);
  }

  setLoading(loading: boolean): void {
    this.#isLoading.set(loading);
  }
}
```

---

## Pattern 2: `untracked()` Inside `effect()`

Use `untracked()` to read a signal without registering it as a reactive dependency of the enclosing `effect()`.

```typescript
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private activeUser = inject(AuthService).user;
  private appConfig = inject(ConfigService).config;

  constructor() {
    effect(() => {
      // Reactive dependency: effect re-runs when activeUser changes
      const user = this.activeUser();

      // Non-reactive read: we only need the current value, not reactivity
      const config = untracked(() => this.appConfig());

      this.track('user_loaded', { userId: user.id, configVersion: config.version });
    });
  }
}
```

> **When to use:** Any time you read a second signal inside an `effect()` purely for its current value, and you do not want that signal to trigger the effect independently.

---

## Pattern 3: `linkedSignal()` — Input-Driven State Reset ⭐ Angular 21

`linkedSignal` creates a **writable** signal that automatically resets whenever its source changes. Use it to synchronize local UI state with an incoming `input()`.

```typescript
@Component({
  selector: 'app-product-list',
  template: `
    <ul>
      @for (product of products(); track product.id) {
        <li
          [class.selected]="product.id === selectedProduct()?.id"
          (click)="selectProduct(product)"
        >{{ product.name }}</li>
      }
    </ul>
  `,
})
export class ProductListComponent {
  // Source input signal
  products = input.required<Product[]>();

  // linkedSignal: resets to first item on every new products emission
  selectedProduct = linkedSignal(() => this.products()[0]);

  selectProduct(product: Product): void {
    // Still fully writable — user interactions work normally
    this.selectedProduct.set(product);
  }
}
```

**Advanced — preserving previous selection across list updates:**

```typescript
selectedProduct = linkedSignal<Product[], Product>({
  source: this.products,
  computation: (newProducts, previous) =>
    newProducts.find(p => p.id === previous?.value?.id) ?? newProducts[0],
});
```

> **Rule:** Never use `effect()` to reset local state when an input changes. Use `linkedSignal()` instead — it is declarative, side-effect-free, and keeps the signal writable.
