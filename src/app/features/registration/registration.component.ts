import { ChangeDetectionStrategy, Component, viewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { DecimalPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  AddressData,
  AddressFormComponent,
} from './components/address-form/address-form.component';
import { FileUploaderComponent } from './components/file-uploader/file-uploader.component';
import { UserData, UserFormComponent } from './components/user-form/user-form.component';

@Component({
  selector: 'app-registration',
  template: `
    <div class="registration-container">
      <h1 class="registration-title">Registro de Usuario</h1>

      <mat-stepper #stepper linear="true">
        <mat-step [stepControl]="userForm.userForm" label="Datos Personales">
          <app-user-form #userForm (formSubmitted)="onStep1Submit($event)" />
        </mat-step>

        <mat-step [stepControl]="addressForm.addressForm" label="Dirección">
          <app-address-form
            #addressForm
            (formSubmitted)="onStep2Submit($event)"
            (backRequested)="stepper.previous()"
          />
        </mat-step>

        <mat-step [stepControl]="uploadForm" label="Documentación">
          <form [formGroup]="uploadForm" (ngSubmit)="onStep3Submit()" class="upload-form">
            <app-file-uploader formControlName="file" />
            
            <div class="stepper-actions">
              <button mat-stroked-button type="button" class="btn-pill" (click)="stepper.previous()">
                Atrás
              </button>
              <button mat-flat-button color="primary" type="submit" class="btn-pill" [disabled]="uploadForm.invalid">
                Siguiente
              </button>
            </div>
          </form>
        </mat-step>

        <mat-step label="Resumen">
          <div class="summary-container">
            <h2 class="summary-title">¡Registro completado!</h2>
            <div class="summary-card">
              <p><strong>Nombre:</strong> {{ step1Data?.name }}</p>
              <p><strong>Email:</strong> {{ step1Data?.email }}</p>
              <p><strong>Calle:</strong> {{ step2Data?.street }}</p>
              <p><strong>Ciudad:</strong> {{ step2Data?.city }}</p>
              <p><strong>Documento:</strong> {{ step3File?.name }} 
                <span class="file-size-hint">({{ (step3File?.size ?? 0) / 1024 | number:'1.0-1' }} KB)</span>
              </p>
            </div>
            <div class="summary-actions">
              <button
                mat-flat-button
                color="accent"
                (click)="resetFlow(stepper)"
              >
                Empezar de nuevo
              </button>
            </div>
          </div>
        </mat-step>
      </mat-stepper>
    </div>
  `,
  styles: `
    .registration-container {
      min-height: 80vh;
      display: flex;
      flex-direction: column;
      padding: 24px;
      max-width: 42rem; /* 672px max-w-2xl */
      margin: 0 auto;
    }
    .registration-title {
      font-size: 1.875rem; /* 3xl */
      line-height: 2.25rem;
      font-weight: 700;
      margin-bottom: 24px;
      text-align: center;
    }
    .upload-form {
      display: flex;
      flex-direction: column;
    }
    .stepper-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 16px;
      padding: 0 16px;
    }
    .btn-pill {
      border-radius: 9999px !important;
      padding-left: 24px !important;
      padding-right: 24px !important;
    }
    .summary-container {
      padding: 16px;
    }
    .summary-title {
      font-size: 1.25rem; /* xl */
      font-weight: 600;
      margin-bottom: 16px;
    }
    .summary-card {
      background-color: #f3f4f6;
      padding: 24px;
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .file-size-hint {
      font-size: 0.75rem;
      color: #6b7280;
    }
    .summary-actions {
      margin-top: 32px;
      display: flex;
      justify-content: center;
    }
    :host-context(.dark) .summary-card {
      background-color: #1f2937;
    }
  `,
  imports: [
    MatStepperModule, 
    UserFormComponent, 
    AddressFormComponent, 
    FileUploaderComponent,
    MatButtonModule,
    DecimalPipe,
    ReactiveFormsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationComponent {
  stepper = viewChild.required(MatStepper);

  step1Data: UserData | null = null;
  step2Data: AddressData | null = null;
  step3File: File | null = null;

  uploadForm = new FormGroup({
    file: new FormControl<File | null>(null, [Validators.required])
  });

  onStep1Submit(data: UserData) {
    this.step1Data = data;
    this.stepper().next();
  }

  onStep2Submit(data: AddressData) {
    this.step2Data = data;
    this.stepper().next();
  }

  onStep3Submit() {
    if (this.uploadForm.valid) {
      this.step3File = this.uploadForm.get('file')?.value ?? null;
      this.stepper().next();
    }
  }

  resetFlow(stepper: MatStepper) {
    stepper.reset();
    this.uploadForm.reset();
    this.step1Data = null;
    this.step2Data = null;
    this.step3File = null;
  }
}
