import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

/**
 * Gold Standard: Angular 21 Reactive Form
 * - Strictly typed FormGroup using an interface
 * - Control access via .controls
 * - Custom validation factory
 * - Signal-based value tracking
 * - Accessible error handling
 */

// 1. Define the Form Type/Interface
export interface RegistrationForm {
  username: FormControl<string>;
  email: FormControl<string>;
  options: FormGroup<{
    notifications: FormControl<boolean>;
  }>;
}

// Custom Validator Factory
export function forbiddenNameValidator(nameRe: RegExp) {
  return (control: AbstractControl) => {
    const forbidden = nameRe.test(control.value);
    return forbidden ? { forbiddenName: { value: control.value } } : null;
  };
}

@Component({
  selector: 'app-registration-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="registrationForm" (ngSubmit)="onSubmit()">
      <div class="form-field">
        <label for="username">Username</label>
        <input
          id="username"
          type="text"
          formControlName="username"
          [attr.aria-invalid]="usernameControl.invalid && usernameControl.touched"
          [attr.aria-describedby]="usernameControl.invalid ? 'username-error' : null"
        />
        @if (usernameControl.invalid && usernameControl.touched) {
          <span id="username-error" class="error">
            Username is required and cannot be 'admin'.
          </span>
        }
      </div>

      <div class="form-field">
        <label for="email">Email</label>
        <input id="email" type="email" formControlName="email" />
      </div>

      <button type="submit" [disabled]="registrationForm.invalid">Register</button>

      <div class="debug-info">
        <h3>Live Value (Signal):</h3>
        <pre>{{ formValue() | json }}</pre>
      </div>
    </form>
  `,
  styles: [
    `
      .error {
        color: red;
        font-size: 0.8rem;
      }
      .form-field {
        margin-bottom: 1rem;
        display: flex;
        flex-direction: column;
      }
    `,
  ],
})
export class RegistrationFormComponent {
  private fb = inject(FormBuilder);

  // 2. Initialize with strict typing and non-nullable by default
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

  // 3. Control Access via .controls property
  get usernameControl() {
    return this.registrationForm.controls.username;
  }

  // Bridging form value to Signal
  formValue = toSignal(this.registrationForm.valueChanges, {
    initialValue: this.registrationForm.value,
  });

  onSubmit() {
    if (this.registrationForm.valid) {
      console.log('Form Submitted:', this.registrationForm.getRawValue());
    }
  }
}
