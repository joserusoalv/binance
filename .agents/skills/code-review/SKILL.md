---
name: Code Review Specialist
description: Checklist and best practices for high-quality enterprise code reviews.
---

# Code Review Skill

## 1. Context (Input)
Before starting a code review, I must:
- [ ] Check the `task.md` and feature-specific `tasks.md` to understand the goal.
- [ ] Identify the specific skills and blueprints relevant to the PR.
- [ ] Review previous feedback in the conversation to avoid repeating requests.

## 2. Contract (Output)
When performing a review, I will deliver:
- Actionable feedback on architectural consistency.
- Performance and accessibility optimization suggestions.
- Verification that all "Guardrails" have been followed.
- Updates to the task tracking files upon completion.

## 3. Guardrails
- **NEVER** nitpick on formatting; assume Prettier/Lint handles it.
- **NEVER** be subjective; back up every suggestion with project patterns or official documentation.
- **NEVER** approve a PR if a core "Guardrail" from any relevant skill is violated.
- **ALWAYS** check for "Dead Code" or unnecessary imports.
- **ALWAYS** ensure that public fields/methods have appropriate types and documentation.
- **ALWAYS** insist on native private fields (`#state`) for truly encapsulated state.

## 4. Gold Standard Patterns

### Key Snippet: Capsule Logic
```typescript
export class ExampleComponent {
  // ✅ DO: Use native private fields
  #internalState = signal(0);

  // ❌ DON'T: Use TypeScript private for runtime-visible state
  private oldPrivate = signal(0);
}
```

## 5. Verification (Checklist)
- [ ] Dependencies are injected using `inject()`.
- [ ] Subscriptions are managed (e.g., `takeUntilDestroyed`).
- [ ] Change detection is set to `OnPush`.
- [ ] Signals are used for state and `computed` for transformations.
- [ ] A11y rules (buttons vs links, aria-labels) are followed.
- [ ] `task.md` is updated correctly.
