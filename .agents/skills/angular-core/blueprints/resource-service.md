# Blueprint: Resource Service (httpResource)

This blueprint demonstrates the gold standard for data fetching in Angular 21 using `httpResource`.

## Key Features

- **Modern Fetching**: Uses `httpResource` (v21 standard).
- **Reactive Parameters**: Automatically re-fetches when input signals change.
- **Automatic Cancellation**: Pending requests are aborted via `AbortController` if the component is destroyed or parameters change.
- **Runtime Safety**: Integrated Zod validation.

## Code Snippet

```typescript
const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
});

type User = z.infer<typeof UserSchema>;

@Injectable() // [GUARDRAIL] Do NOT use 'root'. Provide at Route/Component level.
export class UserResourceService {
  readonly #userId = signal<number | null>(null);

  // [1] DECLARATIVE (Shared state in service scope)
  readonly resource = httpResource<User>(
    () => {
      const id = this.#userId();
      return id ? { url: `/api/users/${id}` } : null;
    },
    { parse: (data) => UserSchema.parse(data) },
  );

  // [2] FACTORY (Local state for components)
  getResource(idSignal: Signal<number | null>) {
    return httpResource<User>(
      () => {
        const id = idSignal();
        return id ? { url: `/api/users/${id}` } : null;
      },
      { parse: (data) => UserSchema.parse(data) },
    );
  }

  select(id: number) {
    this.#userId.set(id);
  }
  reload() {
    this.resource.reload();
  }
}
```
