---
name: Web Accessibility (a11y)
description: Guidelines and checklists for WCAG 2.1 AA compliance in Angular.
---

# Accessibility (a11y) Skill

## Global Requirements
- It **MUST** pass all AXE checks.
- It **MUST** follow all WCAG 2.1 AA minimums.
- Focus management, color contrast (4.5:1), and ARIA attributes are non-negotiable.

## Checklist

- [ ] **Focus Management**: Focus is returned to the trigger after a modal closes. Focus is trapped within dialogs.
- [ ] **Semantic HTML**: Use `<button>` for actions and `<a>` for navigation.
- [ ] **ARIA**: Use `aria-label` when text is not visible. Use `aria-expanded` and `aria-hidden` correctly.
- [ ] **Contrast**: Minimum contrast ratio of 4.5:1 for normal text.
- [ ] **Keyboard**: All interactive elements are reachable via `Tab`. Actions are performable via `Enter` or `Space`.

## Angular Specifics

- Use `cdk-focus-trap` from Angular CDK for dialogs.
- Ensure `title` is updated on navigation.
- Bind `id` and `for` dynamically in forms for accessible inputs.
- Host bindings in `@Component` for ARIA state:
```typescript
host: {
  '[attr.aria-selected]': 'isSelected()',
  '[class.is-active]': 'isActive()'
}
```
