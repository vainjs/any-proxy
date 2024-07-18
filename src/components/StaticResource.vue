<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  saveSwitchConfig,
  getSwitchConfig,
  DEFAULT_CONFIG,
  saveConfig,
  formatJson,
  getConfig,
} from '@/utils'
import Codemirror from '@/components/VCodemirror.vue'

const configJson = ref(formatJson(DEFAULT_CONFIG))
const switchConfig = ref(false)

onMounted(() => {
  getConfig().then((v) => {
    configJson.value = formatJson(v)
  })
  getSwitchConfig().then((v) => {
    switchConfig.value = v
  })
})

watch(
  configJson,
  saveConfig,
)

watch(
  switchConfig,
  saveSwitchConfig,
)
</script>

<template>
  <section :class="$style.container">
    <header :class="$style.header">
      <v-switch v-model="switchConfig" color="primary" density="compact" hide-details />
    </header>
    <Codemirror :class="$style.codemirror" v-model="configJson" />
  </section>
</template>

<style lang="scss" module>
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0 6px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 0 8px;
}

.codemirror {
  flex: 1;
}
</style>
