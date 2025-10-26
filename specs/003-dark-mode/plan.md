# Implementation Plan: Dark Mode Toggle

**Branch**: `003-dark-mode` | **Date**: October 26, 2025 | **Spec**: [link to spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-dark-mode/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement dark mode toggle functionality allowing users to switch between light and dark themes, with automatic system preference detection and localStorage persistence. Uses CSS custom properties, JavaScript ES6+, and integrates with existing Eleventy build system.

## Technical Context

**Language/Version**: JavaScript ES6+, HTML5, CSS3, Sass  
**Primary Dependencies**: Eleventy 2.0.1, Sass 1.69.5, Prism.js 1.30.0  
**Storage**: localStorage (client-side) for theme preferences  
**Testing**: Node.js with Playwright, Axe-core for accessibility, custom test suites  
**Target Platform**: Modern web browsers (desktop and mobile)
**Project Type**: Static site generator (Eleventy)  
**Performance Goals**: <2s load time, instant theme switching (<2s user perception)  
**Constraints**: WCAG 2.1 AA compliance, no client-side frameworks, minimal JavaScript  
**Scale/Scope**: Small static site with ~10 pages, minimal user interactions

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- ✅ **Minimalism First**: Uses only CSS custom properties, minimal JavaScript, existing Sass/Eleventy infrastructure
- ✅ **Static Generation**: No server-side components, client-side localStorage only  
- ✅ **Accessibility Compliance**: WCAG 2.1 AA color contrast requirements included in spec
- ✅ **Performance Discipline**: <2s total load time maintained, instant theme switching specified
- ✅ **Test-Driven Content**: Accessibility tests, performance tests, and functionality tests planned

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── styles/
│   ├── _colors.scss          # Color definitions for light/dark themes
│   ├── main.scss            # Updated with theme variable imports
│   └── themes/              # New directory for theme-specific styles
│       ├── _light.scss      # Light theme variables
│       └── _dark.scss       # Dark theme variables
├── assets/
│   └── js/
│       ├── main.js          # Updated with theme toggle functionality
│       └── theme-manager.js # New: theme detection and persistence
└── templates/
    └── base-simple.njk      # Updated with theme toggle in navigation

tests/
├── accessibility/
│   └── test_theme_contrast.js    # New: WCAG contrast tests for both themes
├── integration/
│   └── test_theme_switching.js   # New: theme toggle functionality tests
└── performance/
    └── test_theme_performance.js # New: theme switching performance tests
```

**Structure Decision**: Single project structure using existing Eleventy setup. Theme management implemented through Sass variables and JavaScript modules, with new theme-specific files organized under existing directory structure.

## Complexity Tracking

> **Constitution Check**: No violations detected - no complexity justification required

All implementation approaches align with project constitution:
- Uses only permitted minimal technologies (CSS custom properties, localStorage, vanilla JavaScript)
- Maintains static generation principle (no server-side components)  
- Preserves performance discipline (<2s load times, minimal JavaScript overhead)
- Supports accessibility compliance (WCAG 2.1 AA contrast requirements)
