import type { DeclarativeNetRequest } from 'wxt/browser'
import type { ProxyConfig } from '@/type'
import { storage } from 'wxt/storage'
import { debounce, get, uniqueId, reduce, replace } from 'lodash-es'
import { STATIC_STORAGE_KEY, STATIC_STORAGE_SWITCH_KEY } from '@/enum'

export const DEFAULT_CONFIG: ProxyConfig = {
  proxy: []
}

export async function getConfig() {
  return ((await storage.getItem(`local:${STATIC_STORAGE_KEY}`)) as ProxyConfig) || DEFAULT_CONFIG
}

export const saveConfig = debounce(async (configJson?: string) => {
  try {
    const config = configJson ? JSON.parse(configJson) : DEFAULT_CONFIG
    await storage.setItem(`local:${STATIC_STORAGE_KEY}`, config)
  } catch (e) {
    console.warn(e)
  }
}, 1500)

export function getStaticResourceRules(config: ProxyConfig) {
  const idBase = +uniqueId()
  return reduce(
    get(config, 'proxy', []),
    (prev, rule, index) => {
      const [regexFilter, regexSubstitution] = rule
      if (!regexFilter || !regexSubstitution) return prev
      prev.push({
        id: idBase + index,
        priority: 1,
        action: {
          type: 'redirect',
          redirect: {
            regexSubstitution: replace(regexSubstitution, /\$(\d+)/g, '\\$1')
          }
        },
        condition: {
          regexFilter,
          resourceTypes: ['script', 'stylesheet']
        }
      })
      return prev
    },
    [] as DeclarativeNetRequest.Rule[]
  )
}

export function saveSwitchConfig(value: boolean) {
  storage.setItem(`local:${STATIC_STORAGE_SWITCH_KEY}`, value)
}

export async function getSwitchConfig() {
  return (await storage.getItem<boolean>(`local:${STATIC_STORAGE_SWITCH_KEY}`)) ?? false
}
