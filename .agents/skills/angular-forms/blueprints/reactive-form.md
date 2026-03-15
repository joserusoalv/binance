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
export interface RegistrationForm {
  username: FormControl<string>;
  email: FormControl<string>;
  options: FormGroup<{
    notifications: FormControl<boolean>;
  }>;
}

export function forbiddenNameValidator(nameRe: RegExp) {
  return (control: AbstractControl) => {
    const forbidden = nameRe.test(control.value);
    return forbidden ? { forbiddenName: { value: control.value } } : null;
  };
}

@Component({
  selector: 'app-registration-form',
  imports: [CommonModule, ReactiveFormsModule, FormErrorsComponent],
  template: `
    <form [formGroup]="registrationForm" (ngSubmit)="onSubmit()">
      <div class="form-field">
        <label for="username">Username</label>
        <input id="username" type="text" formControlName="username" />
        <app-form-errors [control]="usernameControl" />
      </div>

      <div class="form-field">
        <label for="email">Email</label>
        <input id="email" type="email" formControlName="email" />
        <app-form-errors [control]="registrationForm.controls.email" />
      </div>

      <button type="submit" [disabled]="registrationForm.invalid">Register</button>
    </form>
  `
})
export class RegistrationFormComponent {
  private fb = inject(FormBuilder);

  registrationForm = this.fb.nonNullable.group<RegistrationForm>({
    username: this.fb.nonNullable.control('', [
      Validators.required,
      forbiddenNameValidator(/admin/i),
    ]),
    email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
    options: this.fb.nonNullable.group({
      notifications: [true],
    }),
  });

  get usernameControl() {
    return this.registrationForm.controls.username;
  }

  formValue = toSignal(this.registrationForm.valueChanges, {
    initialValue: this.registrationForm.value,
  });

  onSubmit() {
    if (this.registrationForm.valid) {
      console.log('Form Submitted:', this.registrationForm.getRawValue());
    }
  }
}
```
