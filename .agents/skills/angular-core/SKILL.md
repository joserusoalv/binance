---
name: Angular Core
description: Essential patterns for Standalone Components, Templates, and Services in Angular 21.
---

# Angular Core Skill

## 1. Context (Input)
Before starting any core Angular development, I must:
- [ ] Verify the current Angular version (target is Angular 21).
- [ ] Check if the component should be standalone (default is YES).
- [ ] Identify if a `Signal` or `Observable` approach is more appropriate for the specific use case.

## 2. Contract (Output)
When implementing core components or services, I will deliver:
- Standalone components by default.
- Modern control flow (`@if`, `@for`, `@switch`).
- Optimized images using `NgOptimizedImage`.
- Resources (`httpResource`, `rxResource`) for data fetching where applicable.

## 3. Guardrails
- **NEVER** add `standalone: true` manually (Angular 21 default).
- **NEVER** use `ngIf`, `ngFor`, or `ngSwitch` directives; use `@` syntax.
- **NEVER** use `@HostBinding` or `@HostListener`; use the `host` object in `@Component`.
- **ALWAYS** use `ChangeDetectionStrategy.OnPush`.
- **ALWAYS** use `inject()` for dependency injection instead of constructor injection.
- **ALWAYS** use `input()` and `output()` functions instead of `@Input()` and `@Output()` decorators.

## 4. Gold Standard Patterns
Refer to these blueprints for implementation:
- [Standalone Component Blueprint](./blueprints/standalone-component.md)
- [Resource Service Blueprint](./blueprints/resource-service.md)
- [Smart Component Blueprint](./blueprints/smart-component.md)

### Key Snippet: Modern Component
```typescript
@Component({
  selector: 'app-user-profile',
  template: `
    @if (user(); as u) {
      <h1>{{ u.name }}</h1>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.is-active]': 'isActive()'
  }
})
export class UserProfileComponent {
  user = input.required<User>();
  isActive = signal(false);
}
```

## 5. Verification (Checklist)
- [ ] Component is created via CLI with `--change-detection onPush`.
- [ ] `standalone: true` is NOT present in the code.
- [ ] `inject()` is used for all services.
- [ ] `input()`/`output()` are used for communication.
- [ ] Native control flow (`@if`, etc.) is used in templates.
- [ ] `httpResource` is used correctly with a function for reactivity if needed.
