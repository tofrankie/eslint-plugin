import { ESLintUtils } from '@typescript-eslint/utils'

export const createRule = ESLintUtils.RuleCreator(
  name => `https://github.com/tofrankie/eslint-plugin/blob/main/packages/wxml/docs/rules/${name}.md`
)
