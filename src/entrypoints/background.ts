import type { Message } from '@/type'
import { map, isEmpty, get, size } from 'lodash-es'
import {
  getStaticResourceRules,
  getSwitchConfig,
  getApiSwitch,
  getApiRules,
  isValidTab
} from '@/utils'
import { EVENT_MESSAGE_ACTION } from '@/enum'

export default defineBackground(() => {
  let standaloneTabId: number | undefined = undefined

  const updateBadgeStatus = async () => {
    const shouldShowBadge = (await getSwitchConfig()) || (await getApiSwitch())
    let existingRuleCount = 0
    if (shouldShowBadge) {
      existingRuleCount =
        size(await browser.declarativeNetRequest.getDynamicRules()) + size(await getApiRules())
    }
    browser.action.setBadgeText({ text: existingRuleCount > 0 ? `${existingRuleCount}` : '' })
  }

  const updateRules = async () => {
    const existingRules = await browser.declarativeNetRequest.getDynamicRules()
    const removeRuleIds = map(existingRules, 'id')
    if (!isEmpty(removeRuleIds)) {
      await browser.declarativeNetRequest.updateDynamicRules({ removeRuleIds })
    }

    const addRules = await getStaticResourceRules()
    if (isEmpty(addRules)) return
    await browser.declarativeNetRequest.updateDynamicRules({ addRules })
  }

  const init = async () => {
    await updateRules()
    await updateBadgeStatus()
  }

  init()

  browser.runtime.onInstalled.addListener(() => {
    browser.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
    browser.action.setBadgeTextColor({ color: '#e63757' })
  })

  browser.storage.onChanged.addListener(async (_, areaName) => {
    if (areaName !== 'local') return
    init()
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
