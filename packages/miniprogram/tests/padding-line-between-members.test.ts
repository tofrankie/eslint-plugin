import { RuleTester } from '@typescript-eslint/rule-tester'
import { afterAll, describe, it } from 'vitest'
import paddingLineBetweenMembers from '../src/rules/padding-line-between-members'

RuleTester.afterAll = afterAll
RuleTester.describe = describe
RuleTester.it = it

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
})

ruleTester.run('padding-line-between-members', paddingLineBetweenMembers, {
  valid: [
    {
      code: `
        Page({
          data: {},

          ready() {},
        })
      `,
    },
    {
      code: `
        Component({
          properties: {
            foo: String,

            bar: String,
          },

          data: {}, // private data

          // lifecycle

          attached() {},

          ready() {},

          methods: {
            onTap() {},

            // private method

            onLongPress() {},
          },
        })
      `,
    },
    {
      code: `
        Behavior({
          properties: {
            foo: String,

            bar: String,
          },

          methods: {
            onTap() {},

            onLongPress() {},
          },
        })
      `,
    },
  ],
  invalid: [
    {
      code: `
        Page({
          data: {},
          ready() {},
        })
      `,
      output: `
        Page({
          data: {},

          ready() {},
        })
      `,
      errors: [
        {
          messageId: 'expectedPadding',
          line: 4,
        },
      ],
    },
    {
      code: `
        Page({


          data: {},



          ready() {},
        })
      `,
      output: `
        Page({
          data: {},

          ready() {},
        })
      `,
      errors: [{ messageId: 'expectedPadding' }, { messageId: 'expectedPadding' }],
    },
    {
      code: `
        Page({
          data: {},

          ready() {},

        })
      `,
      output: `
        Page({
          data: {},

          ready() {},
        })
      `,
      errors: [{ messageId: 'expectedPadding' }],
    },
    {
      code: `
        Page({
          data: {},
          // comment for ready

          ready() {},
        })
      `,
      output: `
        Page({
          data: {},

          // comment for ready

          ready() {},
        })
      `,
      errors: [{ messageId: 'expectedPadding' }],
    },
    {
      code: `
        Component({
          data: {}, // inline comment
          attached() {}, // attached comment
          ready() {},
        })
      `,
      output: `
        Component({
          data: {}, // inline comment

          attached() {}, // attached comment

          ready() {},
        })
      `,
      errors: [{ messageId: 'expectedPadding' }, { messageId: 'expectedPadding' }],
    },
    {
      code: `
        Component({
          properties: {
            foo: String,
            bar: String,

          },

          methods: {
            onTap() {},
            onLongPress() {},
          },
        })
      `,
      output: `
        Component({
          properties: {
            foo: String,

            bar: String,
          },

          methods: {
            onTap() {},

            onLongPress() {},
          },
        })
      `,
      errors: [
        { messageId: 'expectedPadding' },
        { messageId: 'expectedPadding' },
        { messageId: 'expectedPadding' },
      ],
    },
    {
      code: `
        Behavior({
          properties: {
            foo: String,
            bar: String,
          },

          methods: {
            onTap() {},
            // next method

            onLongPress() {},


          },
        })
      `,
      output: `
        Behavior({
          properties: {
            foo: String,

            bar: String,
          },

          methods: {
            onTap() {},

            // next method

            onLongPress() {},
          },
        })
      `,
      errors: [
        { messageId: 'expectedPadding' },
        { messageId: 'expectedPadding' },
        { messageId: 'expectedPadding' },
      ],
    },
    {
      code: `
        Page({
          data: {},
          profile: {},

          methods: {},
          ready() {},

        })
      `,
      output: `
        Page({
          data: {},

          profile: {},

          methods: {},

          ready() {},
        })
      `,
      errors: [
        {
          messageId: 'expectedPadding',
          line: 4,
        },
        {
          messageId: 'expectedPadding',
          line: 7,
        },
        {
          messageId: 'expectedPadding',
          line: 9,
        },
      ],
    },
    {
      code: `
        Page({
          data: {},
          profile: {},
          // profile note

          methods: {},


        })
      `,
      output: `
        Page({
          data: {},

          profile: {},

          // profile note

          methods: {},
        })
      `,
      errors: [
        {
          messageId: 'expectedPadding',
          line: 4,
        },
        {
          messageId: 'expectedPadding',
          line: 5,
        },
        {
          messageId: 'expectedPadding',
          line: 10,
        },
      ],
    },
  ],
})
