/**
 * Tech Blog JavaScript
 * Constitutional compliance: Minimal JavaScript, progressive enhancement
 * Performance focused: <2s load time requirement
 */

// Reading progress indicator
class ReadingProgress {
  constructor() {
    this.progressBar = document.getElementById('reading-progress-bar');
    this.article = document.querySelector('.article-content');
    
    if (this.progressBar && this.article) {
      this.init();
    }
  }
  
  init() {
    this.updateProgress();
    window.addEventListener('scroll', () => this.updateProgress(), { passive: true });
    window.addEventListener('resize', () => this.updateProgress(), { passive: true });
  }
  
  updateProgress() {
    const articleTop = this.article.offsetTop;
    const articleHeight = this.article.offsetHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    
    // Calculate how much of the article has been scrolled
    const articleStart = articleTop - windowHeight / 3;
    const articleEnd = articleTop + articleHeight - windowHeight / 3;
    const totalScrollable = articleEnd - articleStart;
    
    if (scrollTop < articleStart) {
      this.progressBar.style.width = '0%';
    } else if (scrollTop > articleEnd) {
      this.progressBar.style.width = '100%';
    } else {
      const progress = ((scrollTop - articleStart) / totalScrollable) * 100;
      this.progressBar.style.width = `${Math.max(0, Math.min(100, progress))}%`;
    }
  }
}

// Tag filtering functionality
class TagFilter {
  constructor() {
    this.filterButtons = document.querySelectorAll('[data-tag-filter]');
    this.articles = document.querySelectorAll('[data-article-tags]');
    this.clearButton = document.querySelector('[data-clear-filters]');
    this.activeFilters = new Set();
    
    if (this.filterButtons.length > 0) {
      this.init();
    }
  }
  
  init() {
    // Add click handlers to filter buttons
    this.filterButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const tag = button.dataset.tagFilter;
        this.toggleFilter(tag, button);
      });
    });
    
    // Add clear filters handler
    if (this.clearButton) {
      this.clearButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.clearAllFilters();
      });
    }
    
    // Check URL for initial filters
    this.loadFiltersFromURL();
  }
  
  toggleFilter(tag, button) {
    if (this.activeFilters.has(tag)) {
      this.activeFilters.delete(tag);
      button.classList.remove('active');
    } else {
      this.activeFilters.add(tag);
      button.classList.add('active');
    }
    
    this.updateDisplay();
    this.updateURL();
  }
  
  clearAllFilters() {
    this.activeFilters.clear();
    this.filterButtons.forEach(button => {
      button.classList.remove('active');
    });
    this.updateDisplay();
    this.updateURL();
  }
  
  updateDisplay() {
    const hasActiveFilters = this.activeFilters.size > 0;
    
    this.articles.forEach(article => {
      if (!hasActiveFilters) {
        article.style.display = '';
        return;
      }
      
      const articleTags = JSON.parse(article.dataset.articleTags || '[]');
      const hasMatchingTag = articleTags.some(tag => this.activeFilters.has(tag));
      
      article.style.display = hasMatchingTag ? '' : 'none';
    });
    
    // Show/hide clear button
    if (this.clearButton) {
      this.clearButton.style.display = hasActiveFilters ? 'inline-block' : 'none';
    }
    
    // Update results count
    this.updateResultsCount();
  }
  
  updateResultsCount() {
    const visibleArticles = Array.from(this.articles).filter(article => {
      return article.style.display !== 'none';
    });
    
    const countElement = document.querySelector('[data-results-count]');
    if (countElement) {
      const count = visibleArticles.length;
      countElement.textContent = `${count} article${count !== 1 ? 's' : ''}`;
    }
  }
  
  loadFiltersFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const tagParam = urlParams.get('tag');
    
    if (tagParam) {
      const tags = tagParam.split(',');
      tags.forEach(tag => {
        const button = document.querySelector(`[data-tag-filter="${tag}"]`);
        if (button) {
          this.activeFilters.add(tag);
          button.classList.add('active');
        }
      });
      this.updateDisplay();
    }
  }
  
  updateURL() {
    const url = new URL(window.location);
    
    if (this.activeFilters.size > 0) {
      url.searchParams.set('tag', Array.from(this.activeFilters).join(','));
    } else {
      url.searchParams.delete('tag');
    }
    
    window.history.replaceState({}, '', url.toString());
  }
}

// Copy code to clipboard functionality
class CodeCopy {
  constructor() {
    this.codeBlocks = document.querySelectorAll('pre code');
    
    if (this.codeBlocks.length > 0) {
      this.init();
    }
  }
  
  init() {
    this.codeBlocks.forEach((codeBlock, index) => {
      const pre = codeBlock.parentElement;
      const button = this.createCopyButton(index);
      
      pre.style.position = 'relative';
      pre.appendChild(button);
      
      button.addEventListener('click', () => {
        this.copyCode(codeBlock, button);
      });
    });
  }
  
  createCopyButton(index) {
    const button = document.createElement('button');
    button.className = 'copy-code-btn';
    button.innerHTML = '📋 Copy';
    button.setAttribute('aria-label', `Copy code block ${index + 1}`);
    button.style.cssText = `
      position: absolute;
      top: 8px;
      right: 8px;
      background: rgba(255, 255, 255, 0.1);
      color: #e2e8f0;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 4px;
      padding: 4px 8px;
      font-size: 12px;
      cursor: pointer;
      transition: background-color 0.2s;
    `;
    
    // Hover styles
    button.addEventListener('mouseenter', () => {
      button.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
    });
    
    button.addEventListener('mouseleave', () => {
      button.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    });
    
    return button;
  }
  
  async copyCode(codeBlock, button) {
    const code = codeBlock.textContent;
    const originalText = button.innerHTML;
    
    try {
      await navigator.clipboard.writeText(code);
      button.innerHTML = '✅ Copied';
      button.style.backgroundColor = 'rgba(34, 197, 94, 0.2)';
      
      setTimeout(() => {
        button.innerHTML = originalText;
        button.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
      }, 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
      button.innerHTML = '❌ Failed';
      
      setTimeout(() => {
        button.innerHTML = originalText;
      }, 2000);
    }
  }
}

// Lazy loading for images
class LazyImages {
  constructor() {
    this.images = document.querySelectorAll('img[data-src]');
    
    if (this.images.length > 0 && 'IntersectionObserver' in window) {
      this.init();
    }
  }
  
  init() {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
          imageObserver.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '50px'
    });
    
    this.images.forEach(img => imageObserver.observe(img));
  }
  
  loadImage(img) {
    img.src = img.dataset.src;
    img.removeAttribute('data-src');
    img.classList.add('loaded');
  }
}

// Skip to main content for accessibility
class SkipToContent {
  constructor() {
    this.skipLink = document.querySelector('.skip-to-main');
    this.mainContent = document.querySelector('main');
    
    if (this.skipLink && this.mainContent) {
      this.init();
    }
  }
  
  init() {
    this.skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      this.mainContent.focus();
      this.mainContent.scrollIntoView();
    });
  }
}

// Theme Manager Integration
class ThemeController {
  constructor() {
    this.toggleButton = document.querySelector('[data-theme-toggle]');
    this.themeManager = null;
    
    if (this.toggleButton && window.ThemeManager) {
      this.init();
    }
  }
  
  init() {
    // Initialize ThemeManager
    this.themeManager = new window.ThemeManager({
      storageKey: 'theme-preference',
      defaultTheme: 'light'
    });
    
    // Set up toggle button event
    this.toggleButton.addEventListener('click', () => {
      this.themeManager.toggleTheme();
    });
    
    // Listen for theme changes to update button
    this.themeManager.addEventListener('themechange', (event) => {
      this.updateToggleButton(event.detail.currentTheme);
    });
    
    // Initial button state
    this.updateToggleButton(this.themeManager.getCurrentTheme());
  }
  
  updateToggleButton(currentTheme) {
    if (!this.toggleButton) return;
    
    const isDark = currentTheme === 'dark';
    
    // Update ARIA attributes
    this.toggleButton.setAttribute('aria-pressed', isDark.toString());
    this.toggleButton.setAttribute('aria-label', 
      isDark ? 'Switch to light mode' : 'Switch to dark mode'
    );
    
    // Update text content
    const textElement = this.toggleButton.querySelector('.theme-toggle-text');
    if (textElement) {
      textElement.textContent = isDark ? 'Light' : 'Dark';
    }
  }
}

// Performance monitoring
class PerformanceMonitor {
  constructor() {
    if ('performance' in window) {
      this.init();
    }
  }
  
  init() {
    // Log Core Web Vitals if available
    if ('web-vitals' in window) {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(console.log);
        getFID(console.log);
        getFCP(console.log);
        getLCP(console.log);
        getTTFB(console.log);
      });
    }
    
    // Log basic performance metrics
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        const loadTime = perfData.loadEventEnd - perfData.fetchStart;
        
        console.log(`Page load time: ${loadTime}ms`);
        
        // Check if we meet our <2s requirement
        if (loadTime > 2000) {
          console.warn('Page load time exceeds 2s requirement:', loadTime);
        }
      }, 0);
    });
  }
}

// Initialize all components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ReadingProgress();
  new TagFilter();
  new CodeCopy();
  new LazyImages();
  new SkipToContent();
  new ThemeController();
  new PerformanceMonitor();
});

// Service Worker registration (progressive enhancement)
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered:', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed:', registrationError);
      });
  });
}