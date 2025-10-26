# Quickstart: Dark Mode Implementation

**Feature**: Dark Mode Toggle  
**Date**: October 26, 2025  
**Estimated Time**: 2-3 hours

## Prerequisites

- Node.js 16+ with npm
- Existing Eleventy project setup
- Sass compiler configured  
- Basic understanding of CSS custom properties

## Development Setup

### 1. Install Dependencies (if needed)
```bash
# All required dependencies already in package.json
npm install
```

### 2. Create Theme Files
```bash
# Create theme-specific Sass files
mkdir -p src/styles/themes
touch src/styles/themes/_light.scss
touch src/styles/themes/_dark.scss

# Create theme manager JavaScript
touch src/assets/js/theme-manager.js
```

### 3. Update Build Scripts
```bash
# No changes needed - existing Sass build handles new files
npm run build:css
```

## Implementation Checklist

### Phase 1: CSS Foundation (30 min)
- [ ] Define CSS custom properties in `src/styles/_colors.scss`
- [ ] Create light theme variables in `src/styles/themes/_light.scss`
- [ ] Create dark theme variables in `src/styles/themes/_dark.scss`  
- [ ] Update `src/styles/main.scss` to import theme files
- [ ] Test CSS compilation: `npm run build:css`

### Phase 2: JavaScript Theme Manager (45 min)
- [ ] Implement `ThemeManager` class in `src/assets/js/theme-manager.js`
- [ ] Add system preference detection using `prefers-color-scheme`
- [ ] Implement localStorage persistence with error handling
- [ ] Add theme switching logic with DOM updates
- [ ] Test in browser console: `new ThemeManager().toggleTheme()`

### Phase 3: UI Integration (30 min)  
- [ ] Add theme toggle button to `src/templates/base-simple.njk`
- [ ] Update navigation bar with proper ARIA labels
- [ ] Initialize theme manager in `src/assets/js/main.js`
- [ ] Test toggle functionality in browser

### Phase 4: Testing & Validation (45 min)
- [ ] Create accessibility test: `tests/accessibility/test_theme_contrast.js`
- [ ] Create functionality test: `tests/integration/test_theme_switching.js`
- [ ] Run test suite: `npm test`
- [ ] Validate WCAG contrast ratios using browser dev tools

## Quick Commands

### Development
```bash
# Start development server with CSS watching
npm run dev

# Build for production
npm run build

# Run all tests
npm test
```

### Testing Specific Areas
```bash
# Test accessibility compliance  
npm run test:accessibility

# Test theme switching functionality
node tests/integration/test_theme_switching.js

# Check bundle size
ls -la _site/assets/js/theme-manager.js
```

### Debug Commands
```bash
# Check CSS custom properties
# In browser console:
getComputedStyle(document.documentElement).getPropertyValue('--color-background')

# Check localStorage state
localStorage.getItem('theme-preference')

# Check current theme
document.documentElement.getAttribute('data-theme')
```

## Common Issues & Solutions

### CSS Not Updating
```bash
# Clear build cache and rebuild
npm run clean && npm run build
```

### Theme Not Persisting
```javascript
// Check localStorage availability in browser console
typeof(Storage) !== "undefined" && localStorage.setItem('test', 'test')
```

### System Preference Not Detected
```javascript
// Check media query support
window.matchMedia('(prefers-color-scheme: dark)').matches
```

## File Structure After Implementation

```text
src/
├── styles/
│   ├── _colors.scss          # ✓ Updated with CSS custom properties
│   ├── main.scss            # ✓ Updated with theme imports  
│   └── themes/              # ✓ New directory
│       ├── _light.scss      # ✓ Light theme variables
│       └── _dark.scss       # ✓ Dark theme variables
├── assets/js/
│   ├── main.js             # ✓ Updated with theme initialization
│   └── theme-manager.js    # ✓ New theme management logic
└── templates/
    └── base-simple.njk     # ✓ Updated with toggle button

tests/
├── accessibility/
│   └── test_theme_contrast.js    # ✓ New contrast validation
├── integration/  
│   └── test_theme_switching.js   # ✓ New functionality tests
```

## Success Criteria Verification

- [ ] Theme toggle appears in navigation bar
- [ ] Clicking toggle switches between light/dark themes instantly
- [ ] Theme preference persists after browser restart
- [ ] System preference auto-detected on first visit
- [ ] All tests pass: `npm test`
- [ ] WCAG AA contrast ratios maintained in both themes
- [ ] No console errors or accessibility violations

## Next Steps

After implementation:
1. Run full test suite to ensure quality gates
2. Test on multiple browsers (Chrome, Firefox, Safari)
3. Validate with screen readers for accessibility
4. Consider performance monitoring for theme switching speed