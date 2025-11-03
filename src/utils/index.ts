export * from './static-resource'
export * from './api-proxy'

/**
 * Convert JSON-like strings to standard JSON strings
 */
export function normalizeJSON(input?: string): string {
  if (!input) return ''
  try {
    return JSON.stringify(JSON.parse(input), null, 2)
  } catch {
    try {
      // Only remove whitespace at key positions, preserve spaces in values
      let normalized = input.replace(/({|,|\[)\s+|\s+(?=}|\]|:)/g, '$1')
      // Handle unquoted keys
      normalized = normalized.replace(/({|,)([a-zA-Z0-9_$]+?):/g, '$1"$2":')
      // Handle single quotes
      normalized = normalized.replace(/'([^']*)'(?=\s*[,}\]])/g, '"$1"')
      // Handle trailing commas
      normalized = normalized.replace(/,\s*([}\]])/g, '$1')
      return JSON.stringify(JSON.parse(normalized), null, 2)
    } catch {
      throw new Error('Invalid JSON-like string')
    }
  }
}

/**
 * Compress JSON string, remove all whitespace characters
 */
export function compressJSON(input?: string): string {
  if (!input) return ''
  try {
    return JSON.stringify(JSON.parse(input))
  } catch {
    throw new Error('Invalid JSON string')
  }
}

export function formatJson(json: Record<string, unknown>) {
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
  window.open(
    'https://github.com/vainjs/any-proxy/blob/main/README.md',
    '_blank'
  )
}

export function openFeedback() {
  window.open('https://github.com/vainjs/any-proxy/issues', '_blank')
}
