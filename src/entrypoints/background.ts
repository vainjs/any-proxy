import { map, isEmpty, get, size } from 'lodash-es'
import type { Message } from '@/type'
import {
  getStaticResourceRules,
  getSwitchConfig,
  getApiSwitch,
  getApiRules,
  isValidTab,
} from '@/utils'
import { EVENT_MESSAGE_ACTION } from '@/enum'

export default defineBackground(() => {
  let standaloneTabId: number | undefined = undefined

  const updateBadgeStatus = async () => {
    const staticEnabled = await getSwitchConfig()
    const apiEnabled = await getApiSwitch()
    const shouldShowBadge = staticEnabled || apiEnabled

    let staticRuleCount = 0
    let apiRuleCount = 0

    if (shouldShowBadge) {
      staticRuleCount = staticEnabled
        ? size(await browser.declarativeNetRequest.getDynamicRules())
        : 0
      apiRuleCount = apiEnabled ? size(await getApiRules()) : 0
    }

    const totalCount = staticRuleCount + apiRuleCount
    browser.action.setBadgeText({
      text: totalCount > 0 ? `${totalCount}` : '',
    })

    let badgeColor = '#9e9e9e'

    if (staticRuleCount > 0 && apiRuleCount > 0) {
      badgeColor = '#f5222d'
    } else if (staticRuleCount > 0) {
      badgeColor = '#fa8c16'
    } else if (apiRuleCount > 0) {
      badgeColor = '#fa541c'
    }

    browser.action.setBadgeBackgroundColor({ color: badgeColor })
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
    browser.action.setBadgeTextColor({ color: '#fff' })
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
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          url: browser.runtime.getURL('standalone.html'),
        })
        standaloneTabId = currentTab.id
      }
      browser.sidePanel.setOptions({ enabled: true })
    }

    return true
  })
})
