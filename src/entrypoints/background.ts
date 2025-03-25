import type { Message } from '@/type'
import { map, isEmpty, get } from 'lodash-es'
import { getConfig, getStaticResourceRules, getSwitchConfig, isValidTab } from '@/utils'
import { EVENT_MESSAGE_ACTION } from '@/enum'

export default defineBackground(async () => {
  let standaloneTabId: number | undefined = undefined
  // console.log('Current UI language:', browser.i18n.getUILanguage())

  const updateRules = async () => {
    const existingRules = await browser.declarativeNetRequest.getDynamicRules()
    const removeRuleIds = map(existingRules, 'id')
    if (!isEmpty(removeRuleIds)) {
      await browser.declarativeNetRequest.updateDynamicRules({ removeRuleIds })
    }

    const switchEnabled = await getSwitchConfig()
    if (!switchEnabled) return
    const addRules = getStaticResourceRules(await getConfig())
    if (isEmpty(addRules)) return
    browser.declarativeNetRequest.updateDynamicRules({ addRules })
  }

  updateRules()

  browser.storage.onChanged.addListener((_, areaName) => {
    if (areaName === 'local') {
      updateRules()
    }
  })

  browser.runtime.onInstalled.addListener(() => {
    // @ts-ignore
    browser.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
  })

  browser.runtime.onMessage.addListener(async (message, sender) => {
    const { action } = message as Message

    if (action === EVENT_MESSAGE_ACTION.OPEN_SIDE_PANEL) {
      const tabId = get(sender, 'tab.id')
      if (tabId) {
        // @ts-ignore
        browser.sidePanel.open({ tabId })
        browser.tabs.remove(tabId)
      }
    }

    if (action === EVENT_MESSAGE_ACTION.CLOSE_SIDE_PANEL) {
      // @ts-ignore
      browser.sidePanel.setOptions({ enabled: false })

      if (await isValidTab(standaloneTabId)) {
        await browser.tabs.update(standaloneTabId, { active: true })
        await browser.tabs.reload(standaloneTabId)
      } else {
        const currentTab = await browser.tabs.create({
          // @ts-ignore
          url: browser.runtime.getURL('standalone.html')
        })
        standaloneTabId = currentTab.id
      }
      // @ts-ignore
      browser.sidePanel.setOptions({ enabled: true })
    }

    return true
  })
})
