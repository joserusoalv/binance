---
name: TypeScript Best Practices
description: Core TypeScript rules for type safety and maintainability.
---

# TypeScript Best Practices

- **Strict Type Checking**: Always enable and follow strict mode.
- **Type Inference**: Prefer inference when the type is obvious (e.g., `count = signal(0)`).
- **Avoid `any`**: Use `unknown` when the type is truly uncertain.
- **Interfaces vs Types**: Prefer `interface` for object shapes and `type` for unions/aliases.
- **Return Types**: Explicitly define return types for public service methods and complex functions.
