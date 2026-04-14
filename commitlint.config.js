export default {
  extends: ['@tofrankie/commitlint'],
  rules: {
    'scope-enum': [2, 'always', ['foo', 'bar']],
  },
}
