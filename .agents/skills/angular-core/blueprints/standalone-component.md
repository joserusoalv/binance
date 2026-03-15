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
  selector: 'app-ui-item',
  imports: [NgOptimizedImage],
  template: `
    @if (data(); as items) {
      <header>
        <h2>{{ label() }} ({{ count() }})</h2>
        <button (click)="onAdd()">Add</button>
      </header>

      @for (item of items; track item.id) {
        <div class="row">{{ item.name }}</div>
      } @empty {
        <p>No items found.</p>
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'listitem', '[class.active]': 'isActive()' },
})
export class UiItemComponent {
  // Inputs & Outputs (Signal-based)
  label = input.required<string>();
  data = input<Item[]>([]);
  add = output<void>();

  // State
  count = signal(0);
  isActive = signal(false);

  // Derived
  hasData = computed(() => this.data().length > 0);

  onAdd() {
    this.count.update((v) => v + 1);
    this.add.emit();
  }
}
```
