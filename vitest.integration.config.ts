import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    testTimeout: 30000, // Longer timeout for integration tests
    include: ['src/**/*.integration.test.ts'],
    setupFiles: ['./src/test-setup.ts'],
  },
});