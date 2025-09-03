/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

interface Theme {
  // Colors
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  
  // Backgrounds
  bgPrimary: string;
  bgSecondary: string;
  bgTertiary: string;
  
  // Text
  textPrimary: string;
  textSecondary: string;
  textInverse: string;
  
  // Typography
  fontSans?: string;
  fontHeading?: string;
  
  // Borders
  borderColor: string;
  
  // Effects
  shadow: string;
  shadowLg: string;
}

const defaultTheme: Theme = {
  primary: '#3b82f6',
  secondary: '#06b6d4',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  
  bgPrimary: '#f8fafc',
  bgSecondary: '#ffffff',
  bgTertiary: '#f1f5f9',
  
  textPrimary: '#0f172a',
  textSecondary: '#64748b',
  textInverse: '#ffffff',
  fontSans: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
  fontHeading: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
  
  borderColor: '#e2e8f0',
  
  shadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  shadowLg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
};

const charlatteTheme: Theme = {
  primary: '#0052CC',
  secondary: '#00A3E0',
  success: '#00875A',
  warning: '#FF8B00',
  error: '#DE350B',
  
  bgPrimary: '#F4F5F7',
  bgSecondary: '#FFFFFF',
  bgTertiary: '#FAFBFC',
  
  textPrimary: '#172B4D',
  textSecondary: '#5E6C84',
  textInverse: '#FFFFFF',
  fontSans: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
  fontHeading: 'Montserrat, Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
  
  borderColor: '#DFE1E6',
  
  shadow: '0 1px 2px rgba(9, 30, 66, 0.08)',
  shadowLg: '0 8px 16px rgba(9, 30, 66, 0.15)'
};

interface ThemeContextType {
  theme: Theme;
  setCustomTheme: (theme: Partial<Theme>) => void;
  detectHostTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  // Detect host CSS variables and adapt theme
  const detectHostTheme = () => {
    if (typeof window === 'undefined') return;

    const computedStyle = getComputedStyle(document.documentElement);
    
    // Try to read CSS variables from the host page
    const hostTheme: Partial<Theme> = {};
    
    // Common CSS variable patterns to check
    const varMappings: Array<{ cssVar: string; themeKey: keyof Theme }> = [
      { cssVar: '--color-primary', themeKey: 'primary' },
      { cssVar: '--primary-color', themeKey: 'primary' },
      { cssVar: '--brand-color', themeKey: 'primary' },
      { cssVar: '--color-secondary', themeKey: 'secondary' },
      { cssVar: '--secondary-color', themeKey: 'secondary' },
      { cssVar: '--accent-color', themeKey: 'secondary' },
      { cssVar: '--success-color', themeKey: 'success' },
      { cssVar: '--warning-color', themeKey: 'warning' },
      { cssVar: '--error-color', themeKey: 'error' },
      { cssVar: '--danger-color', themeKey: 'error' },
      { cssVar: '--bg-primary', themeKey: 'bgPrimary' },
      { cssVar: '--background', themeKey: 'bgPrimary' },
      { cssVar: '--bg-secondary', themeKey: 'bgSecondary' },
      { cssVar: '--surface', themeKey: 'bgSecondary' },
      { cssVar: '--text-primary', themeKey: 'textPrimary' },
      { cssVar: '--text-color', themeKey: 'textPrimary' },
      { cssVar: '--text-secondary', themeKey: 'textSecondary' },
      { cssVar: '--text-muted', themeKey: 'textSecondary' },
      { cssVar: '--border-color', themeKey: 'borderColor' },
      { cssVar: '--divider-color', themeKey: 'borderColor' },
      // Fonts
      { cssVar: '--font-sans', themeKey: 'fontSans' },
      { cssVar: '--font-family-sans', themeKey: 'fontSans' },
      { cssVar: '--font-family-base', themeKey: 'fontSans' },
      { cssVar: '--font-heading', themeKey: 'fontHeading' },
      { cssVar: '--font-family-heading', themeKey: 'fontHeading' },
    ];

    for (const { cssVar, themeKey } of varMappings) {
      const value = computedStyle.getPropertyValue(cssVar).trim();
      if (value) {
        hostTheme[themeKey] = value;
      }
    }

    // Check for Charlatte-specific theme
    const isCharlatteSite =
      window.location.hostname.includes('charlatte') ||
      document.querySelector('[data-charlatte-theme]');
    
    if (isCharlatteSite) {
      setTheme({ ...charlatteTheme, ...hostTheme });
    } else if (Object.keys(hostTheme).length > 0) {
      setTheme({ ...defaultTheme, ...hostTheme });
    }
  };

  const setCustomTheme = (customTheme: Partial<Theme>) => {
    setTheme(prev => ({ ...prev, ...customTheme }));
  };

  useEffect(() => {
    detectHostTheme();
    
    // Listen for theme changes (e.g., dark mode toggle)
    const observer = new MutationObserver(() => {
      detectHostTheme();
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme', 'data-charlatte-theme']
    });
    
    // Listen for CSS variable changes
    window.addEventListener('theme-change', detectHostTheme);
    
    return () => {
      observer.disconnect();
      window.removeEventListener('theme-change', detectHostTheme);
    };
  }, []);

  // Inject theme as CSS variables for easy usage
  useEffect(() => {
    const root = document.documentElement;
    
    (Object.entries(theme) as Array<[keyof Theme, string | undefined]>).forEach(([k, v]) => {
      if (typeof v === 'string') {
        const cssVarName = `--surge-${k.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        root.style.setProperty(cssVarName, v);
      }
    });
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setCustomTheme, detectHostTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}

// Hook-form (was "themed" causing rules-of-hooks violation)
export function useThemed<T extends Record<string, unknown>>(factory: (theme: Theme) => T): T {
  const { theme } = useTheme();
  return factory(theme);
}
