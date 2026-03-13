import { Component, ChangeDetectionStrategy, signal, computed, input, output } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

/**
 * Gold Standard: Angular 21 Standalone Component
 * - No standalone: true (default in v21)
 * - Signal-based inputs and local state
 * - Computed values for derived state
 * - OnPush change detection
 * - Host object for bindings
 * - Native control flow (@if, @for)
 */
@Component({
  selector: 'app-example-component',
  imports: [CommonModule, NgOptimizedImage],
  template: `
    <div class="container">
      @if (isVisible()) {
        <h1>{{ title() }}</h1>
        <p>Current count: {{ count() }}</p>
        <p>Double count: {{ doubleCount() }}</p>
        
        <button type="button" (click)="increment()">
          Increment
        </button>

        @for (item of items(); track item.id) {
          <div class="item">{{ item.name }}</div>
        }
      }
    </div>
  `,
  styleUrls: ['./example-component.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.aria-label]': 'title()',
    '[class.is-visible]': 'isVisible()'
  }
})
export class ExampleComponent {
  // Inputs
  title = input.required<string>();
  items = input<any[]>([]);

  // Local State
  count = signal(0);
  isVisible = signal(true);

  // Outputs
  countChanged = output<number>();

  // Derived State
  doubleCount = computed(() => this.count() * 2);

  increment() {
    this.count.update(c => c + 1);
    this.countChanged.emit(this.count());
  }
}
