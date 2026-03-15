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
## Dynamic Updates & Live Regions

- **LiveAnnouncer**: Use the `LiveAnnouncer` service from `@angular/cdk/a11y` to notify screen readers of important asynchronous changes (e.g., "Data loaded", "Selection updated").
- **Live Regions**: For content that updates frequently but doesn't require immediate focus (like a live search results count), use `aria-live="polite"` or `aria-live="assertive"` on the container.
- **Dependent Dropdowns**: When one dropdown updates another, announce the availability of new options: `"Options for [category] have been updated"`.
- **Table Updates**: When filtering or sorting a table, announce the result: `"Table filtered. Showing 15 results"`.

### Example: LiveAnnouncer

```typescript
export class UserGridComponent {
  private announcer = inject(LiveAnnouncer);

  onFilterChange(count: number) {
    this.announcer.announce(`Filtered list. ${count} users found`, 'polite');
  }
}
```

## References

- [Live Announcer Blueprint](./blueprints/live-announcer.md)
