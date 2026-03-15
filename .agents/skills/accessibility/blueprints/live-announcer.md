# Blueprint: Live Announcer (Dynamic Updates)

This blueprint demonstrates how to handle accessibility in complex UI scenarios like dependent dropdowns using Angular CDK's `LiveAnnouncer`.

## Key Features
- **Asynchronous Feedback**: Informs screen reader users when data loads.
- **Context Preservation**: Avoids moving focus unnecessarily while still providing information.
- **Polite vs Assertive**: Uses appropriate announcement priority.

## Code Snippet

```typescript
import { Component, inject, signal, effect } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-dependent-filters',
  template: `
    <div class="filters">
      <select (change)="onCategoryChange($event)" aria-label="Select Category">
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
      </select>

      <select [disabled]="isLoading()" aria-label="Select Product">
        @for (product of products(); track product.id) {
          <option [value]="product.id">{{ product.name }}</option>
        }
      </select>

      @if (isLoading()) {
        <span class="sr-only" aria-live="polite">Loading products...</span>
      }
    </div>
  `
})
export class DependentFiltersComponent {
  private announcer = inject(LiveAnnouncer);
  private productService = inject(ProductService);

  category = signal<string>('electronics');
  products = signal<Product[]>([]);
  isLoading = signal(false);

  constructor() {
    // Announce when products are loaded via effect
    effect(() => {
      const data = this.products();
      if (data.length > 0) {
        this.announcer.announce(`${data.length} products available for ${this.category()}`, 'polite');
      }
    });
  }

  async onCategoryChange(event: Event) {
    const val = (event.target as HTMLSelectElement).value;
    this.category.set(val);
    
    this.isLoading.set(true);
    const results = await this.productService.getByCategory(val);
    this.products.set(results);
    this.isLoading.set(false);
  }
}
```

## When to use
- **Dependent Dropdowns**: Announce when the second dropdown is populated.
- **Table Sorting/Filtering**: Announce the new order or number of results.
- **Progressive Disclosure**: Announce when new sections of a form appear.
- **Background Tasks**: Announce when a long-running save or export completes.
