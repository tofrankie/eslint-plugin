import { name, version } from '../package.json'
import { rules } from './rules'

const plugin = {
  configs: {
    get recommended() {
      // eslint-disable-next-line ts/no-use-before-define
      return recommended
    },
  },
  meta: { name, version },
  rules,
}

const recommended = {
  plugins: {
    'example-typed-linting': plugin,
  },
  rules,
}

export default plugin
