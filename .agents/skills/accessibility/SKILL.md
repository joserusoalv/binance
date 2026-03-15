---
name: Web Accessibility (a11y)
description: Guidelines and checklists for WCAG 2.1 AA compliance in Angular.
---

# Accessibility (a11y) Skill

## 1. Context (Input)
Before starting a11y work, I must:
- [ ] Run an automated a11y check (e.g., axe-core) if possible.
- [ ] Identify all interactive elements in the current feature.
- [ ] Check if the project has a global `LiveAnnouncer` or similar service.

## 2. Contract (Output)
When implementing features, I will deliver:
- Semantic HTML tags (`<nav>`, `<main>`, `<button>`, `<a>`).
- Proper ARIA attributes for dynamic states.
- Managed focus states for modals and dropdowns.
- Clear announcements for asynchronous updates.

## 3. Guardrails
- **NEVER** use `div` or `span` for buttons or links.
- **NEVER** use color alone to convey meaning (e.g., red text for error without an icon/text).
- **NEVER** skip heading levels (e.g., going from `h1` to `h3`).
- **ALWAYS** ensure a minimum contrast ratio of 4.5:1 for normal text.
- **ALWAYS** provide an `aria-label` or `title` if a button has no visible text (e.g., icon-only buttons).
- **ALWAYS** trap focus within modal dialogs using `cdk-focus-trap`.

## 4. Gold Standard Patterns
Refer to these blueprints:
- [Live Announcer Blueprint](./blueprints/live-announcer.md)

### Key Snippet: Accessible Host Bindings
```typescript
@Component({
  selector: 'app-custom-tab',
  host: {
    'role': 'tab',
    '[attr.aria-selected]': 'isSelected()',
    '[attr.aria-controls]': 'panelId()',
    '[tabindex]': 'isSelected() ? 0 : -1'
  }
})
export class CustomTabComponent {
  isSelected = input.required<boolean>();
  panelId = input.required<string>();
}
```

## 5. Verification (Checklist)
- [ ] Interactive elements are reachable via `Tab`.
- [ ] `Enter` and `Space` work for all buttons.
- [ ] `aria-expanded` is used for collapsible content.
- [ ] Focus returns to the trigger after closing a modal.
- [ ] `LiveAnnouncer` is used for async success/error messages.
- [ ] Images have descriptive `alt` text or `alt=""` if decorative.
