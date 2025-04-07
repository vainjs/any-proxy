# AnyProxy

English ｜ [简体中文](./README-zh_CN.md)

AnyProxy is a powerful Chrome extension that allows you to easily redirect network resources without server-side modifications. It provides a flexible way to forward any web requests to different destinations using regex-based rules.

#### Key Features:

- Simple Configuration: Set up forwarding rules with regex patterns
- No Server Changes: Redirect requests without modifying the target server
- Real-time Updates: Rules take effect immediately without browser restart
- Developer Friendly: Perfect for local development and testing
- Resource Types: Support for JavaScript, CSS, and API

#### Perfect for:

- Frontend developers testing local changes
- QA engineers comparing different versions
- Debug and troubleshoot network issues
- A/B testing without server deployment

## Usage

The proxy configuration consists of two parts in each array element:

- First value corresponds to `regexFilter`
- Second value corresponds to `regexSubstitution`

For detailed information, please refer to:

- [regexFilter documentation](https://developer.chrome.com/docs/extensions/reference/api/declarativeNetRequest#filter-matching-characters)
- [regexSubstitution documentation](https://developer.chrome.com/docs/extensions/reference/api/declarativeNetRequest#type-Redirect)

**Note:** The only difference is that capture group references in regexSubstitution are changed from `\1`-`\9` to `$1`-`$9`.

#### Example Configuration

```json
{
  "proxy": [
    ["https://developer.mozilla.org/static/js/chunk.js", "http://localhost:3000/js/proxy.js"],
    ["https://developer.mozilla.org/(.*)/js/chunk.js", "http://localhost:3000/$1/proxy.js"],
    ["https://developer.mozilla.org/(.*)/js/(.*).js", "http://localhost:3000/$1/$2.js"]
  ]
}
```
