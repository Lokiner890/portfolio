import type { ReactElement, ReactNode } from 'react';
import { render as rtlRender, type RenderOptions } from '@testing-library/react';

// app-wide providers (store, query client, theme, etc.) go here,
// so tests render components the same way the app does
function Providers({ children }: { children: ReactNode }) {
  return children;
}

function render(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return rtlRender(ui, { wrapper: Providers, ...options });
}

// re-export everything
export * from '@testing-library/react';
// user interactions (click, type, etc.), closer to a real user than fireEvent
export { default as userEvent } from '@testing-library/user-event';

// override render method
export { render };
