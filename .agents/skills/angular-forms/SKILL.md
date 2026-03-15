---
name: Angular Forms
description: Best practices for Reactive Forms, validation, and CVA in Angular 21.
---

# Angular Forms Skill

## 1. Context (Input)

Before starting form-related work, I must:

- [ ] Check if a data model (interface) already exists for the form values.
- [ ] Verify if the project uses a custom `FormErrorsComponent` or similar for error display.
- [ ] Identify if there are existing custom validators that can be reused.

## 2. Contract (Output)

When implementing a form, I will deliver:

- A strictly typed `FormGroup` (or `FormArray`/`FormControl`).
- An interface/type defining the form's value structure.
- Accessible templates with proper labels and error associations.
- Clean integration with components using `OnPush` and Signals.

## 3. Guardrails

- **NEVER** use Template-driven forms (`ngModel` in forms).
- **NEVER** use `any` for form types; use explicit interfaces.
- **NEVER** use `this.form.get('key')`; always use `this.form.controls.key` for type safety.
- **ALWAYS** use `nonNullable` controls/groups via `NonNullableFormBuilder`.
- **ALWAYS** add `Validators.required` to optional fields that shouldn't be null but can be empty.

## 4. Gold Standard Patterns

The primary source of truth for implementation is the:

- [Reactive Form Blueprint](./blueprints/reactive-form.md)

### Key Snippet: Typed Group

```typescript
interface UserForm {
  name: FormControl<string>;
  age: FormControl<number>;
}

const fb = inject(NonNullableFormBuilder);

const form = fb.group<UserForm>({
  name: fb.control(''),
  age: fb.control(0),
});
```

## 5. Verification (Checklist)

- [ ] `ReactiveFormsModule` is imported in the component.
- [ ] `FormGroup` is typed with a dedicated interface.
- [ ] `this.fb.nonNullable` is used for initialization.
- [ ] Error messages use `aria-describedby` for accessibility.
- [ ] Submit button is disabled based on `form.invalid` or `form.pending`.
- [ ] Values are reactive (e.g., using `toSignal(form.valueChanges)`).
