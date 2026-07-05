# @tofrankie/eslint-plugin-miniprogram

[![npm version](https://img.shields.io/npm/v/@tofrankie/eslint-plugin-miniprogram)](https://www.npmjs.com/package/@tofrankie/eslint-plugin-miniprogram) [![npm package license](https://img.shields.io/npm/l/@tofrankie/eslint-plugin-miniprogram)](https://github.com/tofrankie/eslint-plugin/blob/main/packages/miniprogram/LICENSE) [![npm last update](https://img.shields.io/npm/last-update/@tofrankie/eslint-plugin-miniprogram)](https://www.npmjs.com/package/@tofrankie/eslint-plugin-miniprogram)

面向小程序的 ESLint 插件。

## 安装

需要 ESLint v9+

```bash
pnpm add -D eslint @tofrankie/eslint-plugin-miniprogram
```

## 使用

使用推荐配置：

```js
import miniprogram from '@tofrankie/eslint-plugin-miniprogram'

export default [...miniprogram.configs.recommended]
```

如果你希望只对指定文件范围使用推荐配置：

```js
import miniprogram from '@tofrankie/eslint-plugin-miniprogram'

export default [
  ...miniprogram.configs.recommended.map(config => ({
    ...config,
    files: ['miniprogram/**/*.js'],
  })),
]
```

如果你不想使用推荐配置，可以只注册插件并手动开启规则：

```js
import miniprogram from '@tofrankie/eslint-plugin-miniprogram'

export default [
  {
    plugins: { miniprogram },
    rules: {
      // 'miniprogram/padding-line-between-members': 'warn',
    },
  },
]
```

## 规则列表

<!-- begin auto-generated rules list -->

🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).

| Name                                                                       | Description                                                                            | 🔧  |
| :------------------------------------------------------------------------- | :------------------------------------------------------------------------------------- | :-- |
| [padding-line-between-members](docs/rules/padding-line-between-members.md) | enforce a single blank line between first-level members in miniprogram option objects. | 🔧  |

<!-- end auto-generated rules list -->

## License

MIT License © [Frankie](https://github.com/tofrankie)
