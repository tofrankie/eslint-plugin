import { name, version } from '../package.json'
import { rules } from './rules'

const plugin = {
  meta: { name, version, namespace: 'miniprogram' },
  rules,
  configs: {
    get recommended() {
      // eslint-disable-next-line ts/no-use-before-define
      return recommended
    },
  },
}

const recommended = [
  {
    plugins: {
      miniprogram: plugin,
    },
    rules: {
      'miniprogram/padding-line-between-members': 'error',
    },
  },
]

export default plugin
