# Blueprint: Resource Service (httpResource)

This blueprint demonstrates the gold standard for data fetching in Angular 21 using `httpResource`.

## Key Features
- **Modern Fetching**: Uses `httpResource` (v21 standard).
- **Reactive Parameters**: Automatically re-fetches when input signals change.
- **Automatic Cancellation**: Pending requests are aborted via `AbortController` if the component is destroyed or parameters change.
- **Runtime Safety**: Integrated Zod validation.

## Code Snippet

```typescript
// 1. Define Zod Schema for API response
const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
});

type User = z.infer<typeof UserSchema>;

@Injectable({
  providedIn: 'root',
})
export class UserResourceService {
  /**
   * [1] DECLARATIVE PATTERN (Primary Standard)
   * Best for shared/singleton state. The service owns the state (#userId).
   */
  readonly #userId = signal<number | null>(null);

  #userResource = httpResource<User>(() => {
    const id = this.#userId();
    return id ? { url: `/api/users/${id}` } : null;
  }, {
    parse: (data: unknown) => UserSchema.parse(data),
  });

  // Expose signals for the view
  user = this.#userResource.value;
  isLoading = this.#userResource.isLoading;
  error = this.#userResource.error;

  /**
   * Setting the signal triggers a re-fetch and 
   * cancels any pending previous request.
   */
  selectUser(id: number) {
    this.#userId.set(id);
  }

  /**
   * [2] FACTORY PATTERN (Alternative for Route Inputs)
   * Best for bridging component-local signals (like route inputs) to the service.
   */
  getBySignal(idSignal: Signal<number | null>) {
    return httpResource<User>(() => {
      const id = idSignal();
      return id ? { url: `/api/users/${id}` } : null;
    }, {
      parse: (data: unknown) => UserSchema.parse(data),
    });
  }

  reload() {
    this.#userResource.reload();
  }
}
```
