import { defineConfig } from 'vitest/config'

export default defineConfig(({ mode }) => ({
	test: {
		coverage: {
			all: true,
			include: ['src/**'],
		},
	},
}))
