import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['lib/**/*.test.ts'],
    // Dummy values so lib/supabase.ts's createClient() call doesn't throw at import time.
    // No real client calls happen in tests (all dependencies are injected via overrides).
    env: { NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co', SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key' },
  },
  resolve: { alias: { 'server-only': new URL('./lib/__mocks__/server-only.ts', import.meta.url).pathname } },
})
