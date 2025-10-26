# Research: Dark Mode Implementation

**Feature**: Dark Mode Toggle  
**Date**: October 26, 2025  
**Context**: Static site built with Eleventy, Sass, minimal JavaScript

## CSS Custom Properties Approach

**Decision**: Use CSS custom properties (CSS variables) for theme management  
**Rationale**: Native browser support, performant switching, minimal JavaScript overhead, works with existing Sass build system  
**Alternatives considered**: Sass-only approach (requires page reload), class-based switching (more complex CSS maintenance)

## System Preference Detection

**Decision**: Use `prefers-color-scheme` media query with JavaScript fallback  
**Rationale**: Standard web API, respects user preferences, graceful degradation  
**Alternatives considered**: User-agent detection (unreliable), server-side detection (violates static generation)

## State Persistence Strategy  

**Decision**: localStorage with graceful fallback to session-only behavior  
**Rationale**: No server required, persists across sessions, privacy-friendly  
**Alternatives considered**: Cookies (unnecessary server communication), URL parameters (poor UX)

## Theme Toggle UI Pattern

**Decision**: Icon-based toggle in navigation bar (sun/moon or light/dark text)  
**Rationale**: Familiar pattern, accessible with proper ARIA labels, minimal visual impact  
**Alternatives considered**: Dropdown menu (over-engineered), settings page (hidden functionality)

## Performance Optimization

**Decision**: Inline critical theme CSS, load theme-specific styles asynchronously  
**Rationale**: Prevents flash of unstyled content (FOUC), maintains performance budget  
**Alternatives considered**: Theme-specific stylesheets (multiple HTTP requests), runtime CSS generation (complex)

## Accessibility Considerations

**Decision**: WCAG 2.1 AA contrast ratios, focus indicators, ARIA labels for toggle  
**Rationale**: Legal compliance, inclusive design, aligns with project constitution  
**Alternatives considered**: Basic contrast only (insufficient), decorative toggle (inaccessible)

## Browser Compatibility

**Decision**: Support modern browsers with CSS custom properties (IE 11+)  
**Rationale**: Aligns with static site performance goals, minimal polyfill overhead  
**Alternatives considered**: Full IE support (complex fallbacks), modern-only (reduces audience)

## Testing Strategy

**Decision**: Automated contrast testing, visual regression tests, localStorage persistence tests  
**Rationale**: Ensures quality gates, prevents regressions, validates accessibility  
**Alternatives considered**: Manual testing only (unreliable), unit tests only (insufficient coverage)