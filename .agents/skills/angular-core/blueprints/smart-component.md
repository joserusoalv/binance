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
  imports: [UserCardUiComponent, SkeletonComponent, ErrorComponent],
  providers: [UserResourceService], // [GUARDRAIL] Scoped lifecycle
  template: `
    @if (user(); as u) {
      <app-user-card-ui [user]="u" (delete)="onDelete(u.id)" />
    } @else if (res.isLoading()) {
      <app-skeleton />
    } @else if (res.error()) {
      <app-error [message]="'User not found'" />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailFeatureComponent {
  id = input.required<number>();
  private service = inject(UserResourceService);

  // Bridge signal to scoped service
  res = this.service.getResource(this.id);
  user = this.res.value;

  onDelete(userId: number) {
    // Orchestrate high-level side effect
    console.log('Orchestrating delete for:', userId);
  }
}
```
