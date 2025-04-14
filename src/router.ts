import { createWebHashHistory, createRouter } from 'vue-router'
import StaticResource from '@/components/StaticResource.vue'
import Api from '@/components/ApiProxy.vue'

const routes = [
  { path: '/', exact: true, component: StaticResource },
  { path: '/api', component: Api }
]

export default createRouter({
  history: createWebHashHistory(),
  routes
})
