# Blueprint: Smart Component (Feature Layer)

This blueprint demonstrates the gold standard for a Smart Component following DDD patterns.

## Key Features
- Follows DDD pattern (Feature vs UI)
- Orchestrates services and resource signals
- Handles high-level side effects and UI coordination
- Uses `OnPush` for maximum performance

## Code Snippet

```typescript
@Component({
  selector: 'app-user-detail-feature',
  imports: [CommonModule],
  template: `
    <div class="feature-container">
      @if (userResource.isLoading()) {
        <div class="skeleton">Loading user details...</div>
      }

      @if (userResource.value(); as user) {
        <article>
          <h1>{{ user.name }}</h1>
          <p>{{ user.email }}</p>
        </article>
      }

      @if (userResource.error()) {
        <p class="error">Error loading user.</p>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDetailFeatureComponent {
  // Route input (via withComponentInputBinding)
  id = input.required<number>();

  private userService = inject(UserResourceService);

  /**
   * Bridge Pattern: Pass the signal directly to the service factory.
   * No effect(), no allowSignalWrites, 100% reactive.
   */
  userResource = this.userService.getBySignal(this.id);
}
```
