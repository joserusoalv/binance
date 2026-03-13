import { render, screen, fireEvent } from '@testing-library/angular';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { vi, describe, it, expect } from 'vitest';

/**
 * Gold Standard: Angular Integration Test (Testing Library)
 * - Uses DOM-centric testing via `render` and `screen`
 * - Semantic selectors & data-testid
 * - Mocks HTTP service
 * - Verifies behavior, not implementation
 */

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="userForm" (ngSubmit)="submit()">
      <label for="username">Username</label>
      <input id="username" formControlName="username" />

      <button type="submit">Submit</button>

      @if (loading) {
        <span data-testid="loading">Saving...</span>
      }
      @if (error) {
        <p role="alert">{{ error }}</p>
      }
    </form>
  `,
})
class UserFormComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  loading = false;
  error = '';
  userForm = this.fb.group({
    username: ['', Validators.required],
  });

  submit() {
    if (this.userForm.invalid) return;

    this.loading = true;
    this.http.post('/api/user', this.userForm.value).subscribe({
      next: () => (this.loading = false),
      error: () => {
        this.loading = false;
        this.error = 'Failed to save';
      },
    });
  }
}

describe('UserFormComponent Integration', () => {
  const mockHttp = {
    post: vi.fn(),
  };

  it('should show loading state and hide it on success', async () => {
    mockHttp.post.mockReturnValue(of({}));

    await render(UserFormComponent, {
      imports: [ReactiveFormsModule],
      providers: [{ provide: HttpClient, useValue: mockHttp }],
    });

    const input = screen.getByLabelText(/username/i);
    const submitBtn = screen.getByRole('button', { name: /submit/i });

    // 1. Act: Type and Submit
    fireEvent.input(input, { target: { value: 'testuser' } });
    fireEvent.click(submitBtn);

    // 2. Assert: Loading appears
    expect(screen.getByTestId('loading')).toBeTruthy();

    // 3. Assert: Loading disappears (async)
    // Testing Library handles detection of changes automatically
    expect(screen.queryByTestId('loading')).toBeFalsy();
    expect(mockHttp.post).toHaveBeenCalledWith('/api/user', { username: 'testuser' });
  });

  it('should show error message when API fails', async () => {
    mockHttp.post.mockReturnValue(throwError(() => new Error('Server Error')));

    await render(UserFormComponent, {
      imports: [ReactiveFormsModule],
      providers: [{ provide: HttpClient, useValue: mockHttp }],
    });

    const input = screen.getByLabelText(/username/i);
    const submitBtn = screen.getByRole('button', { name: /submit/i });

    fireEvent.input(input, { target: { value: 'testuser' } });
    fireEvent.click(submitBtn);

    // Assert: Error message with role="alert" appears asynchronously
    const errorMsg = await screen.findByRole('alert');
    expect(errorMsg.textContent).toContain('Failed to save');
  });
});
