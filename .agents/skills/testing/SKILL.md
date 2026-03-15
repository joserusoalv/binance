---
name: Integration Testing
description: Best practices for component integration testing using Testing Library for Angular.
---

# Integration Testing Skill

## 1. Context (Input)
Before writing tests, I must:
- [ ] Identify the core user behaviors to be tested (not internal logic).
- [ ] Check if the component has inputs/outputs that need mocking.
- [ ] Identify any asynchronous operations (API calls, timers) that require `findBy` or `wait`.

## 2. Contract (Output)
When writing tests, I will deliver:
- Resilient, DOM-centric tests using `@testing-library/angular`.
- Tests that interact with the UI via `screen` and `userEvent`.
- Accessible selectors (`getByRole`, `getByLabelText`).
- Proper handling of asynchronous elements and states.

## 3. Guardrails
- **NEVER** test private methods or internal state variables.
- **NEVER** use CSS selectors (`.btn`, `#id`); use semantic roles or labels.
- **NEVER** manually call `fixture.detectChanges()` unless absolutely necessary for complex reactive side effects.
- **ALWAYS** use `screen` for querying the DOM.
- **ALWAYS** use `findBy` queries for elements that appear asynchronously.
- **ALWAYS** mock external services (APIs) to ensure test isolation.

## 4. Gold Standard Patterns
Refer to these blueprints:
- [Integration Test Blueprint](./blueprints/integration-test.md)

### Key Snippet: Query Priority
```typescript
// 1. Semantic (Preferred)
screen.getByRole('button', { name: /save/i });
screen.getByLabelText(/email/i);

// 2. Visible Text
screen.getByText(/data saved successfully/i);

// 3. Test ID (Last Resort)
screen.getByTestId('loading-spinner');
```

## 5. Verification (Checklist)
- [ ] `render(Component)` is used for setup.
- [ ] `fireEvent` or `userEvent` is used for interactions.
- [ ] Assertions verify what the user sees/experiences.
- [ ] Tests remain green after internal code refactoring.
- [ ] Async elements are handled with `await screen.findBy...`.
