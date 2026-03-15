---
name: Angular Forms
description: Strict reactive forms standards with hard-typed contracts and Signal integration in Angular 21.
---

# Angular Forms Skill

## 1. Context (Input)

- [ ] **Contract Definition**: Explicitly define the `Value` interface (data) and the `Controls` interface (form structure) before coding.
- [ ] **Validation Strategy**: Identify which fields require sync vs. async validation.
- [ ] **A11y Map**: Verify the project's standard for linking error messages (IDs and `aria-describedby`).

## 2. Contract (Output)

- **Strictly Typed FormGroup**: Use of `FormGroup<T>` where `T` is a mandatory interface of controls.
- **Signal-Based View**: Form state and value changes exposed via `toSignal` for template consumption.
- **CVA Integration**: Reusable UI inputs must implement `ControlValueAccessor`.

## 3. Guardrails

- **NEVER** rely on implicit type inference for `FormGroup`. **ALWAYS** type it explicitly to block unauthorized control injection.
- **NEVER** use `FormGroup.get('key')`. Use the type-safe `form.controls.key`.
- **NEVER** use `patchValue` inside an `effect` for initialization. Use **`linkedSignal`** to reset/sync form state with external inputs.
- **ALWAYS** use `NonNullableFormBuilder` (via `fb.nonNullable`) to ensure type consistency and avoid `null` leaks.
- **ALWAYS** link error messages to inputs using `aria-describedby` for WCAG AA compliance.

## 4. Gold Standard Patterns

Refer to this blueprint for the strict implementation of typed forms:

- [Reactive Form Blueprint](./blueprints/reactive-form.md)

## 5. Verification (Checklist)

- [ ] `FormGroup` is explicitly bound to a `Controls` interface.
- [ ] `NonNullableFormBuilder` is injected and used for all initializations.
- [ ] Form values are converted to signals via `toSignal(form.valueChanges)`.
- [ ] No `any` or manual type casting exists in the form logic.
- [ ] Submission logic handles `form.pending` (for async validators) and `form.invalid`.
