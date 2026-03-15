---
name: Integration Testing
description: Best practices for component integration testing using Testing Library for Angular.
---

# Integration Testing Best Practices (Testing Library)

Focus on testing component behavior through the DOM using `@testing-library/angular`. This approach ensures tests are resilient, accessible, and reflect real user experience.

## Core Philosophy

1.  **DOM-Centric**: Interact via user actions using `screen` and `fireEvent`.
2.  **Semantic Queries**: Favor accessibility-based selectors over implementation details.
3.  **Encapsulation**: Avoid accessing `componentInstance`. Test what is visible to the user.
4.  **Resilience**: Tests shouldn't break when you refactor internal logic, only when behavior changes.
5.  **Simplicity**: Testing Library manages change detection automatically for most interactions.

## Querying the DOM

Use the `screen` object for queries. Preference order:

1.  **getByRole**: `screen.getByRole('button', { name: /submit/i })`
2.  **getByLabelText**: `screen.getByLabelText(/username/i)`
3.  **getByPlaceholderText**: `screen.getByPlaceholderText(/search/i)`
4.  **getByText**: `screen.getByText(/success/i)`
5.  **getByTestId**: `screen.getByTestId('loading-spinner')`

## Asynchronous Handling

Use `findBy` queries for elements that appear asynchronously:
```typescript
const alert = await screen.findByRole('alert');
```

## Do's and Don'ts

### ✅ Do
-   Use `render(Component, { ... })` to set up the test environment.
-   Use `fireEvent` to simulate user interactions (click, input, change).
-   Verify that error messages are visible and have correct ARIA roles.

### ❌ Don't
-   Don't manually call `fixture.detectChanges()` unless absolutely necessary.
-   Avoid CSS selectors (`.btn`, `#id`). Use semantic selectors instead.
-   Don't test private methods or internal state variables.
## References
- [Integration Test Blueprint](./blueprints/integration-test.md)
