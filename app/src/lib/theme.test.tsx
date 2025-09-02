import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from './theme';

describe('theme', () => {
  it('injects CSS variables when theme changes', () => {
    const wrapper: React.FC<React.PropsWithChildren> = ({ children }) => (
      <ThemeProvider>{children}</ThemeProvider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.setCustomTheme({ primary: '#123456', textPrimary: '#111111' });
    });

    const root = document.documentElement;
    expect(root.style.getPropertyValue('--surge-primary').trim()).toBe('#123456');
    expect(root.style.getPropertyValue('--surge-text-primary').trim()).toBe('#111111');
  });
});

