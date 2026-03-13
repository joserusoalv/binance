---
name: Angular Signals
description: Best practices and patterns for Signal-based state management in Angular 21.
---

# Angular Signals Skill

## Core Patterns

- **Local State**: Use `signal()` within components for UI state.
- **Computed Value**: Use `computed()` for any state derived from other signals.
- **Side Effects**: Use `effect()` sparingly, primarily for external interactions (e.g., logging, manual DOM manipulation).
- **Communication**: Use `input()`, `output()`, and `model()` for component communication.
- **Services**: Expose signals from services, keeping setters private or controlled via methods.

## Dos and Don'ts

- **DO** use `update()` or `set()` to change values.
- **DO NOT** use `mutate()` (deprecated).
- **DO NOT** write to signals inside a `computed()` or template.
- **DO** use the `pipe(toSignal)` pattern for Observables that need to be read in templates.

## State Management Patterns

- **Signal State**: Use signals for all local component state.
- **Derived State**: Use `computed()` for all transformations and derivations.
- **Immutability**: Keep transformations pure and predictable.
- **Updates**: Do NOT use `mutate`. Use `update` or `set` to trigger changes.
- **Effect Usage**: Use `effect()` only for side effects like logging or external DOM APIs, never for state propagation.

## References
- [Reactive Service Pattern](../../examples/signal-service.ts)
