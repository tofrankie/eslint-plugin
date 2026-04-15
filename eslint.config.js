import { defineConfig } from '@tofrankie/eslint'

export default defineConfig({
  ignores: ['packages/demo', '**/*.md'],
  typescript: true,
})
