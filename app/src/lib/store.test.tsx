import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { Provider, useStore } from './store';

describe('store', () => {
  it('throws when used without Provider', () => {
    expect(() => renderHook(() => useStore())).toThrow(/Provider/);
  });

  it('provides state within Provider', () => {
    const wrapper: React.FC<React.PropsWithChildren> = ({ children }) => (
      <Provider>{children}</Provider>
    );
    const { result } = renderHook(() => useStore(), { wrapper });
    expect(result.current.state).toBeDefined();
    expect(typeof result.current.setState).toBe('function');
  });
});
