import '@/base.css'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createVuetify } from 'vuetify'
import { createApp } from 'vue'
import router from '@/router'
import App from './App.vue'

const vuetify = createVuetify({
  components,
  directives
})

createApp(App).use(router).use(vuetify).mount('#app')
