/**
 * ThemeManager - Handles dark/light theme switching with system preference detection
 * and localStorage persistence
 */
class ThemeManager {
    constructor(options = {}) {
        this.storageKey = options.storageKey || 'theme-preference';
        this.defaultTheme = options.defaultTheme || 'light';
        this.currentTheme = this.defaultTheme;
        this.listeners = [];
        
        this.init();
    }

    /**
     * Initialize theme manager - detect system preference and load stored preference
     */
    init() {
        // Detect system preference
        const systemPreference = this.getSystemPreference();
        
        // Load stored preference
        const storedPreference = this.loadStoredPreference();
        
        // Set initial theme
        if (storedPreference) {
            this.setTheme(storedPreference, false); // Don't save on init
        } else {
            this.setTheme(systemPreference, false);
        }
    }

    /**
     * Get current active theme
     * @returns {string} Current theme ("light" | "dark")
     */
    getCurrentTheme() {
        return this.currentTheme;
    }

    /**
     * Set theme and update DOM
     * @param {string} theme - Theme to set ("light" | "dark" | "system")
     * @param {boolean} save - Whether to save to localStorage (default: true)
     * @returns {boolean} Success status
     */
    setTheme(theme, save = true) {
        let targetTheme = theme;
        
        // Handle "system" theme
        if (theme === 'system') {
            targetTheme = this.getSystemPreference();
            if (save) {
                this.clearStoredPreference(); // Clear stored preference for system
            }
        } else if (!['light', 'dark'].includes(theme)) {
            console.warn(`Invalid theme: ${theme}. Using default.`);
            return false;
        }

        // Update DOM
        try {
            document.body.setAttribute('data-theme', targetTheme);
            
            // Update current theme
            const previousTheme = this.currentTheme;
            this.currentTheme = targetTheme;
            
            // Save to localStorage if requested
            if (save && theme !== 'system') {
                this.saveStoredPreference(targetTheme);
            }
            
            // Trigger change event
            this.triggerThemeChange(previousTheme, targetTheme, true);
            
            return true;
        } catch (error) {
            console.error('Failed to update theme:', error);
            return false;
        }
    }

    /**
     * Toggle between light and dark themes
     * @returns {string} New active theme
     */
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        return newTheme;
    }

    /**
     * Get system color scheme preference
     * @returns {string} System preference ("light" | "dark")
     */
    getSystemPreference() {
        if (typeof window !== 'undefined' && window.matchMedia) {
            const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
            return darkModeQuery.matches ? 'dark' : 'light';
        }
        return this.defaultTheme;
    }

    /**
     * Add event listener for theme changes
     * @param {string} type - Event type (currently only "themechange")
     * @param {Function} listener - Callback function
     */
    addEventListener(type, listener) {
        if (type === 'themechange' && typeof listener === 'function') {
            this.listeners.push(listener);
        }
    }

    /**
     * Remove event listener
     * @param {string} type - Event type
     * @param {Function} listener - Callback function to remove
     */
    removeEventListener(type, listener) {
        if (type === 'themechange') {
            this.listeners = this.listeners.filter(l => l !== listener);
        }
    }

    /**
     * Load stored theme preference from localStorage
     * @returns {string|null} Stored preference or null
     */
    loadStoredPreference() {
        try {
            if (typeof localStorage !== 'undefined') {
                const stored = localStorage.getItem(this.storageKey);
                if (stored && ['light', 'dark'].includes(stored)) {
                    return stored;
                }
            }
        } catch (error) {
            console.warn('localStorage not available:', error);
        }
        return null;
    }

    /**
     * Save theme preference to localStorage
     * @param {string} theme - Theme to save
     * @returns {boolean} Success status
     */
    saveStoredPreference(theme) {
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem(this.storageKey, theme);
                return true;
            }
        } catch (error) {
            console.warn('Failed to save theme preference:', error);
        }
        return false;
    }

    /**
     * Clear stored theme preference
     * @returns {boolean} Success status
     */
    clearStoredPreference() {
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.removeItem(this.storageKey);
                return true;
            }
        } catch (error) {
            console.warn('Failed to clear theme preference:', error);
        }
        return false;
    }

    /**
     * Trigger theme change event
     * @param {string} previousTheme - Previous theme
     * @param {string} currentTheme - Current theme
     * @param {boolean} userTriggered - Whether change was user-initiated
     */
    triggerThemeChange(previousTheme, currentTheme, userTriggered) {
        const event = {
            type: 'themechange',
            detail: {
                previousTheme,
                currentTheme,
                userTriggered,
                timestamp: Date.now()
            }
        };

        // Call all registered listeners
        this.listeners.forEach(listener => {
            try {
                listener(event);
            } catch (error) {
                console.error('Theme change listener error:', error);
            }
        });
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}

// Make available globally for direct usage
if (typeof window !== 'undefined') {
    window.ThemeManager = ThemeManager;
}