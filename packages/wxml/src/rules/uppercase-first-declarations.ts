import { createRule } from '../utils'

export default createRule({
  name: 'uppercase-first-declarations',
  meta: {
    docs: {
      description: 'enforce function declaration names to start with an upper-case letter.',
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
