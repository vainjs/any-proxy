# AnyProxy

简体中文 | [English](./README.md)

AnyProxy 是一个功能强大的 Chrome 扩展程序，让你能够轻松地重定向网络资源，而无需修改服务器端代码。它通过基于正则表达式的规则，提供了一种灵活的方式来将任何网络请求转发到不同的目标地址。

#### 主要特性：

- 简单配置：支持使用正则表达式配置转发规则
- 无需服务器更改：无需修改目标服务器即可重定向请求
- 实时更新：规则立即生效，无需重启浏览器
- 开发者友好：完美适配本地开发和测试场景
- 资源类型：支持 JavaScript、CSS 和 API 请求

#### 适用场景：

- 前端开发人员测试本地更改
- QA 工程师比较不同版本
- 调试和排查网络问题
- 无需服务器部署即可进行 A/B 测试

## 使用方法

代理配置在每个数组中包含两个部分：

- 第一个值对应 `regexFilter`
- 第二个值对应 `regexSubstitution`

详细信息请参考：

- [regexFilter 文档](https://developer.chrome.com/docs/extensions/reference/api/declarativeNetRequest#filter-matching-characters)
- [regexSubstitution 文档](https://developer.chrome.com/docs/extensions/reference/api/declarativeNetRequest#type-Redirect)

**注意：** 唯一的区别是 regexSubstitution 中的捕获组引用从 `\1`-`\9` 改为 `$1`-`$9`。

#### 配置示例

```json
{
  "proxy": [
    [
      "https://developer.mozilla.org/static/js/chunk.js",
      "http://localhost:3000/js/proxy.js"
    ],
    [
      "https://developer.mozilla.org/(.*)/js/chunk.js",
      "http://localhost:3000/$1/proxy.js"
    ],
    [
      "https://developer.mozilla.org/(.*)/js/(.*).js",
      "http://localhost:3000/$1/$2.js"
    ]
  ]
}
```
