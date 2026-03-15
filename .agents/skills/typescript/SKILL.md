---
name: TypeScript Best Practices
description: Core TypeScript rules for type safety and maintainability.
---

# TypeScript Skill

## 1. Context (Input)
Before writing TypeScript code, I must:
- [ ] Check `tsconfig.json` for specific strictness flags (target: strict mode).
- [ ] Verify if an existing interface or type can be reused for the current data shape.
- [ ] Identify if a `type` alias or an `interface` is more appropriate (e.g., union vs. object).

## 2. Contract (Output)
When implementing logic, I will deliver:
- Strictly typed functions and variables.
- Explicit return types for public APIs.
- Clear error handling using TypeScript's type system (e.g., discriminated unions).
- Documentation for complex types or utility functions.

## 3. Guardrails
- **NEVER** use `any`; use `unknown` if the type is truly dynamic.
- **NEVER** use `@ts-ignore` or `@ts-nocheck` unless explicitly justified in a comment.
- **NEVER** use optional chaining (`?.`) as a replacement for proper null/undefined checks in logic.
- **ALWAYS** enable and follow `strict` mode.
- **ALWAYS** prefer `interface` for object shapes and `type` for unions/aliases.
- **ALWAYS** use type inference where the type is obvious (e.g., `const count = signal(0)`).

## 4. Gold Standard Patterns

### Key Snippet: Discriminated Unions
```typescript
type Result<T> = 
  | { status: 'success'; data: T }
  | { status: 'error'; message: string };

function handleResult(result: Result<string>) {
  if (result.status === 'success') {
    console.log(result.data.toUpperCase()); // Type safe
  }
}
```

## 5. Verification (Checklist)
- [ ] No `any` types are used.
- [ ] Public methods have explicit return types.
- [ ] Interfaces are used for all object definitions.
- [ ] Code compiles without any TypeScript errors.
- [ ] Discriminated unions are used for complex state/results.
