import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../../App';
import { ThemeProvider } from '../lib/theme';
import { TranslationProvider } from '../lib/i18n';
import { Provider } from '../lib/store';

function renderWithProviders(path: string) {
  return render(
    <ThemeProvider>
      <TranslationProvider>
        <Provider>
          <MemoryRouter initialEntries={[path]}>
            <App />
          </MemoryRouter>
        </Provider>
      </TranslationProvider>
    </ThemeProvider>
  );
}

describe('routes health check', () => {
  it('deep-link to /aq10 renders AQ10 intake', async () => {
    renderWithProviders('/aq10');
    // Header text from AQ10 page
    expect(
      await screen.findByText(/AQ10\s*-\s*Surge\s*\/\s*Transient\s*Study\s*Intake/i)
    ).toBeInTheDocument();
  });

  it('root renders Application step', async () => {
    renderWithProviders('/');
    expect(await screen.findByText(/Media\s*\/\s*Application/i)).toBeInTheDocument();
  });

  it('designer route mounts without crashing', async () => {
    renderWithProviders('/designer');
    // Title from Designer header
    expect(await screen.findByText(/Design\s*&\s*Sizing/i)).toBeInTheDocument();
  });
});

