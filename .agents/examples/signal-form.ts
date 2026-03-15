import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { email, form, FormField, FormRoot, required } from '@angular/forms/signals';

/**
 * Example of a gold-standard Signal Form in Angular 21.
 * This demonstrates the experimental API which simplifies form handling
 * using signals as the source of truth.
 *
 * NOTE: Signal Forms is an experimental API.
 */
@Component({
  selector: 'app-signal-form-example',
  standalone: true,
  imports: [FormField, JsonPipe, FormRoot],
  template: `
    <form [formRoot]="userForm">
      <div>
        <label for="name">Name:</label>
        <input id="name" [formField]="userForm.fields.name" />
        @if (userForm.fields.name().touched() && userForm.fields.name().invalid()) {
          <ul class="error-list">
            @for (error of userForm.fields.name().errors(); track error) {
              <li>{{ error.message }}</li>
            }
          </ul>
        }
      </div>

      <div>
        <label for="email">Email:</label>
        <input id="email" [formField]="userForm.fields.email" />
        @if (userForm.fields.email().touched() && userForm.fields.email().invalid()) {
          <ul class="error-list">
            @for (error of userForm.fields.email().errors(); track error) {
              <li>{{ error.message }}</li>
            }
          </ul>
        }
      </div>

      <!-- Call the root form as a function to access its aggregate state -->
      <button type="submit" [disabled]="userForm().invalid()">Submit</button>
    </form>

    <div class="result">
      <h3>Model State:</h3>
      <pre>{{ userModel() | json }}</pre>
    </div>
  `,
  styles: `
    .error,
    .error-list {
      color: #ff4444;
      font-size: 0.8rem;
      margin-top: 4px;
      display: block;
    }
    .error-list {
      margin: 4px 0 0 0;
      padding-left: 20px;
    }
    .error-list li {
      margin-bottom: 2px;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-width: 300px;
    }
    input {
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    button {
      padding: 8px 16px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
    .result {
      margin-top: 2rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 4px;
    }
  `,
})
export class SignalFormExampleComponent {
  // 1. Define the data model as a writable signal
  protected userModel = signal({
    name: 'John Doe',
    email: 'john@example.com',
  });

  // 2. Initialize the signal form
  // The 'form' function creates a FieldTree.
  // Explicit validators for the fields
  protected userForm = form(
    this.userModel,
    (schemaPath) => {
      required(schemaPath.name, { message: 'Name is required' });
      required(schemaPath.email, { message: 'Email is required' });
      email(schemaPath.email, { message: 'Enter a valid email address' });
    },
    {
      submission: {
        action: async (field) => {
          console.log('Submitting form with value:', field().value);
          return undefined; // No errors
        },
        onInvalid: async (field) => {
          console.log('Form is invalid', field().errors());
        },
      },
    },
  );
}
