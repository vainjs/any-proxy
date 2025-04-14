import type { InterceptRule } from '../type'
import { storage } from 'wxt/storage'
import { API_STORAGE_KEY } from '../enum'

export const DEFAULT_RULE: InterceptRule = {
  pattern: 'api.example.com/test',
  enabled: true,
  response: {
    status: 200,
    data: { message: 'This is a mocked response' },
    headers: {
      'Content-Type': 'application/json'
    }
  }
}

export const VALIDATION_RULES = {
  pattern: [(v: string) => !!v || '请输入匹配规则'],
  status: [
    (v: number) => !!v || '请输入状态码',
    (v: number) => {
      v = Number(v)
      return (Number.isInteger(v) && v >= 100 && v < 600) || '状态码必须是100-599之间的整数'
    }
  ],
  responseData: [
    (v: string) => !!v || '请输入响应数据',
    (v: string) => {
      try {
        JSON.parse(v)
        return true
      } catch {
        return '响应数据必须是 JSON 格式'
      }
    }
  ]
}

export function createResponse(rule: InterceptRule): Response {
  const responseBody = JSON.stringify(rule.response.data)
  const headers = new Headers({
    'Content-Type': 'application/json',
    ...rule.response.headers
  })

  return new Response(responseBody, {
    status: rule.response.status,
    headers: headers
  })
}

export async function saveRules(rules: InterceptRule[]) {
  await storage.setItem(`local:${API_STORAGE_KEY}`, rules)
}

export async function getRules() {
  const rules = await storage.getItem(`local:${API_STORAGE_KEY}`)
  return (rules || []) as InterceptRule[]
}
