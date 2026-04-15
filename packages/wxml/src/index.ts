import { name, version } from '../package.json'
import { rules } from './rules'

const plugin = {
  configs: {
    get recommended() {
      // eslint-disable-next-line ts/no-use-before-define
      return recommended
    },
  },
  meta: { name, version, namespace: 'wxml' },
  rules,
}

const recommended = {
  plugins: {
    wxml: plugin,
  },
  rules: {
    'wxml/uppercase-first-declarations': 'error',
  },
}

export default plugin
