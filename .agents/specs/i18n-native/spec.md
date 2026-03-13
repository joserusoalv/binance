# Spec: Native i18n Support

## Goal
Implement a robust, native internationalization (i18n) system that allows users to switch between languages, resulting in a full page reload and route redirection to the localized version of the application.

## Behavior
- The application should support multiple locales (e.g., `en-US`, `es-ES`).
- A language selector component should be available in the main layout (header).
- When a new language is selected:
    - The application must determine the new base URL for that locale.
    - A full page reload must be triggered to load the specific locale bundle.
    - The user should be navigated to the same route they were on, but under the new locale prefix.
- Translatable strings should be marked using the standard `i18n` attribute in templates.

## Constraints
- Use native Angular i18n (Angular Localize).
- No third-party dynamic translation libraries (like ngx-translate) to keep the bundle lean and leverage build-time optimizations.
- The system must handle the reload gracefully, ensuring the user lands on the correct page.

## Acceptance Criteria
- [ ] User selects "Español" -> URL changes from `/en/...` to `/es/...` and page reloads.
- [ ] Strings marked with `i18n` are correctly translated in the target language.
- [ ] The language selector reflects the current active locale.
