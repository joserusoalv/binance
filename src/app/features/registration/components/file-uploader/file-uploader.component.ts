import { DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  forwardRef,
  signal,
  viewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-file-uploader',
  template: `
    <div class="uploader-container">
      <div
        class="drop-zone"
        [class.is-over]="isOver()"
        [class.has-error]="hasError()"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        (drop)="onDrop($event)"
        (click)="!selectedFile() && fileInput().nativeElement.click()"
      >
        <input
          #fileInputRef
          type="file"
          class="hidden-input"
          (change)="onFileSelected($event)"
          accept="image/*,application/pdf"
        />

        @if (selectedFile()) {
          <button
            mat-icon-button
            type="button"
            class="remove-btn"
            (click)="$event.stopPropagation(); removeFile()"
          >
            <mat-icon class="remove-icon">close</mat-icon>
          </button>

          <div class="file-info-container">
            <div class="file-icon-wrapper">
              <mat-icon class="file-icon">insert_drive_file</mat-icon>
            </div>
            <p class="file-name">
              {{ selectedFile()?.name }}
            </p>
            <p class="file-size">
              {{ (selectedFile()?.size ?? 0) / 1024 | number: '1.0-2' }} KB
            </p>
          </div>
        } @else {
          <div class="empty-state">
            <div class="upload-icon-wrapper">
              <mat-icon class="upload-icon">cloud_upload</mat-icon>
            </div>
            <p class="empty-title">Arrastra un archivo aquí</p>
            <p class="empty-subtitle">o haz clic para buscar</p>
            @if (hasError()) {
              <p class="error-message">Archivo no válido (solo PDF o imágenes)</p>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    .uploader-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px;
    }

    .hidden-input {
      display: none;
    }

    .drop-zone {
      border: 3px dashed #cbd5e1;
      border-radius: 16px;
      padding: 32px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      cursor: pointer;
      position: relative;
      min-height: 180px;
      text-align: center;
      background-color: #f8fafc;
    }
    
    .drop-zone:hover .upload-icon-wrapper {
      background-color: rgba(63, 81, 181, 0.1);
    }
    
    .drop-zone:hover .upload-icon {
      color: #3f51b5;
    }

    .drop-zone.is-over {
      border-color: #3f51b5;
      border-style: solid;
      background-color: rgba(63, 81, 181, 0.04);
      transform: scale(1.01);
    }

    .drop-zone.has-error {
      border-color: #ef4444;
      background-color: rgba(239, 68, 68, 0.02);
    }
    
    .remove-btn {
      position: absolute !important;
      top: 8px;
      right: 8px;
      background-color: rgba(255, 255, 255, 0.9) !important;
      z-index: 10;
      box-shadow: 0 1px 2px rgba(0,0,0,0.1);
    }
    .remove-icon {
      color: #ef4444 !important;
    }

    .file-info-container, .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      animation: fadeIn 0.3s ease-in-out;
    }

    .file-icon-wrapper, .upload-icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 64px;
      border-radius: 50%;
      margin-bottom: 12px;
      transition: all 0.3s ease;
    }
    .file-icon-wrapper {
      background-color: rgba(63, 81, 181, 0.1);
    }
    .upload-icon-wrapper {
      background-color: #f1f5f9;
    }

    .file-icon, .upload-icon {
      font-size: 40px !important;
      width: 40px !important;
      height: 40px !important;
      transition: color 0.3s ease;
    }
    .file-icon {
      color: #3f51b5;
    }
    .upload-icon {
      color: #94a3b8;
    }

    .file-name {
      color: #3f51b5;
      font-weight: 600;
      margin: 0 0 4px 0;
      max-width: 200px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .file-size, .empty-subtitle {
      font-size: 0.75rem;
      color: #6b7280;
      font-weight: 500;
      margin: 0;
    }
    .empty-title {
      font-weight: 600;
      margin: 0 0 4px 0;
    }
    .error-message {
      color: #ef4444;
      font-size: 0.75rem;
      font-weight: 500;
      margin-top: 8px;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }

    :host-context(.dark) .drop-zone {
      border-color: rgba(255, 255, 255, 0.2);
      background-color: rgba(255, 255, 255, 0.02);
    }
    :host-context(.dark) .upload-icon-wrapper {
      background-color: rgba(255, 255, 255, 0.05);
    }
    :host-context(.dark) .remove-btn {
      background-color: rgba(31, 41, 55, 0.9) !important;
    }
  `,
  imports: [ReactiveFormsModule, MatButtonModule, MatIconModule, DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUploaderComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => FileUploaderComponent),
      multi: true,
    },
  ],
})
export class FileUploaderComponent implements ControlValueAccessor, Validator {
  fileInput = viewChild.required<ElementRef<HTMLInputElement>>('fileInputRef');

  selectedFile = signal<File | null>(null);
  isOver = signal(false);
  hasError = signal(false);

  // MIME types allowed
  private allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];

  private onChange: (value: File | null) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(file: File | null): void {
    this.selectedFile.set(file);
    if (!file && this.fileInput()) {
      this.fileInput().nativeElement.value = '';
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Implement if needed
  }

  validate(): ValidationErrors | null {
    const file = this.selectedFile();
    if (!file) {
      return { required: true };
    }
    if (!this.allowedTypes.includes(file.type)) {
      return { invalidType: true };
    }
    return null;
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isOver.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isOver.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isOver.set(false);

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  private handleFile(file: File) {
    this.onTouched();
    if (this.allowedTypes.includes(file.type)) {
      this.hasError.set(false);
      this.selectedFile.set(file);
      this.onChange(file);
    } else {
      this.hasError.set(true);
      this.selectedFile.set(null);
      this.onChange(null);
      this.fileInput().nativeElement.value = '';
    }
  }

  removeFile() {
    this.selectedFile.set(null);
    this.hasError.set(false);
    this.onChange(null);
    this.onTouched();
    this.fileInput().nativeElement.value = '';
  }
}
