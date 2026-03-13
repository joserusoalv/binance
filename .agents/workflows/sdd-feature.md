---
description: Scaffold a new feature using the Spec Driven Development (SDD) workflow
---

# Workflow: SDD Feature Development

This workflow ensures that every feature starts with a behavioral specification before a single line of code is written.

1.  **Specification (Specify)**: 
    - Create a new directory: `.agents/specs/<feature-name>/`.
    - Generate `spec.md`: Describe the feature conceptually. Focus on the *What*.
    - Request USER review of the specification.

2.  **Architecture (Plan)**:
    - Generate `plan.md`: Define the technical architecture (Signals, Services, Zod). Focus on the *How*.
    - Ensure alignment with the `Enterprise Architecture` and `Angular Core` skills.
    - Request USER review of the technical plan.

3.  **Roadmap (Tasks)**:
    - Generate `tasks.md`: Break down the plan into a sequence of atomic coding tasks.
    - Use the `task_boundary` tool to track progress through these tasks.

4.  **Implementation**:
    - Execute the tasks sequentially.
    - Verify each step with integration tests where applicable.

5.  **Finalize**:
    - Request a code review session.
    - Update the walkthrough documentation.
