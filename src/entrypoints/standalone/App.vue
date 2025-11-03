<script setup lang="ts">
import { RouterView } from 'vue-router'
import { EVENT_MESSAGE_ACTION, } from '@/enum'
import { MENU_ITEMS } from '@/constant'

const closeWindow = () => {
  browser.runtime.sendMessage({ action: EVENT_MESSAGE_ACTION.OPEN_SIDE_PANEL })
}
</script>

<template>
  <section :class="$style.container">
    <aside :class="$style.aside">
      <div :class="$style.banner">
        <h1 :class="$style.title">{{ browser.runtime.getManifest().name }}</h1>
        <v-tooltip :text="i18n.t('exitFullscreen')">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon="mdi-fullscreen-exit" density="compact" flat @click="closeWindow" />
          </template>
        </v-tooltip>
      </div>
      <v-tabs direction="vertical" color="primary" :class="$style.tabSlider">
        <v-tab v-for="item in MENU_ITEMS" :key="item.path" :value="item.path" :prepend-icon="item.icon" :to="item.path">
          {{ item.label }}
        </v-tab>
      </v-tabs>
    </aside>
    <main :class="$style.main">
      <RouterView />
    </main>
  </section>
</template>

<style lang="scss" module>
html,
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.container {
  display: flex;
  height: 100%;
}

.main {
  flex: 1;
  width: 0;
  padding: 12px;
  background: #fff;
}

.aside {
  width: 200px;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-right: solid 1px rgba(5, 5, 5, 0.06);

  .title {
    font-size: 16px;
  }

  .banner {
    padding: 18px 12px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.tabSlider {
  :global(.v-tab__slider) {
    left: unset !important;
    right: 0 !important;
  }
}
</style>
