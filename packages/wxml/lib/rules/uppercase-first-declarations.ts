import { createRule } from '../utils'

// Type: RuleModule<"uppercase", ...>
export const rule = createRule({
  name: 'uppercase-first-declarations',
  meta: {
    docs: {
      description: 'Function declaration names should start with an upper-case letter.',
    },
    messages: {
      uppercase: 'Start this name with an upper-case letter.',
    },
    type: 'suggestion',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      FunctionDeclaration(node) {
        if (node.id != null) {
          if (/^[a-z]/.test(node.id.name)) {
            context.report({
              messageId: 'uppercase',
              node: node.id,
            })
          }
        }
      },
    }
  },
})
