---
name: Angular Signal Forms
description: Best practices and patterns for the experimental Signal Forms API in Angular 21.
---

# Angular Signal Forms Skill (Experimental)

> [!IMPORTANT]
> Signal Forms are currently **experimental** in Angular 21. The API is subject to change.

## Core Principles

- **Single Source of Truth**: Use a writable signal to hold the form's data model.
- **Declarative Validation**: Define validation rules and messages within the `form()` schema function.
- **Bi-directional Binding**: Use the `[formField]` directive (preferred) for connecting template elements to the model.
- **Reactive State**: Access form and field state (validity, touched, etc.) through signals.
- **Type Safety**: Leverage TypeScript to ensure strict typing of models and templates.

## Key APIs (`@angular/forms/signals`)

- `form(model, schema?, options?)`: Creates a signal-based form instance.
- `[formRoot]`: Directive to bind a root `FieldTree` to a `<form>` element. Automatically handles the `submit` event.
- `[formField]`: Directive to bind an input to a field in the signal model.
- `required()`, `email()`, `minLength()`, `maxLength()`, `pattern()`, etc.: Signal-based validators.
- `submit(fieldTree, options)`: Function to programmatically trigger form submission.

## Best Practices

### 1. Form Configuration & Submission
The `form()` function takes three arguments:
- **Model**: A `WritableSignal` containing the data.
- **Schema**: A function to define validators and messages.
- **Options**: Includes `submission` configuration for automated handling.

Using `[formRoot]` in the template automatically connects the form's `submit` event to the `submission` configuration, eliminating the need for manual event listeners.

```typescript
protected userForm = form(
  this.userModel,
  (schema) => {
    required(schema.name, { message: 'Name is required' });
  },
  {
    submission: {
      action: async (field) => {
        // Handle valid submission
        console.log('Valid submission:', field().value);
        return undefined; 
      },
      onInvalid: async (field) => {
        // Handle invalid submission attempt
        console.log('Invalid submission attempt:', field().errors());
      }
    }
  }
);
```

```html
<form [formRoot]="userForm">
  <!-- Fields go here -->
  <button type="submit">Submit</button>
</form>
```

### 2. Validation Display Pattern
Access validation messages defined in the schema by iterating over the `errors` signal of a field.

```html
@if (userForm.fields.name().touched() && userForm.fields.name().invalid()) {
  <ul class="error-list">
    @for (error of userForm.fields.name().errors(); track error) {
      <li>{{ error.message }}</li>
    }
  </ul>
}
```

### 3. Field and Form State
Call the field or form as a function to access its state signals:
- `userForm()`: Aggregate form state.
- `userForm.fields.name()`: Individual field state.
- Common signals: `valid()`, `invalid()`, `touched()`, `dirty()`, `pending()`, `errors()`.

## Checklist

- [ ] Form model is a `WritableSignal`.
- [ ] Validators are imported from `@angular/forms/signals`.
- [ ] Custom messages are defined in the `form()` schema.
- [ ] Template uses `[formRoot]` and `[formField]`.
- [ ] Template uses `@if` (touched/invalid) and `@for` (errors) for validation messages.
- [ ] Submission is handled via the `action` and `onInvalid` properties in the `submission` option.
- [ ] No manual `(submit)` event listeners are used if `submission` options are provided.

## References
- [Signal Form Blueprint](./blueprints/signal-form.md)
