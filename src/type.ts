import { EVENT_MESSAGE_ACTION } from './enum'

export type InterceptRule = {
  description?: string
  enabled: boolean
  pattern: string
  response: {
    status?: number
    data: any
  }
}

export type ProxyConfig = { proxy: Array<[string, string]> }

export type Message = {
  action: EVENT_MESSAGE_ACTION
}
