import * as path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './common'),
        },
    },
});
