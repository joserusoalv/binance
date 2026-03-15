# Blueprint: Standalone Component

Technical reference for a standard Angular 21 component.

## Generation Command

```bash
ng generate component components/<name> --change-detection onPush
```

## Key Features

- No redundant `standalone: true` (v21 default)
- Signal-based inputs and local state
- `OnPush` change detection (CLI flag)
- Native control flow (`@if`, `@for`)

## Code Snippet

```typescript
@Component({
  selector: 'app-example-component',
  imports: [CommonModule, NgOptimizedImage],
  template: `
    <div class="container">
      @if (isVisible()) {
        <h1>{{ title() }}</h1>
        <p>Current count: {{ count() }}</p>
        <p>Double count: {{ doubleCount() }}</p>

        <button type="button" (click)="increment()">Increment</button>

        @for (item of items(); track item.id) {
          <div class="item">{{ item.name }}</div>
        }
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.aria-label]': 'title()',
    '[class.is-visible]': 'isVisible()',
  },
})
export class ExampleComponent {
  // Inputs
  title = input.required<string>();
  items = input<Items[]>([]);

  // Local State
  count = signal(0);
  isVisible = signal(true);

  // Outputs
  countChanged = output<number>();

  // Derived State
  doubleCount = computed(() => this.count() * 2);

  increment() {
    this.count.update((c) => c + 1);
    this.countChanged.emit(this.count());
  }
}
```
