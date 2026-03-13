import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface UserData {
  name: string;
  email: string;
}

@Component({
  selector: 'app-user-form',
  template: `
    <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="form-container">
      <mat-form-field appearance="outline">
        <mat-label>Nombre</mat-label>
        <input matInput formControlName="name" placeholder="Tu nombre completo" />
        @if (userForm.get('name')?.invalid && userForm.get('name')?.touched) {
          <mat-error>El nombre es obligatorio</mat-error>
        }
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Email</mat-label>
        <input matInput type="email" formControlName="email" placeholder="tu@email.com" />
        @if (userForm.get('email')?.invalid && userForm.get('email')?.touched) {
          <mat-error>Introduce un email válido</mat-error>
        }
      </mat-form-field>

      <div class="actions justify-end">
        <button mat-flat-button color="primary" type="submit" [disabled]="userForm.invalid">
          Siguiente
        </button>
      </div>
    </form>
  `,
  styles: `
    .form-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px;
    }
    .actions {
      display: flex;
      gap: 16px;
    }
    .justify-end {
      justify-content: flex-end;
    }
  `,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserFormComponent {
  formSubmitted = output<UserData>();

  userForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] })
  });

  onSubmit() {
    if (this.userForm.valid) {
      this.formSubmitted.emit(this.userForm.getRawValue());
    }
  }
}

