import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    deps: {
      // inline these so Vitest bundles/transforms them instead of requiring raw ESM at runtime
      inline: ['isomorphic-dompurify', 'html-encoding-sniffer', '@exodus/bytes'],
    },
  },
});
