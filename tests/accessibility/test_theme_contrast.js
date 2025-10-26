/**
 * Accessibility Tests for Theme Contrast Validation
 * Ensures WCAG 2.1 AA compliance for both light and dark themes
 */

const { test, expect } = require('@playwright/test');

// Helper function to calculate contrast ratio
function calculateContrastRatio(color1, color2) {
  // Convert RGB to relative luminance
  function getLuminance(rgb) {
    const [r, g, b] = rgb.match(/\d+/g).map(n => parseInt(n) / 255);
    
    const toLinear = (c) => {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    
    return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  }
  
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
}

// WCAG 2.1 AA Requirements
const CONTRAST_REQUIREMENTS = {
  normal: 4.5,     // Normal text
  large: 3.0,      // Large text (18pt+ or 14pt+ bold)
  ui: 3.0         // UI components and graphics
};

test.describe('Theme Contrast Validation (WCAG 2.1 AA)', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });
  
  test('light theme should meet WCAG 2.1 AA contrast requirements', async ({ page }) => {
    // Ensure light theme is active
    await page.evaluate(() => {
      document.body.setAttribute('data-theme', 'light');
    });
    
    // Test body text contrast
    const bodyText = page.locator('body');
    const textColor = await bodyText.evaluate(el => 
      window.getComputedStyle(el).color
    );
    const backgroundColor = await bodyText.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    );
    
    const bodyContrast = calculateContrastRatio(textColor, backgroundColor);
    expect(bodyContrast).toBeGreaterThanOrEqual(CONTRAST_REQUIREMENTS.normal);
    
    // Test heading contrast
    const heading = page.locator('h1').first();
    if (await heading.count() > 0) {
      const headingColor = await heading.evaluate(el => 
        window.getComputedStyle(el).color
      );
      const headingBg = await heading.evaluate(el => 
        window.getComputedStyle(el).backgroundColor
      );
      
      const headingContrast = calculateContrastRatio(headingColor, headingBg || backgroundColor);
      expect(headingContrast).toBeGreaterThanOrEqual(CONTRAST_REQUIREMENTS.large);
    }
    
    // Test navigation link contrast
    const navLink = page.locator('.nav-link').first();
    if (await navLink.count() > 0) {
      const linkColor = await navLink.evaluate(el => 
        window.getComputedStyle(el).color
      );
      const navBackground = await page.locator('.site-header').evaluate(el => 
        window.getComputedStyle(el).backgroundColor
      );
      
      const linkContrast = calculateContrastRatio(linkColor, navBackground || backgroundColor);
      expect(linkContrast).toBeGreaterThanOrEqual(CONTRAST_REQUIREMENTS.normal);
    }
    
    // Test theme toggle button contrast
    const themeToggle = page.locator('.theme-toggle');
    if (await themeToggle.count() > 0) {
      const toggleColor = await themeToggle.evaluate(el => 
        window.getComputedStyle(el).color
      );
      
      const toggleContrast = calculateContrastRatio(toggleColor, backgroundColor);
      expect(toggleContrast).toBeGreaterThanOrEqual(CONTRAST_REQUIREMENTS.ui);
    }
  });
  
  test('dark theme should meet WCAG 2.1 AA contrast requirements', async ({ page }) => {
    // Ensure dark theme is active
    await page.evaluate(() => {
      document.body.setAttribute('data-theme', 'dark');
    });
    
    // Test body text contrast
    const bodyText = page.locator('body');
    const textColor = await bodyText.evaluate(el => 
      window.getComputedStyle(el).color
    );
    const backgroundColor = await bodyText.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    );
    
    const bodyContrast = calculateContrastRatio(textColor, backgroundColor);
    expect(bodyContrast).toBeGreaterThanOrEqual(CONTRAST_REQUIREMENTS.normal);
    
    // Test heading contrast
    const heading = page.locator('h1').first();
    if (await heading.count() > 0) {
      const headingColor = await heading.evaluate(el => 
        window.getComputedStyle(el).color
      );
      const headingBg = await heading.evaluate(el => 
        window.getComputedStyle(el).backgroundColor
      );
      
      const headingContrast = calculateContrastRatio(headingColor, headingBg || backgroundColor);
      expect(headingContrast).toBeGreaterThanOrEqual(CONTRAST_REQUIREMENTS.large);
    }
    
    // Test navigation link contrast
    const navLink = page.locator('.nav-link').first();
    if (await navLink.count() > 0) {
      const linkColor = await navLink.evaluate(el => 
        window.getComputedStyle(el).color
      );
      const navBackground = await page.locator('.site-header').evaluate(el => 
        window.getComputedStyle(el).backgroundColor
      );
      
      const linkContrast = calculateContrastRatio(linkColor, navBackground || backgroundColor);
      expect(linkContrast).toBeGreaterThanOrEqual(CONTRAST_REQUIREMENTS.normal);
    }
    
    // Test theme toggle button contrast  
    const themeToggle = page.locator('.theme-toggle');
    if (await themeToggle.count() > 0) {
      const toggleColor = await themeToggle.evaluate(el => 
        window.getComputedStyle(el).color
      );
      
      const toggleContrast = calculateContrastRatio(toggleColor, backgroundColor);
      expect(toggleContrast).toBeGreaterThanOrEqual(CONTRAST_REQUIREMENTS.ui);
    }
  });
  
  test('teal accent colors should maintain sufficient contrast in both themes', async ({ page }) => {
    // Test light theme teal contrast
    await page.evaluate(() => {
      document.body.setAttribute('data-theme', 'light');
    });
    
    const lightBg = await page.locator('body').evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    );
    
    // Test primary teal color
    const primaryElement = page.locator('h1').first();
    if (await primaryElement.count() > 0) {
      const primaryColor = await primaryElement.evaluate(el => 
        window.getComputedStyle(el).color
      );
      
      const primaryContrast = calculateContrastRatio(primaryColor, lightBg);
      expect(primaryContrast).toBeGreaterThanOrEqual(CONTRAST_REQUIREMENTS.large);
    }
    
    // Test dark theme teal contrast
    await page.evaluate(() => {
      document.body.setAttribute('data-theme', 'dark');
    });
    
    const darkBg = await page.locator('body').evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    );
    
    if (await primaryElement.count() > 0) {
      const primaryColorDark = await primaryElement.evaluate(el => 
        window.getComputedStyle(el).color
      );
      
      const primaryContrastDark = calculateContrastRatio(primaryColorDark, darkBg);
      expect(primaryContrastDark).toBeGreaterThanOrEqual(CONTRAST_REQUIREMENTS.large);
    }
  });
  
  test('interactive elements should have sufficient hover state contrast', async ({ page }) => {
    // Test light theme hover states
    await page.evaluate(() => {
      document.body.setAttribute('data-theme', 'light');
    });
    
    const navLink = page.locator('.nav-link').first();
    if (await navLink.count() > 0) {
      // Hover over link
      await navLink.hover();
      
      const hoverColor = await navLink.evaluate(el => 
        window.getComputedStyle(el).color
      );
      const background = await page.locator('body').evaluate(el => 
        window.getComputedStyle(el).backgroundColor
      );
      
      const hoverContrast = calculateContrastRatio(hoverColor, background);
      expect(hoverContrast).toBeGreaterThanOrEqual(CONTRAST_REQUIREMENTS.normal);
    }
    
    // Test dark theme hover states
    await page.evaluate(() => {
      document.body.setAttribute('data-theme', 'dark');
    });
    
    if (await navLink.count() > 0) {
      await navLink.hover();
      
      const hoverColorDark = await navLink.evaluate(el => 
        window.getComputedStyle(el).color
      );
      const backgroundDark = await page.locator('body').evaluate(el => 
        window.getComputedStyle(el).backgroundColor
      );
      
      const hoverContrastDark = calculateContrastRatio(hoverColorDark, backgroundDark);
      expect(hoverContrastDark).toBeGreaterThanOrEqual(CONTRAST_REQUIREMENTS.normal);
    }
  });
  
  test('focus indicators should meet contrast requirements', async ({ page }) => {
    const themeToggle = page.locator('.theme-toggle');
    
    if (await themeToggle.count() > 0) {
      // Focus the button
      await themeToggle.focus();
      
      // Check focus outline is visible (should have outline style)
      const outlineWidth = await themeToggle.evaluate(el => 
        window.getComputedStyle(el).outlineWidth
      );
      const outlineStyle = await themeToggle.evaluate(el => 
        window.getComputedStyle(el).outlineStyle
      );
      
      expect(outlineWidth).not.toBe('0px');
      expect(outlineStyle).not.toBe('none');
    }
  });
  
});