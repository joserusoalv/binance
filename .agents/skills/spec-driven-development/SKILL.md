---
name: Spec Driven Development (SDD)
description: Workflow for driving implementation through high-level specifications and technical plans.
---

# Spec Driven Development Skill

SDD prioritize creating a "Spec" as the source of truth BEFORE implementation. This ensures alignment between requirements and execution while leveraging AI capabilities effectively.

## Core SDD Workflow

1.  **Specify (`spec.md`)**: Define the *Conceptual What*.
    - Describe features from the user's perspective.
    - Avoid technical implementation details (no frameworks, no library names).
    - define the "Contract" of what the feature should achieve.

2.  **Clarify**: (Agent Interaction)
    - Identify ambiguities in the `spec.md`.
    - Ask questions about edge cases, error handling, and non-visual behaviors.

3.  **Plan (`plan.md`)**: Define the *Technical How*.
    - Choose technology (Angular, Signals, Zod, etc.).
    - Define architecture (Domain layer, Service layer, UI components).
    - Map spec requirements to technical entities.

4.  **Taskify (`tasks.md`)**: Create a *Roadmap*.
    - Break down the plan into atomic, sequential tasks.
    - Each task should be descriptive enough for an agent to execute autonomously.

5.  **Implement**: Execute the roadmap.
    - The agent follows the tasks step-by-step.
    - Continuous verification at each step.

## Best Practices

- **Spec over Vibe**: Never implement from a vague prompt. Always insist on a `spec.md` or `Implementation Plan`.
- **Constitutions**: Use a `CONSTITUTION.md` or global rules to define non-negotiable patterns (e.g., "Always use OnPush", "Always use Signals").
- **Audit**: Run an "Analysis" or "Code Review" after task generation to find inconsistencies before writing a single line of code.

## File Structure Pattern

```text
.agents/
  specs/
    001-feature-name/
      spec.md     <-- Conceptual
      plan.md     <-- Technical
      tasks.md    <-- Roadmap
```
