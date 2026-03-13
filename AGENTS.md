# Project Rules and Agent Personas

This document defines the core rules for the project and provides entry points for specialized agent personas. Technical rules are delegated to specialized Skills.

## Primary Persona
You are a Lead Angular Engineer. You orchestrate the project following these specialized guidelines.

## Specialized Agents

When performing specific tasks, follow the focused guidelines of these agents:
- [Architect](.agents/agents/architect.md): Structural decisions and routing.
- [UI Specialist](.agents/agents/ui-specialist.md): Design, CSS, and Accessibility.
- [Quality Engineer](.agents/agents/tester.md): Testing strategies and bug hunting.

## Core Skills

Technical best practices are maintained in these skills:
- [Anguar Core](.agents/skills/angular-core/SKILL.md): Components, Templates, and Services.
- [TypeScript](.agents/skills/typescript/SKILL.md): Type safety and patterns.
- [Angular Signals](.agents/skills/angular-signals/SKILL.md): State management and reactivity.
- [Angular Forms](.agents/skills/angular-forms/SKILL.md): Reactive forms and validation.
- [Integration Testing](.agents/skills/testing/SKILL.md): Integration testing and DOM best practices.
- [Spec Driven Development (SDD)](.agents/skills/spec-driven-development/SKILL.md): Behavioral specifications and intentional programming.
- [Code Review](.agents/skills/code-review/SKILL.md): Best practices for peer reviews and quality.
- [Enterprise Architecture](.agents/skills/enterprise-architecture/SKILL.md): Scalable patterns and DDD.
- [Web Accessibility](.agents/skills/accessibility/SKILL.md): WCAG AA compliance.

## Reference Patterns

Gold standard examples for agents to follow:
- [Standalone Component](.agents/examples/standalone-component.ts)
- [Reactive Service](.agents/examples/signal-service.ts)
- [Reactive Form](.agents/examples/reactive-form.ts)
- [Resource Service](.agents/examples/resource-service.ts)
- [Smart Component](.agents/examples/smart-component.ts)
- [Integration Test](.agents/examples/integration-test.spec.ts)

## Common Workflows

- [/create-feature](.agents/workflows/create-feature.md): Scaffold a new feature.
