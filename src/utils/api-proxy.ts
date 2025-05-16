import type { InterceptRule } from '../type'
import { debounce, reduce } from 'lodash-es'
import { storage } from '#imports'
import { API_STORAGE_KEY, API_STORAGE_SWITCH_KEY } from '../enum'

export const DEFAULT_RULE: InterceptRule = {
  pattern: 'http://api.example.com/test',
  enabled: true,
  response: {
    status: 200,
    data: { message: 'This is a mocked response' }
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

export function createResponse(rule: InterceptRule) {
  return `data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(rule.response.data))}`
}

export const saveRules = debounce(async (rules: InterceptRule[]) => {
  await storage.setItem(`local:${API_STORAGE_KEY}`, rules)
}, 1500)

export async function getRules() {
  const rules = await storage.getItem(`local:${API_STORAGE_KEY}`)
  return (rules || []) as InterceptRule[]
}

export function saveApiSwitch(value: boolean) {
  storage.setItem(`local:${API_STORAGE_SWITCH_KEY}`, value)
}

export async function getApiSwitch() {
  return (await storage.getItem<boolean>(`local:${API_STORAGE_SWITCH_KEY}`)) ?? false
}

export function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export async function getApiRules() {
  const switchEnabled = await getApiSwitch()
  if (!switchEnabled) return []
  return reduce(
    await getRules(),
    (prev, rule, index) => {
      const { enabled, pattern } = rule
      if (!enabled) return prev
      prev.push({
        id: index + 30000,
        priority: 1,
        action: {
          type: browser.declarativeNetRequest.RuleActionType.REDIRECT,
          redirect: {
            url: createResponse(rule)
          },
          responseHeaders: [
            {
              operation: browser.declarativeNetRequest.HeaderOperation.APPEND,
              header: 'Content-Type',
              value: 'application/json'
            },
            {
              operation: browser.declarativeNetRequest.HeaderOperation.APPEND,
              header: 'Access-Control-Allow-Origin',
              value: '*'
            }
          ]
        },
        condition: {
          regexFilter: escapeRegExp(pattern),
          resourceTypes: [browser.declarativeNetRequest.ResourceType.XMLHTTPREQUEST],
          // @ts-ignore
          requestMethods: ['post']
        }
      })
      return prev
    },
    [] as Browser.declarativeNetRequest.Rule[]
  )
}
