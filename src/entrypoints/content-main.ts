import { EVENT_MESSAGE_ACTION } from '@/enum'
import type { InterceptRule } from '@/type'
import { createProxyFetch, createProxyXHR } from '@/utils/interceptor'

const NATIVE_FETCH = window.fetch.bind(window)
const NATIVE_XHR = window.XMLHttpRequest

export default defineContentScript({
  main() {
    let cachedRules: InterceptRule[] = []
    let isProxyActive = false

    const activateProxy = () => {
      if (!isProxyActive) {
        window.fetch = createProxyFetch(NATIVE_FETCH, () => cachedRules)
        window.XMLHttpRequest = createProxyXHR(NATIVE_XHR, () => cachedRules)
        isProxyActive = true
      }
    }

    const deactivateProxy = () => {
      if (isProxyActive) {
        window.fetch = NATIVE_FETCH
        window.XMLHttpRequest = NATIVE_XHR
        isProxyActive = false
      }
    }

    window.addEventListener('message', (event) => {
      if (
        event.data?.action === EVENT_MESSAGE_ACTION.UPDATE_API_RULES &&
        Array.isArray(event.data?.rules)
      ) {
        cachedRules = event.data.rules

        // Optimize: only activate proxy when there are rules
        if (cachedRules.length > 0) {
          activateProxy()
        } else {
          deactivateProxy()
        }
      }
    })

    const requestRules = () => {
      window.postMessage(
        { action: EVENT_MESSAGE_ACTION.REQUEST_API_RULES },
        '*'
      )
    }

    requestRules()
    activateProxy()
  },
})
