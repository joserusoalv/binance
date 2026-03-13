---
name: Angular Forms
description: Best practices for Reactive Forms, validation, and CVA in Angular 21.
---

# Angular Forms Skill

## Core Principles

- **Prefer Reactive Forms**: Always use `ReactiveFormsModule` over template-driven forms for better testability and control.
- **Strictly Typed Forms**:
  - Always define a dedicated interface or type for the form value.
  - Use `FormControl`, `FormGroup`, and `FormArray` with explicit types.
  - Prefer `NonNullableFormBuilder` (e.g., `this.fb.nonNullable.group(...)`) to avoid repetitive `nonNullable: true` configurations.
- **Control Access**:
  - Prefer `this.form.controls.name` over `this.form.get('name')`.
  - Use getters for frequently accessed controls to keep templates clean.
- **Validation**:
  - Use built-in `Validators`.
  - Implement custom validators as factory functions for reusability.
  - Handle async validation with care to avoid performance issues.
- **Custom Controls**: Use `ControlValueAccessor` (CVA) for building reusable form components.
- **Signals Integration**:
  - Use `toSignal(form.valueChanges)` to expose form state as signals.
  - Avoid direct manual subscriptions; prefer declarative approaches.

## Checklist

- [ ] Form controls are properly typed.
- [ ] Error messages are displayed accessibly (`aria-describedby`).
- [ ] Submit button is disabled while form is invalid or pending.
- [ ] Subscriptions to `valueChanges` or `statusChanges` are properly cleaned up.

## References
- [Complete Reactive Form Example](../../examples/reactive-form.ts)
