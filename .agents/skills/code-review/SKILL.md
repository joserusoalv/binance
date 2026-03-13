---
name: Code Review Specialist
description: Checklist and best practices for high-quality enterprise code reviews.
---

# Code Review Specialist

Focus on architectural consistency, performance, and accessibility during peer reviews.

## Architectural Consistency

1.  **Task Management**: Is the current task being tracked? **Update `task.md` and feature-specific `tasks.md` AS SOON AS a task is completed.**
2.  **Component Responsibility**: Does the component do too much? (Should be split if >300 lines).
3.  **Inversion of Control**: Are dependencies injected properly? (Avoid `new Service()`).
4.  **Encapsulation**: MUST use native private fields (`#state`) over TypeScript `private` for truly private state.
4.  **Signal Usage**: Are we using Signals for state and `computed` for derived data? Avoid `manual effects` where possible.

## Performance Checklist

1.  **Subscription Management**: Are RxJS subscriptions closed? (Use `takeUntilDestroyed` or pipe to Signals).
2.  **Change Detection**: Is `OnPush` strategy being used where appropriate?
3.  **Expensive Computations**: Are heavy functions wrapped in `computed` signals to avoid re-calculation?
4.  **Signal Updates**: Ensure we are not triggering circular signal updates.

## Accessibility (A11y)

1.  **Semantic HTML**: Are we using buttons for actions and links for navigation?
2.  **ARIA Roles**: Do interactive elements have appropriate `aria-label` or `role`?
3.  **Keyboard Navigation**: Can the feature be navigated using only the keyboard?

## Do's and Don'ts

### ✅ Do
-   Suggest improvements that increase maintainability.
-   Look for "Dead Code" or unused imports.
-   Ensure all public APIs have basic documentation/types.

### ❌ Don't
-   Nitpick on formatting (let Prettier handle it).
-   Be subjective; back up suggestions with documentation or patterns from `AGENTS.md`.
