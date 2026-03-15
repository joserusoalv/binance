---
name: Web Accessibility (a11y)
description: Strict WCAG 2.1 AA engineering standards using Angular CDK and Signal-based state.
---

# Accessibility (a11y) Skill

## 1. Context (Input)

Before implementation, the developer must:

- [ ] Identify all **non-standard interactive patterns** (tabs, carousels, trees) that require manual keyboard orchestration.
- [ ] Map all **asynchronous feedback loops** (toasts, loading states, validation errors) that require screen reader announcements.
- [ ] **v21 Check**: Ensure `provideAnimationsAsync()` is configured in `app.config.ts` to support CDK overlay focus management.

## 2. Contract (Output)

Every feature must deliver:

- **Semantic Foundation**: Native HTML elements over ARIA roles wherever possible.
- **Focus Management**: Explicit focus restoration and trapping in all overlays.
- **Dynamic State Sync**: ARIA attributes bound directly to Signals for real-time consistency.
- **Announced Transitions**: Use of `LiveAnnouncer` for any DOM change not triggered by direct user click.

## 3. Guardrails

- **NEVER** use `(click)` on a `div`, `span`, or `li` without a corresponding `(keydown)` listener for `Enter` and `Space`.
- **NEVER** use `placeholder` as a label.
- **NEVER** use `autofocus`. Use the `cdkFocusInitial` directive.
- **ALWAYS** use `inject(LiveAnnouncer)` to announce API success/error messages.
- **ALWAYS** use `cdk-focus-trap` in modals, sidebars, and drawers.
- **ALWAYS** update the document title via `Title` service on every route change.
- **ALWAYS** ensure `[attr.aria-invalid]` is synced with form control status signals.
- **STRICT v21**: Use `provideAnimationsAsync()` for production apps; do not use legacy `provideAnimations()`.

## 4. Gold Standard Patterns

### Key Snippet: Accessible Signal-Based Component

```typescript
@Component({
  selector: 'app-accessible-tab',
  template: `<ng-content />`,
  host: {
    role: 'tab',
    '[attr.aria-selected]': 'selected()',
    '[attr.aria-controls]': 'controlsId()',
    '[tabindex]': 'selected() ? 0 : -1',
    '(keydown.arrowLeft)': 'focusPrevious.emit()',
    '(keydown.arrowRight)': 'focusNext.emit()',
    '(keydown.enter)': 'select.emit()',
    '(keydown.space)': 'select.emit()',
  },
})
export class AccessibleTabComponent {
  selected = input.required<boolean>();
  controlsId = input.required<string>();

  select = output<void>();
  focusNext = output<void>();
  focusPrevious = output<void>();
}
```
