<script setup lang="ts">
import { type InterceptRule } from '@/type'
import cls from 'classnames'
import { ref } from 'vue'
import { saveRules, getRules, DEFAULT_RULE, getApiSwitch, saveApiSwitch } from '@/utils'
import { MENU_SIZE } from '@/constant'
import ApiRuleDialog from './ApiRuleDialog.vue'
import Confirm from './VConfirm.vue'

const formState = ref<InterceptRule>({ ...DEFAULT_RULE })
const rules = ref<InterceptRule[]>([])
const confirmDialog = ref(false)
const switchConfig = ref(false)
const dialog = ref(false)
const editIndex = ref(-1)

onMounted(() => {
  getRules().then((v) => {
    rules.value = v
  })

  getApiSwitch().then((v) => {
    switchConfig.value = v
  })
})

const onEdit = (index: number) => {
  formState.value = { ...rules.value[index] }
  editIndex.value = index
  dialog.value = true
}

const onAdd = () => {
  formState.value = { ...DEFAULT_RULE }
  editIndex.value = -1
  dialog.value = true
}

const onSaveRule = (newRule: InterceptRule) => {
  if (editIndex.value === -1) {
    rules.value.push(newRule)
  } else {
    rules.value.splice(editIndex.value, 1, newRule)
  }
}

const onClickDelete = (index: number) => {
  editIndex.value = index
  confirmDialog.value = true
}

const onDelete = () => {
  if (editIndex.value === -1) return
  rules.value.splice(editIndex.value, 1)
}

watch(
  rules,
  (v) => {
    saveRules(toRaw(v))
  },
  { deep: true }
)

watch(
  switchConfig,
  saveApiSwitch,
)
</script>

<template>
  <div :class="$style.container">
    <header :class="$style.header">
      <v-switch v-model="switchConfig" color="primary" density="compact" hide-details />
      <v-btn icon="mdi-plus" variant="plain" @click="onAdd" :width="MENU_SIZE" :height="MENU_SIZE" />
    </header>
    <main :class="$style.main">
      <v-list rounded="sm">
        <v-list-item v-for="(rule, index) in rules" :key="rule.pattern" @click="onEdit(index)"
          :class="cls($style.item, { [$style['item-enabled']]: rule.enabled })">
          <v-list-item-title>{{ rule.pattern }}</v-list-item-title>
          <v-list-item-subtitle v-if="rule.description" class="text-high-emphasis">
            {{ rule.description }}
          </v-list-item-subtitle>
          <template v-slot:append>
            <v-btn icon="mdi-close" variant="plain" density="compact" size="small" @click.stop="onClickDelete(index)" />
          </template>
        </v-list-item>
      </v-list>
    </main>

    <ApiRuleDialog v-model:visible="dialog" v-model="formState" @ok="onSaveRule" :is-edit="editIndex !== -1" />
    <Confirm v-model:visible="confirmDialog" @confirm="onDelete" :title="i18n.t('deleteTitle')"
      :content="i18n.t('deleteContent')" />
  </div>
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
  margin-bottom: 6px;
  padding: 0 8px;
}

.main {
  height: 0;
  flex: 1;
  overflow-y: auto;
}

.item {
  margin-bottom: 6px;
  background: rgba(var(--v-theme-surface-light), 0.3);

  &-enabled {
    background: rgba(var(--v-theme-info), 0.08);
  }
}
</style>
