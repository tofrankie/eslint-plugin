import { ESLint } from 'eslint'
import { describe, expect, it } from 'vitest'
import miniprogram from '../src/index'

async function lintWithRecommended(code: string, fix = false) {
  const eslint = new ESLint({
    fix,
    overrideConfigFile: true,
    overrideConfig: [...miniprogram.configs.recommended] as any,
  })

  const [result] = await eslint.lintText(code, {
    filePath: 'sample.js',
  })

  return result
}

describe('recommended config', () => {
  it('enables padding-line-between-members by default', async () => {
    const result = await lintWithRecommended(`
      Page({
        data: {},
        ready() {},
      })
    `)

    expect(Array.isArray(miniprogram.configs.recommended)).toBe(true)
    expect(result.messages).toHaveLength(1)
    expect(result.messages[0]?.ruleId).toBe('miniprogram/padding-line-between-members')
  })

  it('produces stable fixer output across multiple runs', async () => {
    const firstResult = await lintWithRecommended(
      `
        Component({

          data: {}, // inline comment
          attached() {},


        })
      `,
      true
    )

    expect(firstResult.output).toBe(`
        Component({
          data: {}, // inline comment

          attached() {},
        })
      `)

    const secondResult = await lintWithRecommended(firstResult.output ?? '', true)

    expect(secondResult.output).toBeUndefined()
    expect(secondResult.messages).toHaveLength(0)
  })
})
