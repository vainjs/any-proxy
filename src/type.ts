import type { EVENT_MESSAGE_ACTION } from './enum'

export type InterceptRule = {
  description?: string
  enabled: boolean
  pattern: string
  method?:
    | 'GET'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'PATCH'
    | 'HEAD'
    | 'OPTIONS'
    | 'ALL'
  response: {
    data: Record<string, unknown>
  }
}

export type ProxyConfig = { proxy: Array<[string, string]> }

export type Message = {
  action: EVENT_MESSAGE_ACTION
}
