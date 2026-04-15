import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: 'src/index.ts',
  format: ['cjs'],
  unbundle: true,
  dts: true,
  clean: true,
  target: 'node18',
})
