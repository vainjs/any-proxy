export const STATIC_STORAGE_SWITCH_KEY = 'STATIC_INTERCEPT_SWITCH'
export const API_STORAGE_SWITCH_KEY = 'API_INTERCEPT_SWITCH'
export const STATIC_STORAGE_KEY = 'STATIC_INTERCEPT_RULES'
export const API_STORAGE_KEY = 'API_INTERCEPT_RULES'

export enum EVENT_MESSAGE_ACTION {
  CLOSE_SIDE_PANEL = 'CLOSE_SIDE_PANEL',
  OPEN_SIDE_PANEL = 'OPEN_SIDE_PANEL'
}

export const MENU_ITEMS = [
  {
    label: i18n.t('staticResources'),
    icon: 'mdi-xml',
    path: '/'
  },
  {
    label: i18n.t('api'),
    icon: 'mdi-api',
    path: '/api'
  }
]

export const MENU_SIZE = 40
