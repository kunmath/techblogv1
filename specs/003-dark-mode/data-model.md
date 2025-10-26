# Data Model: Dark Mode Feature

**Feature**: Dark Mode Toggle  
**Date**: October 26, 2025  
**Context**: Client-side state management for theme preferences

## Core Entities

### ThemeState
**Purpose**: Represents the current theme configuration and user preferences  

**Attributes**:
- `currentTheme`: string ("light" | "dark" | "system")
- `userPreference`: string | null ("light" | "dark" | null for system default)
- `systemPreference`: string ("light" | "dark") 
- `isManuallySet`: boolean

**Validation Rules**:
- `currentTheme` must be one of: "light", "dark", "system"
- `userPreference` must be null or one of: "light", "dark"
- `systemPreference` must be one of: "light", "dark"
- When `userPreference` is not null, `isManuallySet` must be true

**State Transitions**:
- Initial: `{ currentTheme: "system", userPreference: null, systemPreference: detected, isManuallySet: false }`
- User toggles to dark: `{ currentTheme: "dark", userPreference: "dark", systemPreference: detected, isManuallySet: true }`
- User toggles to light: `{ currentTheme: "light", userPreference: "light", systemPreference: detected, isManuallySet: true }`
- System preference changes: Updates `systemPreference`, `currentTheme` follows `userPreference` if set, otherwise follows system

### ThemeToggleControl
**Purpose**: UI component for theme switching

**Attributes**:
- `element`: HTMLElement (button or similar interactive element)
- `currentLabel`: string (accessible label for current state)
- `currentIcon`: string (visual indicator: sun/moon/auto)
- `isInteractive`: boolean

**Validation Rules**:
- `element` must have appropriate ARIA attributes
- `currentLabel` must be descriptive for screen readers
- Element must be keyboard accessible (focusable, proper focus indicators)

### LocalStorageAdapter
**Purpose**: Handles persistence of theme preferences

**Attributes**:
- `storageKey`: string ("theme-preference")
- `isAvailable`: boolean (localStorage support detection)

**Methods**:
- `save(userPreference: string | null): boolean`
- `load(): string | null`
- `clear(): boolean`

**Validation Rules**:
- Gracefully handles localStorage unavailability
- Validates stored values before returning
- Handles quota exceeded errors

## Relationships

- **ThemeState** ↔ **LocalStorageAdapter**: One-to-one, ThemeState persisted via adapter
- **ThemeState** ↔ **ThemeToggleControl**: One-to-many, multiple controls can reflect same state
- **ThemeToggleControl** → **ThemeState**: Controls trigger state transitions

## Data Flow

1. **Initialization**: System detects `prefers-color-scheme`, loads localStorage, initializes ThemeState
2. **User Interaction**: Toggle control triggers ThemeState update
3. **State Change**: ThemeState updates, notifies all controls, persists via LocalStorageAdapter  
4. **DOM Update**: CSS custom properties updated, UI controls reflect new state

## Storage Schema

### localStorage
```json
{
  "theme-preference": "light" | "dark" | null
}
```

**Size**: < 50 bytes per user  
**Retention**: Indefinite (user-controlled)  
**Privacy**: Client-side only, no server transmission