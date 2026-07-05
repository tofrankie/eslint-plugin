## Why

仓库已经有 `@tofrankie/eslint-plugin-wxml`，但缺少一个面向小程序 JS 代码的 ESLint 插件与规则，导致 `Page`、`Component`、`Behavior` 配置对象中的成员分组与空行风格无法统一、也无法自动修复。现在补齐该能力，可以让小程序项目获得和现有插件一致的开发体验，并为后续继续扩展小程序规则集打下基础。

## What Changes

- 补全现有 `packages/miniprogram` 包，使其成为可发布的 `@tofrankie/eslint-plugin-miniprogram`
- 新增 `miniprogram/padding-line-between-members` 可自动修复规则，用于约束小程序 `Page`、`Component`、`Behavior` 入参对象中成员属性和成员方法之间的空行
- 将规则扩展到 `Component` 与 `Behavior` 的指定二级对象，包括 `properties`、`lifetimes`、`pageLifetimes`、`methods`、`observers`、`relations`
- 规范注释与空行的组合行为，包括首个成员前空行移除、多空行压缩为一个空行、注释前后空行保留规则
- 仅面向 ESLint v9+ 的 flat config 交付插件能力，不提供 legacy config 兼容层
- 为新规则补充测试、README 与 `eslint-doc-generator` 文档产物，并完善包元信息、导出与脚本

## Capabilities

### New Capabilities

- `padding-line-between-members`: 为小程序 `Page`、`Component`、`Behavior` 对象成员提供一致的空行校验与自动修复能力

### Modified Capabilities

无

## Impact

- 受影响代码：`packages/miniprogram` 下的源码、测试、文档、构建与包配置
- 受影响 API：新增 `miniprogram/padding-line-between-members` 规则，以及面向 flat config 的推荐配置暴露方式
- 依赖与工具：复用 `@typescript-eslint/utils`、Vitest、`eslint-doc-generator` 以及与 `packages/wxml` 对齐的打包脚本
