export default {
  '**/*.{js,ts}': ['eslint --fix', 'prettier --write'],
  '**/*.{json,md,yaml,wxml}': ['prettier --write "!pnpm-lock.yaml"'],
}
