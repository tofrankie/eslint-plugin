import { defineConfig } from '@tofrankie/eslint'
import eslintPlugin from 'eslint-plugin-eslint-plugin'

export default defineConfig(
  {
    typescript: true,
  },
  eslintPlugin.configs.recommended
  // {
  //   rules: {
  //     'eslint-plugin/require-meta-docs-description': 'error',
  //   },
  // }
)
