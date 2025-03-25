export * from './static-resource'
export * from './api-proxy'

/**
 * 将类 JSON 字符串转换为标准 JSON 字符串
 */
export function normalizeJSON(input?: string): string {
  if (!input) return ''
  try {
    return JSON.stringify(JSON.parse(input), null, 2)
  } catch {
    try {
      // 只移除关键位置的空白字符，保留值中的空格
      let normalized = input.replace(/({|,|\[)\s+|\s+(?=}|\]|:)/g, '$1')
      // 处理未加引号的键
      normalized = normalized.replace(/({|,)([a-zA-Z0-9_$]+?):/g, '$1"$2":')
      // 处理单引号
      normalized = normalized.replace(/'([^']*)'(?=\s*[,}\]])/g, '"$1"')
      // 处理末尾的逗号
      normalized = normalized.replace(/,\s*([}\]])/g, '$1')
      return JSON.stringify(JSON.parse(normalized), null, 2)
    } catch (e) {
      throw new Error('Invalid JSON-like string')
    }
  }
}

/**
 * 压缩 JSON 字符串，移除所有空白字符
 */
export function compressJSON(input?: string): string {
  if (!input) return ''
  try {
    return JSON.stringify(JSON.parse(input))
  } catch {
    throw new Error('Invalid JSON string')
  }
}

export function formatJson(json: Record<string, any>) {
  try {
    return JSON.stringify(json, null, 2)
  } catch {
    return undefined
  }
}

export async function isValidTab(tabId?: number) {
  if (tabId) {
    try {
      const tab = await browser.tabs.get(tabId)
      return !!tab
    } catch {
      return false
    }
  }
  return false
}

export function openHelp() {
  window.open('https://github.com/vainjs/any-proxy/blob/main/README.md', '_blank')
}

export function openFeedback() {
  window.open('https://github.com/vainjs/any-proxy/issues', '_blank')
}
