import { getApiRules } from '@/utils/api-proxy'
import {
  API_STORAGE_SWITCH_KEY,
  EVENT_MESSAGE_ACTION,
  API_STORAGE_KEY,
} from '@/enum'

async function sendApiRulesToPage() {
  const rules = await getApiRules()
  window.postMessage(
    {
      action: EVENT_MESSAGE_ACTION.UPDATE_API_RULES,
      rules,
    },
    '*'
  )
}

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_start',
  async main() {
    window.addEventListener('message', async (event) => {
      if (event.source !== window) return

      if (event.data?.action === EVENT_MESSAGE_ACTION.REQUEST_API_RULES) {
        await sendApiRulesToPage()
      }
    })

    browser.storage.onChanged.addListener(async (changes, areaName) => {
      if (areaName === 'local') {
        const hasRuleChanges =
          changes[API_STORAGE_KEY] || changes[API_STORAGE_SWITCH_KEY]

        if (hasRuleChanges) {
          await sendApiRulesToPage()
        }
      }
    })

    await sendApiRulesToPage()
  },
})
