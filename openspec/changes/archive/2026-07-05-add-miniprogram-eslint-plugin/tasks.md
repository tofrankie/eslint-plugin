## 1. 补全 miniprogram 插件包骨架

- [x] 1.1 对齐 `packages/wxml`，补全 `packages/miniprogram` 的 `package.json`、构建配置、TypeScript 配置、README、入口文件与规则导出结构
- [x] 1.2 新增 `packages/miniprogram/src/utils.ts` 与文档链接生成逻辑，确保新规则可以按仓库约定创建
- [x] 1.3 在插件入口中暴露仅面向 ESLint v9+ flat config 的 `rules`、`meta` 与 `recommended` 配置，并默认开启 `miniprogram/padding-line-between-members`

## 2. 实现成员空行规则

- [x] 2.1 新增 `miniprogram/padding-line-between-members` 规则文件，识别 `Page`、`Component`、`Behavior` 的直接调用对象并检查顶层成员空行
- [x] 2.2 扩展规则到 `Component` 与 `Behavior` 的白名单二级对象，覆盖 `properties`、`lifetimes`、`pageLifetimes`、`methods`、`observers`、`relations` 的第一层成员
- [x] 2.3 实现可自动修复的规则逻辑，统一处理缺失空行、多余空行、首成员前空行、尾部空行，以及成员间单行或多行注释的保留规则
- [x] 2.4 为规则补齐社区约定的元信息，至少明确 `meta.type = 'layout'` 与 `meta.fixable = 'whitespace'`
- [x] 2.5 让同一对象中的多个独立空行问题分别报错，并让报错位置尽量贴近实际修复点

## 3. 验证与文档化规则行为

- [x] 3.1 为顶层成员、嵌套成员、注释保留、首成员前空行移除、尾部空行移除补充 `valid`、`invalid` 与 fixer `output` 测试用例
- [x] 3.2 为成员末尾行内注释、多轮修复收敛与幂等行为补充测试用例
- [x] 3.3 为 flat config 下的 `recommended` 配置补充可用性冒烟测试，确认默认开启 `miniprogram/padding-line-between-members`
- [x] 3.4 编写规则说明与 flat config 接入示例，生成 `eslint-doc-generator` 文档并更新包级 README
- [x] 3.5 运行与 `packages/miniprogram` 相关的 lint、typecheck、test、文档生成校验，确认包可构建且产物完整
- [x] 3.6 为多个独立报错点和报错定位补充 fixture 与断言
