import { resolve } from 'node:path'
import defineConfig from '@lokalise/package-vite-config/package'

export default defineConfig({
	entry: resolve(__dirname, 'src/index.ts'),
	test: {
		coverage: {
			all: true,
			include: ['src/**'],
		},
	},
})

