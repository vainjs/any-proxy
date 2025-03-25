# AnyProxy

A Chrome extension that easily forwards any network resources without needing to update the server.

## Usage

The proxy configuration consists of two parts in each array element:

- First value corresponds to `regexFilter`
- Second value corresponds to `regexSubstitution`

For detailed information, please refer to:

- [regexFilter documentation](https://developer.chrome.com/docs/extensions/reference/api/declarativeNetRequest#filter-matching-characters)
- [regexSubstitution documentation](https://developer.chrome.com/docs/extensions/reference/api/declarativeNetRequest#type-Redirect)

**Note:** The only difference is that capture group references in regexSubstitution are changed from `\1`-`\9` to `$1`-`$9`.

### Example Configuration

```json
{
  "proxy": [
    ["https://developer.mozilla.org/static/js/chunk.js", "http://localhost:3000/js/proxy.js"],
    ["https://developer.mozilla.org/(.*)/js/chunk.js", "http://localhost:3000/$1/proxy.js"],
    ["https://developer.mozilla.org/(.*)/js/(.*).js", "http://localhost:3000/$1/$2.js"]
  ]
}
```
