# Technical Plan: User Search Feature

## Architecture
- **State Management**: Use a `computed` signal derived from the `users` resource and a `searchTerm` signal.
- **Search Logic**: Case-insensitive filtering on `name` and `email` properties.
- **Debounce**: Use `toObservable` + `debounceTime` + `toSignal` or a manual debounce within a `searchTerm` setter.

## Implementation Details
- Input component with `ngModel` (or Reactive control) linked to a `searchTerm` signal.
- Integration with `ActivatedRoute` to sync query params.

## Verification
- Unit test for the filtering logic.
- Integration test checking the debounce behavior.
