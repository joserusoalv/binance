---
name: Angular Core
description: Essential patterns for Standalone Components, Templates, and Services in Angular 21.
---

# Angular Core Best Practices

## Component Generation

- **CLI First**: Always create components using the Angular CLI to ensure project standards are applied:
  ```bash
  ng generate component <name> --change-detection onPush
  ```
- **Defaults**: Angular 21 defaults to standalone components. Do **NOT** manually add `standalone: true`.

## Component Standards

- **Responsibility**: Keep components small and focused.
- **OnPush**: Always use `ChangeDetectionStrategy.OnPush` (enforced by CLI flag above).
- **Inputs/Outputs**: Use `input()` and `output()` functions instead of decorators.
- **Host Bindings**: Use the `host` object in `@Component` instead of `@HostBinding`/`@HostListener`.
- **Images**: Use `NgOptimizedImage` for all static images.

## Templates

- **Control Flow**: Use native `@if`, `@for`, `@switch`.
- **Simple Logic**: Avoid complex expressions in templates.
- **Class/Style**: Use `class` and `style` bindings instead of `ngClass`/`ngStyle`.
- **Async**: Use the `async` pipe for Observables.

## Services

- **Root Provision**: Use `providedIn: 'root'`.
- **Injection**: Use the `inject()` function.
- **Reactive Forms**: Prefer Reactive forms over Template-driven ones.

## Request Management

- **Resource API**: Use `httpResource` or `rxResource` for data fetching. They handle **automatic cancellation** (via `AbortController`) when a component is destroyed or reactive parameters change.
- **Patterns**:
    - **Declarative (Preferred)**: Define as a class property reading from signals. Best for shared state/singletons.
    - **Factory**: A function that returns a resource. If it takes a `Signal` as an argument, you **must** still pass a computation function to `httpResource` to maintain reactivity: `httpResource(() => ({ url: param() }))`.
- **Reactivity Warning**: Never pass a static object to `httpResource` if you want it to react to signal changes (e.g., `{ url: mySignal() }` evaluated at call time). Always use a function `() => ({ url: mySignal() })`.
- **Injection Context**: Resources must be created within an injection context (field initialization or constructor) or provided with an explicit `injector`.

## References

- [Standalone Component Blueprint](./blueprints/standalone-component.md)
- [Resource Service Blueprint](./blueprints/resource-service.md)
- [Smart Component Blueprint](./blueprints/smart-component.md)
