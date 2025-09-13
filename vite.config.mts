import { resolve } from 'node:path'
import { builtinModules } from 'node:module'
import dts from 'vite-plugin-dts'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	appType: 'custom',
	build: {
		target: 'esnext',
		lib: {
			entry: { index: resolve(__dirname, 'src/index.ts') },
			formats: ['es'],
		},
		rollupOptions: {
			external: builtinModules.flatMap((mod) => [mod, `node:${mod}`]),
			onwarn(warning) {
				throw Object.assign(new Error(), warning)
			},
		},
		sourcemap: true,
	},
	plugins: [
		dts({
			outDir: 'dist',
			include: ['src/index.ts'],
			afterDiagnostic: (diagnosis) => {
				if (diagnosis.length > 0) {
					throw new Error('Issue while generating declaration files', {
						cause: diagnosis,
					})
				}
			},
		}),
	],
	test: {
		coverage: {
			all: true,
			include: ['src/**'],
		},
	},
})

