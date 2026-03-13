# Technical Plan: Native i18n Support

## Architecture
- **Tooling**: `@angular/localize` for build-time translation processing.
- **Service Layer**: `LanguageService` to detect the current URL-based locale and manage redirects.
- **UI Components**: `LanguageSelectorComponent` (Standalone + OnPush).
- **Configuration**: Update `angular.json` to define supported locales and their output paths.

## Implementation Details

### 1. Angular Configuration (`angular.json`)
- Add `i18n` source locale and target locales configuration.
- Define `localize` property in the build options to generate multiple bundles (e.g., `dist/binance/en-US`, `dist/binance/es-ES`).

### 2. Language Detection
- Use the `LOCALE_ID` injection token to identify the current active locale in the component.
- The `LanguageService` will provide a list of available languages and their corresponding URL prefixes.

### 3. Redirection Logic
- The `LanguageSelectorComponent` will call `location.assign()` to trigger a full page reload when switching languages.
- It will preserve the current route by appending it to the base path of the target locale.

### 4. Translation Files (`.xlf`)
- Generate source translation files using `ng extract-i18n`.
- Store translations in `src/locale/messages.<locale>.xlf`.

## Verification Plan
### Automated Tests
- Integration test for `LanguageSelectorComponent` to verify it generates the correct target URLs.
- Mocking `LOCALE_ID` to test the component's state in different languages.

### Manual Verification
- Build the application for production to ensure localize bundles are generated and routes work correctly in a server environment (e.g., using `http-server`).
