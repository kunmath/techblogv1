/**
 * Performance Tests for Theme Switching
 * Ensures theme switching meets <100ms requirement and bundle size limits
 */

const { test, expect } = require('@playwright/test');

// Performance thresholds
const PERFORMANCE_THRESHOLDS = {
  themeSwitch: 100,    // Theme switch should complete within 100ms
  bundleSize: 2048,    // JavaScript bundle should be under 2KB
  paintTime: 50        // Paint operations should complete within 50ms
};

test.describe('Theme Performance Validation', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Wait for theme manager to initialize
    await page.waitForFunction(() => {
      return window.ThemeManager && document.querySelector('[data-theme-toggle]');
    });
  });
  
  test('theme switching should complete within 100ms', async ({ page }) => {
    const themeToggle = page.locator('[data-theme-toggle]');
    
    // Measure theme switch performance
    const switchTimes = [];
    
    for (let i = 0; i < 5; i++) {
      const startTime = await page.evaluate(() => performance.now());
      
      await themeToggle.click();
      
      // Wait for theme change to complete
      await page.waitForFunction(() => {
        const body = document.body;
        const theme = body.getAttribute('data-theme');
        return theme === 'dark' || theme === 'light';
      });
      
      const endTime = await page.evaluate(() => performance.now());
      const switchTime = endTime - startTime;
      
      switchTimes.push(switchTime);
      
      // Small delay between switches
      await page.waitForTimeout(100);
    }
    
    // Calculate average switch time
    const averageSwitchTime = switchTimes.reduce((a, b) => a + b, 0) / switchTimes.length;
    const maxSwitchTime = Math.max(...switchTimes);
    
    console.log(`Average theme switch time: ${averageSwitchTime.toFixed(2)}ms`);
    console.log(`Max theme switch time: ${maxSwitchTime.toFixed(2)}ms`);
    console.log(`All switch times: ${switchTimes.map(t => t.toFixed(2)).join(', ')}ms`);
    
    expect(averageSwitchTime).toBeLessThan(PERFORMANCE_THRESHOLDS.themeSwitch);
    expect(maxSwitchTime).toBeLessThan(PERFORMANCE_THRESHOLDS.themeSwitch * 1.5); // Allow 50% buffer for max
  });
  
  test('JavaScript bundle size should stay under 2KB limit', async ({ page }) => {
    // Get all script resources
    const scriptResources = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script[src]'));
      return scripts.map(script => script.src);
    });
    
    let totalSize = 0;
    const bundleSizes = [];
    
    for (const scriptUrl of scriptResources) {
      if (scriptUrl.includes('/assets/js/')) {
        const response = await page.request.get(scriptUrl);
        const content = await response.text();
        const size = new Blob([content]).size;
        
        bundleSizes.push({
          url: scriptUrl,
          size: size
        });
        
        totalSize += size;
      }
    }
    
    console.log('JavaScript bundle sizes:');
    bundleSizes.forEach(bundle => {
      console.log(`  ${bundle.url.split('/').pop()}: ${bundle.size} bytes`);
    });
    console.log(`Total bundle size: ${totalSize} bytes (${(totalSize / 1024).toFixed(2)} KB)`);
    
    expect(totalSize).toBeLessThan(PERFORMANCE_THRESHOLDS.bundleSize);
  });
  
  test('CSS transitions should complete smoothly', async ({ page }) => {
    const themeToggle = page.locator('[data-theme-toggle]');
    
    // Enable performance monitoring
    await page.evaluate(() => {
      window.performanceMetrics = {
        paintTimes: [],
        transitionTimes: []
      };
      
      // Monitor paint events
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'paint') {
            window.performanceMetrics.paintTimes.push({
              type: entry.name,
              time: entry.startTime
            });
          }
        }
      });
      
      observer.observe({ entryTypes: ['paint'] });
    });
    
    // Trigger theme switch and measure transition performance
    const performanceStart = await page.evaluate(() => performance.now());
    
    await themeToggle.click();
    
    // Wait for transition to complete
    await page.waitForTimeout(300); // Allow time for transitions
    
    const performanceEnd = await page.evaluate(() => performance.now());
    const totalTime = performanceEnd - performanceStart;
    
    console.log(`Theme transition total time: ${totalTime.toFixed(2)}ms`);
    
    expect(totalTime).toBeLessThan(PERFORMANCE_THRESHOLDS.themeSwitch * 3); // Allow buffer for transitions
  });
  
  test('theme manager initialization should be efficient', async ({ page }) => {
    // Reload page and measure initialization time
    await page.reload();
    
    const initTime = await page.evaluate(() => {
      return new Promise((resolve) => {
        const startTime = performance.now();
        
        const checkInit = () => {
          if (window.ThemeManager && document.querySelector('[data-theme-toggle]')) {
            const endTime = performance.now();
            resolve(endTime - startTime);
          } else {
            requestAnimationFrame(checkInit);
          }
        };
        
        checkInit();
      });
    });
    
    console.log(`Theme manager initialization time: ${initTime.toFixed(2)}ms`);
    
    expect(initTime).toBeLessThan(PERFORMANCE_THRESHOLDS.themeSwitch);
  });
  
  test('system preference detection should not block rendering', async ({ page }) => {
    // Reload with system preference detection
    await page.emulateMedia({ colorScheme: 'dark' });
    
    const navigationStart = await page.evaluate(() => performance.now());
    
    await page.reload();
    
    // Wait for initial render
    await page.waitForLoadState('domcontentloaded');
    
    const renderTime = await page.evaluate(() => {
      const navTiming = performance.getEntriesByType('navigation')[0];
      return navTiming.domContentLoadedEventEnd - navTiming.fetchStart;
    });
    
    console.log(`Page load time with theme detection: ${renderTime.toFixed(2)}ms`);
    
    // Should still meet the 2s performance requirement
    expect(renderTime).toBeLessThan(2000);
  });
  
  test('localStorage operations should be efficient', async ({ page }) => {
    const storageOperationTimes = [];
    
    // Test multiple localStorage operations
    for (let i = 0; i < 10; i++) {
      const operationTime = await page.evaluate(() => {
        const startTime = performance.now();
        
        // Simulate theme preference save/load
        localStorage.setItem('theme-preference', Math.random() > 0.5 ? 'dark' : 'light');
        const stored = localStorage.getItem('theme-preference');
        
        const endTime = performance.now();
        return endTime - startTime;
      });
      
      storageOperationTimes.push(operationTime);
    }
    
    const avgStorageTime = storageOperationTimes.reduce((a, b) => a + b, 0) / storageOperationTimes.length;
    const maxStorageTime = Math.max(...storageOperationTimes);
    
    console.log(`Average localStorage operation: ${avgStorageTime.toFixed(2)}ms`);
    console.log(`Max localStorage operation: ${maxStorageTime.toFixed(2)}ms`);
    
    expect(avgStorageTime).toBeLessThan(10); // Should be very fast
    expect(maxStorageTime).toBeLessThan(50); // Even worst case should be reasonable
  });
  
  test('theme switching should not cause layout thrash', async ({ page }) => {
    const themeToggle = page.locator('[data-theme-toggle]');
    
    // Monitor layout shifts
    await page.evaluate(() => {
      window.layoutShifts = [];
      
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
            window.layoutShifts.push(entry.value);
          }
        }
      });
      
      observer.observe({ entryTypes: ['layout-shift'] });
    });
    
    // Perform theme switches
    await themeToggle.click();
    await page.waitForTimeout(100);
    await themeToggle.click();
    await page.waitForTimeout(100);
    
    const layoutShifts = await page.evaluate(() => window.layoutShifts || []);
    const totalShift = layoutShifts.reduce((sum, shift) => sum + shift, 0);
    
    console.log(`Layout shifts during theme switching: ${layoutShifts.length} shifts, total: ${totalShift.toFixed(4)}`);
    
    // Should have minimal layout shift
    expect(totalShift).toBeLessThan(0.1); // Keep CLS score good
  });
  
});