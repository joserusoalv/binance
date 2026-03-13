---
description: How to scaffold a new feature in the Angular project
---

# Workflow: Create New Feature

This workflow ensures features are created with a consistent, lazy-loadable structure.

1.  **Define Feature Path**: Identify where the feature belongs (e.g., `src/app/features/xyz`).
2.  **Generate Entry Component**: Create the main component for the feature.
    - Run: `ng g c features/<feature-name> --skip-import`
3.  **Create Routes**: Add a `<feature-name>.routes.ts` file.
    ```typescript
    import { Routes } from '@angular/router';
    import { <FeatureName>Component } from './<feature-name>.component';

    export const <FEATURE_NAME>_ROUTES: Routes = [
      { path: '', component: <FeatureName>Component }
    ];
    ```
4.  **Register Lazy Loading**: Add the route to the main `app.routes.ts`.
5.  **Add Service**: If logic is needed, add a local or root service.
6.  **Verify**: Check that the route navigates correctly and the component is "OnPush".
