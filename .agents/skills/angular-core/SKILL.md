---
name: Angular Core
description: Strict engineering standards for v21: Functional, Reactive, and Signal-based.
---

# Angular Core Skill

## 1. Context (Input)

- [ ] Target: Angular 21+.
- [ ] Confirm State Architecture: Does this feature need a global service or local `component-level` signals?
- [ ] UI Architecture: Identify if the component is **Presentational** (inputs/outputs only) or **Smart** (injects services).

## 2. Contract (Output)

- Standalone architecture (implicit).
- **Zod-validated** data if using `httpResource`.
- Clean templates using `@` control flow.
- 100% Signal-based API (`input`, `output`, `model`, `viewChild`).

## 3. Guardrails

- **NEVER** write `standalone: true`. It is the default.
- **NEVER** use `@Input`, `@Output`, `@ViewChild`, `@ContentChild`, `@HostBinding`, or `@HostListener`. No exceptions.
- **NEVER** use `effect()` to synchronize state. Use `computed()` for read-only or `linkedSignal()` for writable dependent state.
- **NEVER** use `constructor()` for Dependency Injection. Use `inject()` at the class field level.
- **ALWAYS** use `ChangeDetectionStrategy.OnPush`.
- **ALWAYS** use `inject()` for dependency injection instead of constructor injection.
- **ALWAYS** use `input()` and `output()` functions instead of `@Input()` and `@Output()` decorators.
- **ALWAYS** provide domain-specific services at the **Route** or **Component** level to ensure `httpResource` cleanup (avoid `providedIn: 'root'` for non-global data).

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
    '[class.is-active]': 'isActive()',
  },
})
export class UserProfileComponent {
  user = input.required<User>();
  isActive = signal(false);
}
```

## 5. Verification (Checklist)

- [ ] No decorators (@Input, etc.) exist in the file.
- [ ] standalone: true is absent.
- [ ] All data fetching uses httpResource or rxResource.
- [ ] No effect() is used for state mutation.
- [ ] Control flow uses @if/@for.
