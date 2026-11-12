import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Next.js has no Vite config, this file is only for Vitest.
// https://nextjs.org/docs/app/guides/testing/vitest
export default defineConfig({
  // No React Compiler here (it is enabled for the app in next.config.ts): its generated memo-cache
  // branches show up as uncovered branches in coverage, which pulls the SonarQube coverage below
  // the quality gate even when every line is tested. plugin-react only runs it when configured.
  plugins: [react()],
  resolve: {
    // resolves the `@/*` alias from tsconfig.json `paths`
    tsconfigPaths: true,
  },
  test: {
    globals: true,
    environment: 'jsdom', // Needed for React Testing Library
    setupFiles: './src/__tests__/setup.ts',
    // before each test: clear mock calls, restore vi.spyOn spies, undo vi.stubEnv / vi.stubGlobal
    clearMocks: true,
    restoreMocks: true,
    unstubEnvs: true,
    unstubGlobals: true,
    coverage: {
      reporter: ['text', 'json', 'lcov'],
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      exclude: [
        'src/__tests__/**',
        'src/**/*.d.ts',
        'src/types/**',
        // Sentry setup, the root layout (next/font) and the generated preview image only run inside Next.js
        'src/instrumentation.ts',
        'src/instrumentation-client.ts',
        'src/app/layout.tsx',
        'src/app/opengraph-image.tsx',
      ],
    },
  },
});
