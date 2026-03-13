# Example Spec: User Search Feature

## Goal
Allow users to search for other users by name or email within the system.

## Behavior
- There should be a search input visible at the top of the user grid.
- As the user types, the list should filter results.
- If no results are found, a "No results" message should appear.
- Clearance: Clicking an "X" icon should clear the search.
- Persistence: (Optional) Search query should be persisted in the URL query params.

## Acceptance Criteria
- [ ] User types 'John' -> only users with 'John' in name/email remain.
- [ ] User clears input -> all users are shown.
- [ ] No match found -> "No results found for '...'" message is displayed.
- [ ] URL reflects the search term (e.g., `?q=john`).
