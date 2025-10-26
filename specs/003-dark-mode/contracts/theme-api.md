# Theme Manager JavaScript API

**Feature**: Dark Mode Toggle  
**Date**: October 26, 2025  
**Type**: Client-side JavaScript Module API

## ThemeManager Class

### Constructor
```javascript
new ThemeManager(options?: ThemeManagerOptions)
```

**Parameters**:
- `options.storageKey?: string` - localStorage key (default: "theme-preference")
- `options.defaultTheme?: "light" | "dark"` - fallback theme (default: "light")

### Methods

#### `getCurrentTheme(): string`
**Returns**: Current active theme ("light" | "dark")  
**Side effects**: None  
**Errors**: None (always returns valid theme)

#### `setTheme(theme: "light" | "dark" | "system"): boolean`
**Parameters**: 
- `theme` - Target theme to activate

**Returns**: `true` if successful, `false` if invalid theme  
**Side effects**: Updates DOM, saves to localStorage, triggers events  
**Errors**: Throws if DOM manipulation fails

#### `toggleTheme(): string`
**Returns**: New active theme after toggle  
**Side effects**: Cycles through "light" → "dark" → "system" → "light"  
**Errors**: Throws if DOM manipulation fails

#### `getSystemPreference(): string`
**Returns**: System color scheme preference ("light" | "dark")  
**Side effects**: None  
**Errors**: None (defaults to "light" if detection fails)

#### `addEventListener(type: string, listener: Function): void`
**Parameters**:
- `type` - Event type ("themechange")
- `listener` - Callback function `(event: ThemeChangeEvent) => void`

**Side effects**: Registers event listener  
**Errors**: Throws if invalid parameters

### Events

#### ThemeChangeEvent
```javascript
{
  type: "themechange",
  detail: {
    previousTheme: "light" | "dark",
    currentTheme: "light" | "dark", 
    userTriggered: boolean,
    timestamp: number
  }
}
```

## CSS Custom Properties API

### Required CSS Variables
```css
:root {
  --color-background: <color>;
  --color-text: <color>;
  --color-text-secondary: <color>;
  --color-border: <color>;
  --color-accent: <color>;
  --color-code-background: <color>;
}
```

### Theme Attribute
- **Attribute**: `data-theme="light" | "dark"`
- **Target**: `<html>` element
- **Purpose**: CSS selector hook for theme-specific styles

## HTML Integration Contract

### Required DOM Structure
```html
<button 
  class="theme-toggle" 
  aria-label="Switch to dark theme"
  data-theme-toggle>
  <span class="theme-toggle__icon" aria-hidden="true">☀️</span>
  <span class="theme-toggle__text">Dark mode</span>
</button>
```

### Required Attributes
- `data-theme-toggle`: Identifies toggle control
- `aria-label`: Accessible description of action
- `aria-hidden="true"`: For decorative icons

## localStorage Contract

### Storage Format
```json
{
  "theme-preference": "light" | "dark" | null
}
```

### Behavior
- `null` or missing key: Use system preference
- `"light"` or `"dark"`: Override system preference  
- Invalid values: Treated as null, cleaned up on next save

## Browser Compatibility Requirements

### Minimum Support
- CSS Custom Properties: IE 11+, all modern browsers
- `prefers-color-scheme`: Safari 12.1+, Chrome 76+, Firefox 67+
- localStorage: IE 8+, all modern browsers

### Graceful Degradation
- Missing `prefers-color-scheme`: Defaults to light theme
- Missing localStorage: Session-only theme persistence
- Disabled JavaScript: CSS-only system preference detection

## Performance Contract

### Timing Requirements
- Theme switching: < 100ms perceived delay
- Initial theme detection: < 50ms 
- localStorage operations: < 10ms

### Resource Constraints  
- JavaScript bundle size: < 2KB minified
- CSS overhead: < 1KB additional styles
- Runtime memory: < 100KB