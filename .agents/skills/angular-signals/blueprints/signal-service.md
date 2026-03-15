# Blueprint: Reactive Service

This blueprint demonstrates the gold standard for a Reactive Service in Angular 21.

## Key Features
- Provided in root
- Native private fields (`#`) for internal state
- Readonly public signals for consumers
- Atomic update methods

## Code Snippet

```typescript
@Injectable({
  providedIn: 'root'
})
export class ExampleService {
  // Internal State (Native private field)
  #state = signal<{ data: any[]; loading: boolean }>({
    data: [],
    loading: false
  });

  // Public Exposure (Readonly)
  state = this.#state.asReadonly();
  data = computed(() => this.#state().data);
  isLoading = computed(() => this.#state().loading);

  /**
   * Method to update state atomically
   */
  updateData(newData: any[]) {
    this.#state.update(s => ({
      ...s,
      data: newData
    }));
  }
}
```
