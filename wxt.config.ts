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
      default_title: '__MSG_actionTitle__',
    },
    content_scripts: [
      {
        matches: ['<all_urls>'],
        js: ['content-main.js'],
        run_at: 'document_start',
        world: 'MAIN',
        all_frames: true,
      },
      {
        matches: ['<all_urls>'],
        js: ['content-scripts/content.js'],
        run_at: 'document_start',
        all_frames: true,
      },
    ],
  },
  vite: () => ({
    plugins: [vuetify()],
  }),
})
