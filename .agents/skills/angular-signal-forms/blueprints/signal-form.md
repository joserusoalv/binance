# Blueprint: Signal Form (Experimental)

This blueprint demonstrates the gold standard for a Signal Form in Angular 21 using the experimental API.

## Key Features
- Experimental Signal-based form handling
- Signals as the source of truth
- Abstracted error UI (`app-form-errors`)

## Code Snippet

```typescript
@Component({
  selector: 'app-signal-form-example',
  imports: [FormField, JsonPipe, FormRoot, FormErrorsComponent],
  template: `
    <form [formRoot]="userForm">
      <div>
        <label for="name">Name:</label>
        <input id="name" [formField]="userForm.fields.name" />
        <app-form-errors [field]="userForm.fields.name" />
      </div>

      <div>
        <label for="email">Email:</label>
        <input id="email" [formField]="userForm.fields.email" />
        <app-form-errors [field]="userForm.fields.email" />
      </div>

      <button type="submit" [disabled]="userForm().invalid()">Submit</button>
    </form>
  `
})
export class SignalFormExampleComponent {
  protected userModel = signal({
    name: 'John Doe',
    email: 'john@example.com',
  });

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
          return undefined; 
        },
        onInvalid: async (field) => {
          console.log('Form is invalid', field().errors());
        },
      },
    },
  );
}
```
