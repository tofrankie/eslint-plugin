# @tofrankie/miniprogram/padding-line-between-members

📝 Enforce a single blank line between first-level members in miniprogram option objects.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## 规则说明

该规则要求在 `Page`、`Component` 和 `Behavior` 配置对象中的第一层成员之间保留一个空行。

对于 `Component` 和 `Behavior`，它还会继续检查受支持的第二层对象分组中的第一层成员。

第二层对象处理范围如下：

| 配置对象    | 第二层对象处理范围                                                              |
| :---------- | :------------------------------------------------------------------------------ |
| `Page`      | 不处理第二层对象，只检查传入 `Page()` 的顶层成员                                |
| `Component` | `properties`、`lifetimes`、`pageLifetimes`、`methods`、`observers`、`relations` |
| `Behavior`  | `properties`、`methods`、`observers`、`relations`                               |

以下代码会触发报错：

```js
Page({
  data: {},
  ready() {},
})
```

```js
Component({
  properties: {
    foo: String,
    bar: String,
  },
})
```

以下代码是符合规则的：

```js
Page({
  data: {},

  ready() {},
})
```

```js
Component({
  properties: {
    foo: String,

    bar: String,
  },
})
```
