/**
 * Manual Validation Tests for Dark Mode Feature
 * Simplified tests that don't require Playwright
 */

const fs = require('fs');
const path = require('path');

// Test configuration
const TESTS = {
  'CSS Compilation': () => {
    const cssFile = path.join(__dirname, '../../_site/css/main.css');
    
    if (!fs.existsSync(cssFile)) {
      throw new Error('CSS file not found - build may have failed');
    }
    
    const cssContent = fs.readFileSync(cssFile, 'utf8');
    
    // Check for theme-related CSS
    const requiredPatterns = [
      /\[data-theme=light\]/,
      /\[data-theme=dark\]/,
      /--color-primary/,
      /--color-background/,
      /theme-toggle/
    ];
    
    for (const pattern of requiredPatterns) {
      if (!pattern.test(cssContent)) {
        throw new Error(`Missing required CSS pattern: ${pattern}`);
      }
    }
    
    return 'CSS contains all required theme patterns';
  },
  
  'JavaScript Files Present': () => {
    const themeManagerFile = path.join(__dirname, '../../_site/assets/js/theme-manager.js');
    const mainJsFile = path.join(__dirname, '../../_site/assets/js/main.js');
    
    if (!fs.existsSync(themeManagerFile)) {
      throw new Error('ThemeManager JavaScript file not found');
    }
    
    if (!fs.existsSync(mainJsFile)) {
      throw new Error('Main JavaScript file not found');
    }
    
    const themeManagerContent = fs.readFileSync(themeManagerFile, 'utf8');
    const mainJsContent = fs.readFileSync(mainJsFile, 'utf8');
    
    // Check for essential functionality
    const requiredThemeFeatures = [
      'class ThemeManager',
      'toggleTheme',
      'getSystemPreference',
      'localStorage',
      'data-theme'
    ];
    
    for (const feature of requiredThemeFeatures) {
      if (!themeManagerContent.includes(feature) && !mainJsContent.includes(feature)) {
        throw new Error(`Missing required feature: ${feature}`);
      }
    }
    
    return 'JavaScript files contain all required theme functionality';
  },
  
  'HTML Template Structure': () => {
    const baseTemplate = path.join(__dirname, '../../src/templates/base-simple.njk');
    
    if (!fs.existsSync(baseTemplate)) {
      throw new Error('Base template not found');
    }
    
    const templateContent = fs.readFileSync(baseTemplate, 'utf8');
    
    // Check for theme toggle button
    const requiredElements = [
      'data-theme-toggle',
      'theme-toggle',
      'aria-label',
      'aria-pressed',
      'theme-manager.js',
      'main.js'
    ];
    
    for (const element of requiredElements) {
      if (!templateContent.includes(element)) {
        throw new Error(`Missing required template element: ${element}`);
      }
    }
    
    return 'HTML template contains all required theme elements';
  },
  
  'Theme Color Definitions': () => {
    const lightTheme = path.join(__dirname, '../../src/styles/themes/_light.scss');
    const darkTheme = path.join(__dirname, '../../src/styles/themes/_dark.scss');
    
    if (!fs.existsSync(lightTheme) || !fs.existsSync(darkTheme)) {
      throw new Error('Theme files not found');
    }
    
    const lightContent = fs.readFileSync(lightTheme, 'utf8');
    const darkContent = fs.readFileSync(darkTheme, 'utf8');
    
    // Check for essential color properties
    const requiredColors = [
      '--color-background',
      '--color-text',
      '--color-primary',
      '--color-accent'
    ];
    
    for (const color of requiredColors) {
      if (!lightContent.includes(color)) {
        throw new Error(`Light theme missing color: ${color}`);
      }
      if (!darkContent.includes(color)) {
        throw new Error(`Dark theme missing color: ${color}`);
      }
    }
    
    // Check for teal colors
    if (!lightContent.includes('#0d9488') && !lightContent.includes('#2dd4bf')) {
      throw new Error('Light theme missing teal colors');
    }
    
    if (!darkContent.includes('#2dd4bf')) {
      throw new Error('Dark theme missing teal colors');
    }
    
    return 'Theme files contain all required color definitions with teal accents';
  },
  
  'Progressive Enhancement': () => {
    const mainCss = path.join(__dirname, '../../_site/css/main.css');
    
    if (!fs.existsSync(mainCss)) {
      throw new Error('Main CSS file not found');
    }
    
    const cssContent = fs.readFileSync(mainCss, 'utf8');
    
    // Check for system preference fallback
    if (!cssContent.includes('prefers-color-scheme')) {
      throw new Error('Missing system preference media query fallback');
    }
    
    // Check for progressive enhancement classes
    if (!cssContent.includes('js-enabled')) {
      throw new Error('Missing progressive enhancement CSS');
    }
    
    return 'Progressive enhancement and system preference fallbacks present';
  }
};

// Run all tests
console.log('🧪 Running Dark Mode Feature Validation Tests...\n');

let passed = 0;
let failed = 0;

for (const [testName, testFn] of Object.entries(TESTS)) {
  try {
    const result = testFn();
    console.log(`✅ PASS: ${testName}`);
    console.log(`   ${result}\n`);
    passed++;
  } catch (error) {
    console.log(`❌ FAIL: ${testName}`);
    console.log(`   ${error.message}\n`);
    failed++;
  }
}

console.log(`📊 Test Results: ${passed} passed, ${failed} failed`);

if (failed === 0) {
  console.log('🎉 All dark mode functionality tests passed!');
  process.exit(0);
} else {
  console.log('⚠️  Some tests failed. Please review the implementation.');
  process.exit(1);
}