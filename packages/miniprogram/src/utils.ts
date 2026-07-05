import { ESLintUtils } from '@typescript-eslint/utils'

export const createRule = ESLintUtils.RuleCreator(
  name =>
    `https://github.com/tofrankie/eslint-plugin/blob/main/packages/miniprogram/docs/rules/${name}.md`
)
