# Blueprint: Resource Service (httpResource)

This blueprint demonstrates the gold standard for data fetching in Angular 21 using `httpResource`.

## Key Features
- Uses `httpResource` for modern data fetching (v21 standard)
- Integrated Zod validation for runtime safety
- Reactive "refresh" capability

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
   * httpResource: The specialized way to handle HTTP data in Angular 21.
   * It is shorter and more optimized than raw resource/rxResource for HTTP.
   * Use the 'parse' option to transform/validate the data.
   */
  #usersResource = httpResource<User[]>(() => ({ url: '/api/users' }), {
    parse: (data: unknown) => (data as any[]).map((item) => UserSchema.parse(item)),
  });

  // Expose specific signals for the view
  users = this.#usersResource.value;
  isLoading = this.#usersResource.isLoading;
  error = this.#usersResource.error;

  /**
   * Trigger a data refresh
   */
  reload() {
    this.#usersResource.reload();
  }
}
```
