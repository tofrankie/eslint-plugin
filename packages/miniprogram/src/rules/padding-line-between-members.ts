import type { TSESLint, TSESTree } from '@typescript-eslint/utils'
import { AST_NODE_TYPES } from '@typescript-eslint/utils'
import { createRule } from '../utils'

const componentNestedKeys = new Set([
  'properties',
  'lifetimes',
  'pageLifetimes',
  'methods',
  'observers',
  'relations',
])

const behaviorNestedKeys = new Set(['properties', 'methods', 'observers', 'relations'])

type ObjectMember = TSESTree.ObjectExpression['properties'][number]

interface RangeEdit {
  range: TSESTree.Range
  text: string
}

interface Violation extends RangeEdit {
  target: TSESTree.Node | TSESTree.Comment | TSESTree.Token
}

export default createRule({
  name: 'padding-line-between-members',
  meta: {
    type: 'layout',
    docs: {
      description:
        'enforce a single blank line between first-level members in miniprogram option objects.',
    },
    fixable: 'whitespace',
    messages: {
      expectedPadding: 'Expected members in this object to be separated by a single blank line.',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node) {
        checkCallExpression(context, node)
      },
    }
  },
})

function checkCallExpression(
  context: Readonly<TSESLint.RuleContext<'expectedPadding', []>>,
  node: TSESTree.CallExpression
) {
  if (node.callee.type !== AST_NODE_TYPES.Identifier) {
    return
  }

  const [firstArgument] = node.arguments

  if (firstArgument?.type !== AST_NODE_TYPES.ObjectExpression) {
    return
  }

  if (
    node.callee.name !== 'Page' &&
    node.callee.name !== 'Component' &&
    node.callee.name !== 'Behavior'
  ) {
    return
  }

  reportObjectIfNeeded(context, firstArgument)
  checkNestedObjects(context, node.callee.name, firstArgument)
}

function checkNestedObjects(
  context: Readonly<TSESLint.RuleContext<'expectedPadding', []>>,
  calleeName: 'Page' | 'Component' | 'Behavior',
  rootObject: TSESTree.ObjectExpression
) {
  const nestedKeys = getNestedKeys(calleeName)

  if (nestedKeys == null) {
    return
  }

  for (const property of rootObject.properties) {
    if (property.type !== AST_NODE_TYPES.Property) {
      continue
    }

    const propertyName = getPropertyName(property)

    if (propertyName == null || !nestedKeys.has(propertyName)) {
      continue
    }

    if (property.value.type !== AST_NODE_TYPES.ObjectExpression) {
      continue
    }

    reportObjectIfNeeded(context, property.value)
  }
}

function getNestedKeys(calleeName: 'Page' | 'Component' | 'Behavior') {
  if (calleeName === 'Component') {
    return componentNestedKeys
  }

  if (calleeName === 'Behavior') {
    return behaviorNestedKeys
  }

  return null
}

function reportObjectIfNeeded(
  context: Readonly<TSESLint.RuleContext<'expectedPadding', []>>,
  node: TSESTree.ObjectExpression
) {
  const violations = collectObjectViolations(node, context.sourceCode)

  if (violations.length === 0) {
    return
  }

  for (const violation of violations) {
    context.report({
      node: violation.target,
      messageId: 'expectedPadding',
      fix(fixer) {
        return fixer.replaceTextRange(violation.range, violation.text)
      },
    })
  }
}

function collectObjectViolations(
  node: TSESTree.ObjectExpression,
  sourceCode: Readonly<TSESLint.SourceCode>
): Violation[] {
  const members = node.properties
  const violations: Violation[] = []

  if (members.length === 0) {
    return violations
  }

  const text = sourceCode.text
  const newline = getNewline(text)
  const comments = sourceCode.getAllComments()
  const openBrace = sourceCode.getFirstToken(node)
  const closeBrace = sourceCode.getLastToken(node)

  if (openBrace == null || closeBrace == null) {
    return violations
  }

  collectLeadingViolations(violations, members[0], openBrace.range[1], comments, text, newline)
  collectBetweenMemberViolations(violations, members, sourceCode, comments, text, newline)
  collectTrailingViolations(
    violations,
    members[members.length - 1],
    closeBrace,
    closeBrace.range[0],
    sourceCode,
    comments,
    text,
    newline
  )

  return violations
}

function collectLeadingViolations(
  violations: Violation[],
  firstMember: ObjectMember,
  openBraceEnd: number,
  comments: TSESTree.Comment[],
  text: string,
  newline: string
) {
  const leadingComments = getCommentsInRange(comments, openBraceEnd, firstMember.range[0])
  const leadingTargetStart =
    leadingComments.length > 0 ? leadingComments[0].range[0] : firstMember.range[0]
  const leadingTarget = leadingComments.length > 0 ? leadingComments[0] : firstMember
  const leadingRange: TSESTree.Range = [openBraceEnd, leadingTargetStart]
  const leadingReplacement = buildNoBlankLine(newline, getIndent(text, leadingTargetStart))

  if (text.slice(...leadingRange) !== leadingReplacement) {
    violations.push({
      range: leadingRange,
      text: leadingReplacement,
      target: leadingTarget,
    })
  }
}

function collectBetweenMemberViolations(
  violations: Violation[],
  members: ObjectMember[],
  sourceCode: Readonly<TSESLint.SourceCode>,
  comments: TSESTree.Comment[],
  text: string,
  newline: string
) {
  for (let index = 0; index < members.length - 1; index += 1) {
    const current = members[index]
    const next = members[index + 1]
    const { end, comments: standaloneComments } = getEffectiveEnd(
      current,
      sourceCode,
      next.range[0],
      comments
    )

    if (standaloneComments.length > 0) {
      const firstStandaloneComment = standaloneComments[0]
      const range: TSESTree.Range = [end, firstStandaloneComment.range[0]]
      const replacement = buildOneBlankLine(
        newline,
        getIndent(text, firstStandaloneComment.range[0])
      )

      if (text.slice(...range) !== replacement) {
        violations.push({
          range,
          text: replacement,
          target: firstStandaloneComment,
        })
      }

      continue
    }

    const range: TSESTree.Range = [end, next.range[0]]
    const replacement = buildOneBlankLine(newline, getIndent(text, next.range[0]))

    if (text.slice(...range) !== replacement) {
      violations.push({
        range,
        text: replacement,
        target: next,
      })
    }
  }
}

function collectTrailingViolations(
  violations: Violation[],
  lastMember: ObjectMember,
  closeBrace: TSESTree.Token,
  closeBraceStart: number,
  sourceCode: Readonly<TSESLint.SourceCode>,
  comments: TSESTree.Comment[],
  text: string,
  newline: string
) {
  const { end: trailingStart, comments: trailingComments } = getEffectiveEnd(
    lastMember,
    sourceCode,
    closeBraceStart,
    comments
  )

  if (trailingComments.length === 0) {
    const range: TSESTree.Range = [trailingStart, closeBraceStart]
    const replacement = buildNoBlankLine(newline, getIndent(text, closeBraceStart))

    if (text.slice(...range) !== replacement) {
      violations.push({
        range,
        text: replacement,
        target: closeBrace,
      })
    }
  }
}

function getEffectiveEnd(
  node: ObjectMember,
  sourceCode: Readonly<TSESLint.SourceCode>,
  nextBoundary: number,
  comments: TSESTree.Comment[]
): { end: number; comments: TSESTree.Comment[] } {
  let end = node.range[1]
  const trailingComma = sourceCode.getTokenAfter(node)

  if (trailingComma?.value === ',' && trailingComma.range[1] <= nextBoundary) {
    end = trailingComma.range[1]
  }

  let endLine = sourceCode.getLocFromIndex(end).line
  const inRange = getCommentsInRange(comments, end, nextBoundary)
  const attachedComments: TSESTree.Comment[] = []

  for (const comment of inRange) {
    if (comment.loc.start.line !== endLine) {
      break
    }

    attachedComments.push(comment)
    end = comment.range[1]
    endLine = comment.loc.end.line
  }

  return {
    end,
    comments: inRange.slice(attachedComments.length),
  }
}

function getPropertyName(node: TSESTree.Property): string | null {
  if (node.computed) {
    return null
  }

  if (node.key.type === AST_NODE_TYPES.Identifier) {
    return node.key.name
  }

  if (node.key.type === AST_NODE_TYPES.Literal && typeof node.key.value === 'string') {
    return node.key.value
  }

  return null
}

function getCommentsInRange(
  comments: TSESTree.Comment[],
  start: number,
  end: number
): TSESTree.Comment[] {
  return comments.filter(comment => comment.range[0] >= start && comment.range[1] <= end)
}

function buildOneBlankLine(newline: string, indent: string): string {
  return `${newline}${newline}${indent}`
}

function buildNoBlankLine(newline: string, indent: string): string {
  return `${newline}${indent}`
}

function getIndent(text: string, index: number): string {
  const lineStart = getLineStart(text, index)
  const prefix = text.slice(lineStart, index)
  const match = prefix.match(/^\s*/)

  return match?.[0] ?? ''
}

function getLineStart(text: string, index: number): number {
  const carriageReturnIndex = text.lastIndexOf('\r', index - 1)
  const newlineIndex = text.lastIndexOf('\n', index - 1)

  return Math.max(carriageReturnIndex, newlineIndex) + 1
}

function getNewline(text: string): string {
  if (text.includes('\r\n')) {
    return '\r\n'
  }

  if (text.includes('\r')) {
    return '\r'
  }

  return '\n'
}
