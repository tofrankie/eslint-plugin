import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: 'lib/index.ts',
  format: ['cjs'],
  unbundle: true,
  dts: true,
  clean: true,
  target: 'node18',
})
