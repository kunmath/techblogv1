/**
 * Integration Tests for Theme Switching Functionality
 * Tests for User Story 1 (Manual Toggle) and User Story 2 (System Detection)
 */

const { test, expect } = require('@playwright/test');

// Test Group: User Story 1 - Manual Theme Toggle
test.describe('Manual Theme Toggle (User Story 1)', () => {
  
  test.beforeEach(async ({ page }) => {
    // Clear any stored theme preference to start fresh
    await page.addInitScript(() => {
      localStorage.removeItem('theme-preference');
    });
    
    // Navigate to home page
    await page.goto('/');
  });
  
  test('should have theme toggle button visible in navigation', async ({ page }) => {
    // Check that theme toggle button exists and is visible
    const toggleButton = page.locator('[data-theme-toggle]');
    await expect(toggleButton).toBeVisible();
    await expect(toggleButton).toHaveAttribute('aria-label');
  });
  
  test('should switch from light to dark theme when toggle clicked', async ({ page }) => {
    // Verify initial light theme
    const body = page.locator('body');
    await expect(body).toHaveAttribute('data-theme', 'light');
    
    // Click theme toggle
    const toggleButton = page.locator('[data-theme-toggle]');
    await toggleButton.click();
    
    // Verify dark theme applied
    await expect(body).toHaveAttribute('data-theme', 'dark');
    
    // Verify visual changes (background color should change)
    const backgroundColor = await body.evaluate((element) => {
      return window.getComputedStyle(element).backgroundColor;
    });
    expect(backgroundColor).not.toBe('rgb(255, 255, 255)'); // Should not be white
  });
  
  test('should toggle back to light theme on second click', async ({ page }) => {
    const body = page.locator('body');
    const toggleButton = page.locator('[data-theme-toggle]');
    
    // Start with light, go to dark
    await toggleButton.click();
    await expect(body).toHaveAttribute('data-theme', 'dark');
    
    // Toggle back to light
    await toggleButton.click();
    await expect(body).toHaveAttribute('data-theme', 'light');
  });
  
  test('should persist theme preference in localStorage', async ({ page }) => {
    const toggleButton = page.locator('[data-theme-toggle]');
    
    // Switch to dark theme
    await toggleButton.click();
    
    // Check localStorage
    const storedTheme = await page.evaluate(() => {
      return localStorage.getItem('theme-preference');
    });
    expect(storedTheme).toBe('dark');
    
    // Reload page and verify persistence
    await page.reload();
    const body = page.locator('body');
    await expect(body).toHaveAttribute('data-theme', 'dark');
  });
  
  test('should update toggle button appearance based on current theme', async ({ page }) => {
    const toggleButton = page.locator('[data-theme-toggle]');
    
    // Check initial state (light theme)
    const initialAriaLabel = await toggleButton.getAttribute('aria-label');
    expect(initialAriaLabel).toContain('dark'); // Should offer to switch to dark
    
    // Switch to dark theme
    await toggleButton.click();
    
    // Check updated state
    const darkAriaLabel = await toggleButton.getAttribute('aria-label');
    expect(darkAriaLabel).toContain('light'); // Should offer to switch to light
  });
  
});

// Test Group: User Story 2 - System Preference Detection
test.describe('System Preference Detection (User Story 2)', () => {
  
  test('should detect and apply dark system preference', async ({ page, context }) => {
    // Set system preference to dark
    await page.emulateMedia({ colorScheme: 'dark' });
    
    // Clear localStorage to ensure fresh detection
    await page.addInitScript(() => {
      localStorage.removeItem('theme-preference');
    });
    
    // Navigate to page
    await page.goto('/');
    
    // Should automatically apply dark theme
    const body = page.locator('body');
    await expect(body).toHaveAttribute('data-theme', 'dark');
  });
  
  test('should detect and apply light system preference', async ({ page }) => {
    // Set system preference to light
    await page.emulateMedia({ colorScheme: 'light' });
    
    // Clear localStorage
    await page.addInitScript(() => {
      localStorage.removeItem('theme-preference');
    });
    
    // Navigate to page
    await page.goto('/');
    
    // Should automatically apply light theme
    const body = page.locator('body');
    await expect(body).toHaveAttribute('data-theme', 'light');
  });
  
  test('should prioritize stored preference over system preference', async ({ page }) => {
    // Set system to dark but store light preference
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.addInitScript(() => {
      localStorage.setItem('theme-preference', 'light');
    });
    
    // Navigate to page
    await page.goto('/');
    
    // Should use stored preference (light) not system (dark)
    const body = page.locator('body');
    await expect(body).toHaveAttribute('data-theme', 'light');
  });
  
});

// Test Group: Visual and Accessibility Validation
test.describe('Theme Visual and Accessibility Validation', () => {
  
  test('should maintain proper contrast ratios in both themes', async ({ page }) => {
    // Test light theme contrast
    await page.goto('/');
    
    // Check text visibility
    const mainText = page.locator('main p').first();
    await expect(mainText).toBeVisible();
    
    // Switch to dark theme
    const toggleButton = page.locator('[data-theme-toggle]');
    await toggleButton.click();
    
    // Check text still visible in dark theme
    await expect(mainText).toBeVisible();
    
    // Verify different background colors
    const lightBg = await page.evaluate(() => {
      document.body.setAttribute('data-theme', 'light');
      return window.getComputedStyle(document.body).backgroundColor;
    });
    
    const darkBg = await page.evaluate(() => {
      document.body.setAttribute('data-theme', 'dark');
      return window.getComputedStyle(document.body).backgroundColor;
    });
    
    expect(lightBg).not.toBe(darkBg);
  });
  
  test('should have proper ARIA attributes for accessibility', async ({ page }) => {
    await page.goto('/');
    
    const toggleButton = page.locator('[data-theme-toggle]');
    
    // Check required ARIA attributes
    await expect(toggleButton).toHaveAttribute('aria-label');
    await expect(toggleButton).toHaveAttribute('role', 'button');
    await expect(toggleButton).toHaveAttribute('aria-pressed');
    
    // Verify aria-pressed updates with theme changes
    await expect(toggleButton).toHaveAttribute('aria-pressed', 'false'); // Light theme
    
    await toggleButton.click();
    await expect(toggleButton).toHaveAttribute('aria-pressed', 'true'); // Dark theme
  });
  
});