---
name: Spec Driven Development (SDD)
description: Workflow for driving implementation through high-level specifications and technical plans.
---

# Spec Driven Development Skill

## 1. Context (Input)
Before starting implementation via SDD, I must:
- [ ] Verify that a `spec.md` exists or has been requested.
- [ ] Identify any missing information in the requirements (unclear edge cases, UI details).
- [ ] Ensure all relevant "Skills" and "Blueprints" are referenced in the implementation plan.

## 2. Contract (Output)
When following the SDD workflow, I will deliver:
- A conceptual `spec.md` focused on the "What".
- A technical `plan.md` (Implementation Plan) focused on the "How".
- A roadmap of atomic tasks in `task.md` or `tasks.md`.
- A verified implementation that matches the spec exactly.

## 3. Guardrails
- **NEVER** implement from a vague prompt; **ALWAYS** insist on a `spec.md` or `Implementation Plan`.
- **NEVER** include technical library names or framework-specific code in the `spec.md`.
- **NEVER** skip the clarification phase if the spec has ambiguities.
- **ALWAYS** update `task.md` as soon as a task is completed.
- **ALWAYS** perform a code review or audit after task generation.

## 4. Gold Standard Patterns

### SDD Directory Structure
```text
.agents/
  specs/
    <feature-name>/
      spec.md     # Conceptual What
      plan.md     # Technical How
      tasks.md    # Atomic Roadmap
```

## 5. Verification (Checklist)
- [ ] `spec.md` defines behaviors from the user's perspective.
- [ ] `plan.md` maps requirements to technical entities (components, services).
- [ ] Tasks are atomic and sequential.
- [ ] Implementation is verified against the roadmap.
- [ ] Walkthrough is created at the end to demonstrate results.
