# Blueprint: Integration Test (Testing Library)

This blueprint demonstrates the gold standard for an Angular Integration Test using Testing Library.

## Key Features
- Uses DOM-centric testing via `render` and `screen`
- Semantic selectors & `data-testid`
- Mocks HTTP service
- Minimal UI logic in the test component

## Code Snippet

```typescript
@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <form [formGroup]="userForm" (ngSubmit)="submit()">
      <label for="username">Username</label>
      <input id="username" formControlName="username" />

      <button type="submit">Submit</button>

      @if (loading) {
        <span data-testid="loading">Saving...</span>
      }
      <app-error-display [error]="error" />
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

    fireEvent.input(input, { target: { value: 'testuser' } });
    fireEvent.click(submitBtn);

    expect(screen.getByTestId('loading')).toBeTruthy();
    expect(screen.queryByTestId('loading')).toBeFalsy();
    expect(mockHttp.post).toHaveBeenCalledWith('/api/user', { username: 'testuser' });
  });
});
```
