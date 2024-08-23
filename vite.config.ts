import { sveltekit } from '@sveltejs/kit/vite';
import dotenvExpand from 'dotenv-expand';
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';

export default defineConfig(({ mode }) => {
	if (mode === 'development') {
		const env = loadEnv(mode, process.cwd(), '');
		dotenvExpand.expand({ parsed: env });
	}

	return {
		plugins: [sveltekit()],
		test: {
			include: ['tests/lib/**/*.{test,spec}.{js,ts}'],
			coverage: {
				exclude: [
					'playwright.config.ts',
					'.svelte-kit/**',
					'eslint.config.mjs',
					'postcss.config.js',
					'svelte.config.js',
					'tailwind.config.cjs',
					'vite.config.ts',
					'tests/**',
					'src/routes/**'
				]
			}
		}
	};
});
