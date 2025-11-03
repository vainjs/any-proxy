import type { InterceptRule } from '../type'
import { debounce, filter } from 'lodash-es'
import { API_STORAGE_KEY, API_STORAGE_SWITCH_KEY } from '../enum'

export const DEFAULT_RULE: InterceptRule = {
  pattern: '',
  enabled: true,
  method: 'ALL',
  response: {
    data: {},
  },
}

export const VALIDATION_RULES = {
  pattern: [(v: string) => !!v || i18n.t('patternRequired')],
  responseData: [
    (v: string) => !!v || i18n.t('responseDataRequired'),
    (v: string) => {
      try {
        JSON.parse(v)
        return true
      } catch {
        return i18n.t('responseDataInvalidJson')
      }
    },
  ],
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
  return (
    (await storage.getItem<boolean>(`local:${API_STORAGE_SWITCH_KEY}`)) ?? false
  )
}

export async function getApiRules() {
  const switchEnabled = await getApiSwitch()
  if (!switchEnabled) return []
  return filter(await getRules(), ['enabled', true])
}
