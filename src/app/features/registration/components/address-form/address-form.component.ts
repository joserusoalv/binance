import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface AddressData {
  street: string;
  city: string;
}

@Component({
  selector: 'app-address-form',
  template: `
    <form [formGroup]="addressForm" (ngSubmit)="onSubmit()" class="form-container">
      <mat-form-field appearance="outline">
        <mat-label>Calle</mat-label>
        <input matInput formControlName="street" placeholder="Ej. Calle Mayor 1" />
        @if (addressForm.get('street')?.invalid && addressForm.get('street')?.touched) {
          <mat-error>La calle es obligatoria</mat-error>
        }
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Ciudad</mat-label>
        <input matInput formControlName="city" placeholder="Ej. Madrid" />
        @if (addressForm.get('city')?.invalid && addressForm.get('city')?.touched) {
          <mat-error>La ciudad es obligatoria</mat-error>
        }
      </mat-form-field>

      <div class="actions space-between">
        <button mat-stroked-button type="button" (click)="onBack()">
          Atrás
        </button>
        <button mat-flat-button color="primary" type="submit" [disabled]="addressForm.invalid">
          Finalizar
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
    .space-between {
      justify-content: space-between;
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
export class AddressFormComponent {
  formSubmitted = output<AddressData>();
  backRequested = output<void>();

  addressForm = new FormGroup({
    street: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    city: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });

  onSubmit() {
    if (this.addressForm.valid) {
      this.formSubmitted.emit(this.addressForm.getRawValue());
    }
  }

  onBack() {
    this.backRequested.emit();
  }
}
