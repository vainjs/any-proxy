import type { InterceptRule } from '../type'
import { debounce, filter } from 'lodash-es'
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

export async function getApiRules() {
  const switchEnabled = await getApiSwitch()
  if (!switchEnabled) return []
  return filter(await getRules(), ['enabled', true])
}
