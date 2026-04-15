import { RuleTester } from '@typescript-eslint/rule-tester'
import { afterAll, describe, it } from 'vitest'
import { rule } from '../src/rules/uppercase-first-declarations'

RuleTester.afterAll = afterAll
RuleTester.describe = describe
RuleTester.it = it

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
})

ruleTester.run('uppercase-first-declarations', rule, {
  valid: [
    {
      code: 'function Foo() {}',
    },
    {
      code: 'const bar = function baz() {}',
    },
    {
      code: 'const qux = () => {}',
    },
    {
      code: 'export default function Foo() {}',
    },
    {
      code: 'export default function () {}',
    },
  ],
  invalid: [
    {
      code: 'function foo() {}',
      errors: [{ messageId: 'uppercase' }],
    },
    {
      code: 'export function bar() {}',
      errors: [{ messageId: 'uppercase' }],
    },
  ],
})
