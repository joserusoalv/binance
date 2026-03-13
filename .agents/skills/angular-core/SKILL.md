---
name: Angular Core
description: Essential patterns for Standalone Components, Templates, and Services in Angular 21.
---

# Angular Core Best Practices

## Components
- **Standalone**: Always use standalone components. Do NOT set `standalone: true` (default in v21).
- **Responsibility**: Keep components small and focused.
- **OnPush**: Set `changeDetection: ChangeDetectionStrategy.OnPush`.
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

## References
- [Standalone Component Pattern](../../examples/standalone-component.ts)
