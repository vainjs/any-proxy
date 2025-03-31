import vuetify from 'vite-plugin-vuetify'
import { defineConfig } from 'wxt'

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-vue', '@wxt-dev/i18n/module'],
  manifest: {
    permissions: ['declarativeNetRequest', 'background', 'storage'],
    host_permissions: ['<all_urls>'],
    default_locale: 'en',
    name: 'AnyProxy',
    action: {
      default_title: '__MSG_actionTitle__'
    }
  },
  vite: () => ({
    plugins: [vuetify()]
  })
})
