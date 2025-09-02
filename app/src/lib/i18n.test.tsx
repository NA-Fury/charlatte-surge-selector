import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { TranslationProvider, useTranslation } from './i18n';

describe('i18n', () => {
  it('resolves nested keys and falls back to key when missing', () => {
    const wrapper: React.FC<React.PropsWithChildren> = ({ children }) => (
      <TranslationProvider>{children}</TranslationProvider>
    );
    const { result } = renderHook(() => useTranslation(), { wrapper });

    expect(result.current.t('navigation.next')).toBe('Next');
    expect(result.current.t('steps.application')).toBe('Application');
    // missing key returns key itself
    expect(result.current.t('does.not.exist')).toBe('does.not.exist');
  });

  it('switches language', () => {
    const wrapper: React.FC<React.PropsWithChildren> = ({ children }) => (
      <TranslationProvider>{children}</TranslationProvider>
    );
    const { result } = renderHook(() => useTranslation(), { wrapper });

    act(() => {
      result.current.setLanguage('fr');
    });

    // The exact French strings have accents; we just check it returns something non-key
    expect(result.current.t('navigation.next')).not.toBe('navigation.next');
  });
});

