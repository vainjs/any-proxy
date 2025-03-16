<script setup lang="ts">
import { RouterView } from 'vue-router'
import { EVENT_MESSAGE_ACTION, MENU_ITEMS } from '@/enum'

const openWindow = () => {
  browser.runtime.sendMessage({ action: EVENT_MESSAGE_ACTION.CLOSE_SIDE_PANEL })
}
</script>

<template>
  <section :class="$style.container">
    <main :class="$style.main">
      <RouterView />
    </main>
    <aside :class="$style.aside">
      <v-tooltip :text="i18n.t('fullscreen')">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon="mdi-fullscreen" variant="plain" rounded="0" @click="openWindow" />
        </template>
      </v-tooltip>
      <v-tabs direction="vertical" color="primary">
        <v-tooltip v-for="item in MENU_ITEMS" :key="item.key" location="right" :text="item.label">
          <template #activator="{ props }">
            <v-tab :value="item.key" v-bind="props" :class="$style.tab" height="42">
              <v-icon :icon="item.icon" size="20" />
            </v-tab>
          </template>
        </v-tooltip>
      </v-tabs>
    </aside>
  </section>
</template>

<style lang="scss" module>
.container {
  display: flex;
  height: 100%;
  padding: 4px 0 4px 4px;
}

.main {
  flex: 1;
  width: 0;
  padding: 6px 0 12px 0;
  border-radius: 12px;
  background: #fff;
}

.aside {
  display: flex;
  flex-direction: column;
  gap: 4px;

  .tab {
    min-width: 42px !important;
    padding: 0 !important;
    justify-content: center;
  }
}
</style>
