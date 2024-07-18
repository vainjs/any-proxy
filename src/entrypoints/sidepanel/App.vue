<script setup lang="ts">
import { RouterView } from 'vue-router'
import { EVENT_MESSAGE_ACTION, MENU_ITEMS, MENU_SIZE } from '@/enum'
import { openHelp, openFeedback } from '@/utils'

const openFullscreen = () => {
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
          <v-btn v-bind="props" variant="plain" rounded="0" @click="openFullscreen" :width="MENU_SIZE"
            :height="MENU_SIZE" icon>
            <v-icon icon="mdi-fullscreen" size="22" />
          </v-btn>
        </template>
      </v-tooltip>
      <div :class="$style.tabs">
        <v-tabs direction="vertical" color="primary" mobile>
          <v-tooltip v-for="item in MENU_ITEMS" :key="item.path" location="right" :text="item.label">
            <template #activator="{ props }">
              <v-tab :value="item.path" v-bind="props" :class="$style.tab" :min-width="MENU_SIZE" :height="MENU_SIZE"
                :width="MENU_SIZE" :to="item.path" icon>
                <v-icon :icon="item.icon" size="20" />
              </v-tab>
            </template>
          </v-tooltip>
        </v-tabs>
      </div>
      <v-tooltip :text="i18n.t('help')">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" variant="plain" rounded="0" @click="openHelp" :width="MENU_SIZE"
            :height="MENU_SIZE - 10" icon>
            <v-icon icon="mdi-tooltip-question-outline" size="20" />
          </v-btn>
        </template>
      </v-tooltip>
      <v-tooltip :text="i18n.t('feedback')">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" variant="plain" rounded="0" @click="openFeedback" :width="MENU_SIZE"
            :height="MENU_SIZE - 10" icon>
            <v-icon icon="mdi-email-outline" size="20" />
          </v-btn>
        </template>
      </v-tooltip>
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
  padding: 6px 0;
  gap: 4px;

  .tabs {
    flex: 1;
  }

  .tab {
    justify-content: center;
  }
}
</style>
