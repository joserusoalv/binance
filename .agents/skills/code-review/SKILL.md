---
name: Code Review Specialist
description: Checklist and best practices for high-quality enterprise code reviews in Angular 21.
---

# Code Review Skill (Enterprise Grade)

## 1. Context (Input)

- [ ] **Functional Alignment**: Does the code solve the problem described in `task.md`?
- [ ] **Scope Creep**: Are there changes unrelated to the feature? Refactors must be in separate PRs.
- [ ] **Context Awareness**: Check if the PR affects shared services, global styles, or public APIs.

## 2. Contract (Output)

- **Constructive Critique**: Non-judgmental but technically rigorous feedback.
- **Reference-Backed**: Every "Change requested" must cite a **Skill Guardrail** or a **Blueprint**.
- **Impact Assessment**: Explicitly mention if the change affects performance (Lighthouse), bundle size, or A11y.

## 3. Guardrails

- **NEVER** nitpick on formatting; assume Prettier/Lint handles it.
- **NEVER** approve a PR with `console.log`, `debugger`, or `TODO` comments.
- **NEVER** accept "Magic Numbers" or hardcoded strings; insist on `const`, `enums`, or config files.
- **NEVER** approve a component missing required `A11y` attributes (e.g., `aria-label` on icon-buttons).
- **ALWAYS** check for **Race Conditions** in `async` logic or `httpResource` usage.
- **ALWAYS** insist on **Atomic Signals** to avoid over-rendering.
- **ALWAYS** ensure native private fields (`#state`) are used for true encapsulation.

## 4. Gold Standard Patterns

### The "Reviewer's Eye" (Encapsulation vs. Leaks)

```typescript
// ❌ REJECT: Leaky state, manual subscription, and legacy decorators
export class BadComponent {
  @Input() id: string;
  data: any;

  constructor(private service: DataService) {
    this.service.getData(this.id).subscribe((v) => (this.data = v));
  }
}

// ✅ APPROVE: Encapsulated, Reactive, and Type-Safe (v21)
export class GoodComponent {
  readonly id = input.required<string>();
  readonly #service = inject(DataService);

  // Bridge signal to service resource
  readonly user = this.#service.getUserResource(this.id);

  // Host attributes for A11y
  host = { role: 'region', '[attr.aria-busy]': 'user.isLoading()' };
}
```
