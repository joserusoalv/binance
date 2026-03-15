---
name: Enterprise Architecture (DDD)
description: Scalable, domain-driven architectural patterns for Angular applications.
---

# Enterprise Architecture (DDD) Skill

## 1. Context (Input)
Before starting architectural work, I must:
- [ ] Identify the specific domain for the new feature.
- [ ] Check for existing data-access or shared services that could be leveraged.
- [ ] Determine if the component is a "Smart" (Feature) or "Presentational" (UI) component.

## 2. Contract (Output)
When implementing architecture, I will deliver:
- A domain-based folder structure (`data-access`, `features`, `ui`, `utils`).
- Smart components that handle routing and orchestration.
- Pure presentational components using signal inputs/outputs.
- Runtime data validation using Zod.

## 3. Guardrails
- **NEVER** trust backend types implicitly; use Zod validation at the boundary.
- **NEVER** inject services directly into presentational (UI) components.
- **NEVER** allow features to be loaded eagerly; **ALWAYS** use lazy loading for domain features.
- **ALWAYS** separate concerns by domain, not by technical type.
- **ALWAYS** use `asReadonly()` to expose signal state from services.
- **ALWAYS** use immutable data patterns when updating state.

## 4. Gold Standard Patterns

### Folder Structure
```text
src/app/domains/
  ├── <domain>/
  │   ├── data-access/      # Services, Interfaces, State (Signals)
  │   ├── features/         # Smart Components (Routes)
  │   ├── ui/               # Presentational Components (Dumb)
  │   └── utils/            # Domain-specific helpers/pipes
```

### Key Snippet: Zod Validation
```typescript
const UserSchema = z.object({ id: z.string(), name: z.string() });

// In data-access service:
this.http.get('/api/user').pipe(
  map(data => UserSchema.parse(data))
);
```

## 5. Verification (Checklist)
- [ ] Folder structure follows the domain-based pattern.
- [ ] Features are lazy-loaded in the routing configuration.
- [ ] Presentational components have NO service injections.
- [ ] Zod is used for data parsing in services.
- [ ] State is managed via private signals and readonly exposures.
- [ ] External libraries are abstracted or wrapped where appropriate.
