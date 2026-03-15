---
name: Angular Signal Forms
description: Best practices and patterns for the experimental Signal Forms API in Angular 21.
---

# Angular Signal Forms Skill (Experimental)

> [!IMPORTANT]
> Signal Forms are currently **experimental** in Angular 21. The API is subject to change.

## 1. Context (Input)
Before starting with Signal Forms, I must:
- [ ] Ensure the project has `@angular/forms/signals` available.
- [ ] Verify that the form data model is a `WritableSignal`.
- [ ] Determine if complex validation messages are required from the start.

## 2. Contract (Output)
When implementing Signal Forms, I will deliver:
- A `form()` instance with a defined schema and submission logic.
- Templates using `[formRoot]` and `[formField]` directives.
- Declarative validation using signal-based validators (`required()`, `email()`, etc.).
- Reactive UI that updates based on field signals like `touched()`, `invalid()`, and `errors()`.

## 3. Guardrails
- **NEVER** use manual `(submit)` event listeners; use the `submission` property in `form()`.
- **NEVER** use `ReactiveFormsModule` directives (`formGroup`, `formControlName`) with Signal Forms.
- **NEVER** modify the model signal directly to trigger validation; use the form's control mechanisms.
- **ALWAYS** define custom error messages within the `form()` schema function.
- **ALWAYS** check `field().touched()` before showing validation errors to avoid premature alerts.

## 4. Gold Standard Patterns
Refer to these blueprints:
- [Signal Form Blueprint](./blueprints/signal-form.md)

### Key Snippet: Root Form
```typescript
protected userForm = form(
  this.userModel,
  (schema) => {
    required(schema.name, { message: 'Name is required' });
    email(schema.email, { message: 'Invalid email' });
  },
  {
    submission: {
      action: async (field) => {
        // Handle valid submission
        await this.api.save(field().value);
        return undefined;
      }
    }
  }
);
```

## 5. Verification (Checklist)
- [ ] `[formRoot]` is present on the `<form>` element.
- [ ] `[formField]` is used for all input bindings.
- [ ] `touched()` and `invalid()` are checked before displaying errors.
- [ ] Validation messages are retrieved from the `errors()` signal.
- [ ] No `(submit)` listener is present if `action` is configured.
- [ ] `WritableSignal` is used for the model.
