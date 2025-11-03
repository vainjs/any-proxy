import type { InterceptRule } from '@/type'

type FetchFunction = typeof window.fetch

/**
 * URL matching function
 * Supports multiple matching modes:
 * 1. Exact match: Full URL equality
 * 2. Regex match: /pattern/ format (most special, prioritized)
 * 3. Wildcard match: Supports * wildcard
 * 4. Absolute path match: When pattern is absolute URL and url is relative path
 */
function matchUrl(url: string, pattern: string): boolean {
  // 1. Exact match
  if (url === pattern) return true

  // 2. Regex match - Most special format, prioritize detection
  if (pattern.startsWith('/') && pattern.endsWith('/') && pattern.length > 2) {
    try {
      const regex = new RegExp(pattern.slice(1, -1))
      return regex.test(url)
    } catch {
      return false
    }
  }

  // 3. Wildcard match - Convert * to regex
  if (pattern.includes('*')) {
    const regexPattern = pattern.replace(/\*/g, '.*').replace(/\./g, '\\.')
    try {
      return new RegExp(`^${regexPattern}$`).test(url)
    } catch {
      return false
    }
  }

  // 4. Absolute path match - pattern is absolute URL, url is relative path
  if (/^https?:\/\//.test(pattern) && !/^https?:\/\//.test(url)) {
    try {
      const patternUrl = new URL(pattern)
      const patternPath =
        patternUrl.pathname + patternUrl.search + patternUrl.hash
      return url === patternPath
    } catch {
      return false
    }
  }

  return false
}

function findMatchedRule(
  url: string,
  method: string,
  rules: InterceptRule[]
): InterceptRule | null {
  for (const rule of rules) {
    const urlMatches = matchUrl(url, rule.pattern)
    const methodMatches =
      !rule.method ||
      rule.method === 'ALL' ||
      rule.method === method.toUpperCase()

    if (urlMatches && methodMatches) {
      return rule
    }
  }
  return null
}

function createMockResponse(rule: InterceptRule): Response {
  const data = rule.response.data
  const body = typeof data === 'string' ? data : JSON.stringify(data)

  return new Response(body, {
    status: 200,
    statusText: 'AnyProxy Mocked',
    headers: {
      'Content-Type': 'application/json',
      'X-Mocked-By': 'AnyProxy',
    },
  })
}

export function createProxyFetch(
  nativeFetch: FetchFunction,
  getRules: () => InterceptRule[]
): FetchFunction {
  return async function (
    ...args: Parameters<FetchFunction>
  ): Promise<Response> {
    const [input, init] = args
    const url =
      typeof input === 'string'
        ? input
        : input instanceof URL
          ? input.href
          : (input as Request).url
    const method = init?.method || 'GET'
    const rules = getRules()
    const matchedRule = findMatchedRule(url, method, rules)

    if (matchedRule) {
      console.log(`✓ [AnyProxy] Fetch Intercepted: ${method} ${url}`)
      return Promise.resolve(createMockResponse(matchedRule))
    }

    return nativeFetch(...args)
  }
}

const MOCK_HEADERS = Object.freeze({
  'Content-Type': 'application/json',
  'X-Mocked-By': 'AnyProxy',
})

const MOCK_HEADERS_STRING = Object.entries(MOCK_HEADERS)
  .map(([key, value]) => `${key}: ${value}`)
  .join('\r\n')

/**
 * Generic function to set XHR response properties
 */
function setXHRProperties(
  xhr: XMLHttpRequest,
  url: string,
  status: number,
  responseText: string
): void {
  const properties = [
    ['readyState', 4],
    ['status', status],
    ['statusText', 'AnyProxy Mocked'],
    ['response', responseText],
    ['responseText', responseText],
    ['responseType', 'text'],
    ['responseURL', url],
  ] as const

  properties.forEach(([prop, value]) => {
    Object.defineProperty(xhr, prop, { writable: true, value })
  })
}

export function createProxyXHR(
  NativeXHR: typeof XMLHttpRequest,
  getRules: () => InterceptRule[]
) {
  return class ProxyXMLHttpRequest extends NativeXHR {
    private _url = ''
    private _method = ''
    private _matchedRule: InterceptRule | null = null
    private _isIntercepted = false

    constructor() {
      super()
    }

    open(
      method: string,
      url: string | URL,
      async = true,
      username?: string | null,
      password?: string | null
    ): void {
      this._method = method.toUpperCase()
      this._url = url instanceof URL ? url.href : url
      this._isIntercepted = false
      const rules = getRules()
      this._matchedRule = findMatchedRule(this._url, this._method, rules)

      if (this._matchedRule) {
        this._isIntercepted = true
        console.log(
          `✓ [AnyProxy] XHR Intercepted: ${this._method} ${this._url}`
        )
        return
      }

      if (username !== undefined && password !== undefined) {
        super.open(method, url, async, username, password)
      } else if (username !== undefined) {
        super.open(method, url, async, username)
      } else {
        super.open(method, url, async)
      }
    }

    send(body?: Document | XMLHttpRequestBodyInit | null): void {
      if (this._isIntercepted && this._matchedRule) {
        this._mockResponse(this._matchedRule)
        return
      }
      super.send(body)
    }

    private _mockResponse(rule: InterceptRule): void {
      const data = rule.response.data
      const responseText =
        typeof data === 'string' ? data : JSON.stringify(data)

      setTimeout(() => {
        setXHRProperties(this, this._url, 200, responseText)
        this.getResponseHeader = (name: string) =>
          MOCK_HEADERS[name as keyof typeof MOCK_HEADERS] || null
        this.getAllResponseHeaders = () => MOCK_HEADERS_STRING
        this.dispatchEvent(new Event('readystatechange'))
        this.dispatchEvent(new Event('load'))
        this.dispatchEvent(new Event('loadend'))
      }, 0)
    }

    setRequestHeader(name: string, value: string): void {
      if (this._isIntercepted) {
        return
      }
      super.setRequestHeader(name, value)
    }

    abort(): void {
      if (this._isIntercepted) {
        return
      }
      super.abort()
    }
  }
}
