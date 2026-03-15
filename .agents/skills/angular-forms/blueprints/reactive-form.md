# Blueprint: Reactive Form

This blueprint demonstrates the gold standard for a Reactive Form in Angular 21.

## Key Features

- Strictly typed `FormGroup` using an interface
- Control access via `.controls`
- Custom validation factory
- Signal-based value tracking
- Abstracted error UI (`app-form-errors`)

## Code Snippet

```typescript
// 1. HARD CONTRACT: No extra fields allowed, no nulls allowed.
export interface RegistrationForm {
  username: FormControl<string>;
  email: FormControl<string>;
  options: FormGroup<{
    notifications: FormControl<boolean>;
  }>;
}

/** * Custom Validator Factory
 * Standardized to return ValidationErrors or null
 */
export function forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const forbidden = nameRe.test(control.value);
    return forbidden ? { forbiddenName: { value: control.value } } : null;
  };
}

@Component({
  selector: 'app-registration-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormErrorsComponent],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div class="field">
        <label for="username">Username</label>
        <input
          id="username"
          type="text"
          formControlName="username"
          [attr.aria-invalid]="form.controls.username.invalid"
        />
        <app-form-errors [control]="form.controls.username" />
      </div>

      <div class="field">
        <label for="email">Email</label>
        <input id="email" type="email" formControlName="email" />
        <app-form-errors [control]="form.controls.email" />
      </div>

      <button type="submit" [disabled]="isInvalid()">Register</button>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationFormComponent {
  // Use NonNullable version directly for cleaner syntax
  private fb = inject(NonNullableFormBuilder);

  // STRICT: Typed Group with explicit initialization
  readonly form: FormGroup<RegistrationForm> = this.fb.group({
    username: this.fb.control('', [Validators.required, forbiddenNameValidator(/admin/i)]),
    email: this.fb.control('', [Validators.required, Validators.email]),
    options: this.fb.group({
      notifications: this.fb.control(true),
    }),
  });

  // Signal bridge for the template and logic
  readonly formValue = toSignal(this.form.valueChanges, {
    initialValue: this.form.getRawValue(),
  });

  readonly status = toSignal(this.form.statusChanges, {
    initialValue: this.form.status,
  });

  readonly isInvalid = computed(() => this.status() === 'INVALID');

  onSubmit() {
    if (this.form.valid) {
      const payload = this.form.getRawValue(); // Payload matches UserValue interface
      console.log('Form Submitted:', payload);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
```
