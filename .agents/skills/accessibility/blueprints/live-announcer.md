# Blueprint: Live Announcer (Dynamic Updates)

This blueprint demonstrates how to handle accessibility in complex UI scenarios like dependent dropdowns using Angular CDK's `LiveAnnouncer`.

## Key Features

- **Asynchronous Feedback**: Informs screen reader users when data loads.
- **Context Preservation**: Avoids moving focus unnecessarily while still providing information.
- **Polite vs Assertive**: Uses appropriate announcement priority.

## Code Snippet

```typescript
import { Component, inject, signal, effect, untracked } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-dependent-filters',
  standalone: true,
  template: `
    <div class="filters">
      <label for="cat-select" class="sr-only">Select Category</label>
      <select id="cat-select" (change)="onCategoryChange($event)">
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
      </select>

      <label for="prod-select" class="sr-only">Select Product</label>
      <select id="prod-select" [disabled]="isLoading()" [attr.aria-busy]="isLoading()">
        @for (product of products(); track product.id) {
          <option [value]="product.id">{{ product.name }}</option>
        }
      </select>

      @if (isLoading()) {
        <span class="sr-only">Loading products...</span>
      }
    </div>
  `,
})
export class DependentFiltersComponent {
  private announcer = inject(LiveAnnouncer);
  private productService = inject(ProductService);

  category = signal<string>('electronics');
  products = signal<Product[]>([]);
  isLoading = signal(false);

  constructor() {
    /**
     * [GUARDRAIL] The effect must be purely for the announcement.
     * We use 'untracked' so the announcement does not fire again
     * if 'category' changes before the products arrive.
     */
    effect(() => {
      const data = this.products();
      const currentCat = untracked(this.category); // Avoids circular dependencies or extra firings

      if (data.length > 0 && !this.isLoading()) {
        this.announcer.announce(`${data.length} products available for ${currentCat}`, 'polite');
      }
    });
  }

  async onCategoryChange(event: Event) {
    const val = (event.target as HTMLSelectElement).value;
    this.category.set(val);

    try {
      this.isLoading.set(true);
      const results = await this.productService.getByCategory(val);
      this.products.set(results);
    } catch (error) {
      this.announcer.announce('Error loading products', 'assertive');
      this.products.set([]);
    } finally {
      this.isLoading.set(false);
    }
  }
}
```

## When to use

- **Dependent Dropdowns**: Announce when the second dropdown is populated.
- **Table Sorting/Filtering**: Announce the new order or number of results.
- **Progressive Disclosure**: Announce when new sections of a form appear.
- **Background Tasks**: Announce when a long-running save or export completes.
