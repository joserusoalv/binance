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
  selector: 'app-user-list-feature',
  imports: [CommonModule],
  template: `
    <div class="feature-container">
      <header>
        <h1>System Users</h1>
        <button (click)="userService.reload()" [disabled]="isLoading()">
          Refresh Data
        </button>
      </header>

      @if (isLoading()) {
        <div class="skeleton-loader">Loading users...</div>
      }

      @if (error()) {
        <app-error-alert [error]="error()" />
      }

      <div class="user-grid">
        @for (user of users(); track user.id) {
          <app-user-card [user]="user" />
        } @empty {
          <p>No users found in the system.</p>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListFeatureComponent {
  protected userService = inject(UserResourceService);

  users = this.userService.users;
  isLoading = this.userService.isLoading;
  error = this.userService.error;
}
```
