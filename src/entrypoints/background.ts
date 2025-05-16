import type { Message } from '@/type'
import { map, isEmpty, get } from 'lodash-es'
import { getConfig, getStaticResourceRules, getSwitchConfig, isValidTab } from '@/utils'
import { EVENT_MESSAGE_ACTION } from '@/enum'

export default defineBackground(() => {
  let standaloneTabId: number | undefined = undefined

  const setBadgeStatus = async () => {
    let shouldShowBadge = await getSwitchConfig()
    if (shouldShowBadge) {
      const existingRules = await browser.declarativeNetRequest.getDynamicRules()
      shouldShowBadge = !isEmpty(existingRules)
    }
    browser.action.setBadgeText({ text: shouldShowBadge ? '1' : '' })
  }

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
    await browser.declarativeNetRequest.updateDynamicRules({ addRules })
  }

  ;(async () => {
    await updateRules()
    await setBadgeStatus()
  })()

  browser.storage.onChanged.addListener(async (_, areaName) => {
    if (areaName !== 'local') return
    await updateRules()
    await setBadgeStatus()
  })

  browser.runtime.onInstalled.addListener(() => {
    browser.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
    browser.action.setBadgeTextColor({ color: '#e63757' })
  })

  browser.runtime.onMessage.addListener(async (message, sender) => {
    const { action } = message as Message

    if (action === EVENT_MESSAGE_ACTION.OPEN_SIDE_PANEL) {
      const tabId = get(sender, 'tab.id')
      if (tabId) {
        browser.sidePanel.open({ tabId })
        browser.tabs.remove(tabId)
      }
    }

    if (action === EVENT_MESSAGE_ACTION.CLOSE_SIDE_PANEL) {
      browser.sidePanel.setOptions({ enabled: false })

      if (await isValidTab(standaloneTabId)) {
        await browser.tabs.update(standaloneTabId!, { active: true })
        await browser.tabs.reload(standaloneTabId!)
      } else {
        const currentTab = await browser.tabs.create({
          // @ts-ignore
          url: browser.runtime.getURL('standalone.html')
        })
        standaloneTabId = currentTab.id
      }
      browser.sidePanel.setOptions({ enabled: true })
    }

    return true
  })
})
