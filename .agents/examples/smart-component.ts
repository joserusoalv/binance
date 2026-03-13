import { Component, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserResourceService } from './resource-service';

/**
 * Gold Standard: Smart Component (Feature Layer)
 * - Follows DDD pattern (Feature vs UI)
 * - Orchestrates services and resource signals
 * - Handles high-level side effects and UI coordination
 * - Uses OnPush for maximum performance
 */

@Component({
  selector: 'app-user-list-feature',
  standalone: true,
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
        <div class="error-alert">
          <p>Failed to load users. Please try again.</p>
          <small>{{ error() | json }}</small>
        </div>
      }

      <div class="user-grid">
        @for (user of users(); track user.id) {
          <!-- UI/Presentation Component would go here -->
          <div class="user-card">
            <h3>{{ user.name }}</h3>
            <p>{{ user.email }}</p>
          </div>
        } @empty {
          <p>No users found in the system.</p>
        }
      </div>
    </div>
  `,
  styleUrls: ['./smart-component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListFeatureComponent {
  // Inject the service (Smart components are allowed to inject)
  protected userService = inject(UserResourceService);

  // Expose signals for the template
  users = this.userService.users;
  isLoading = this.userService.isLoading;
  error = this.userService.error;
}
