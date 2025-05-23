<script setup lang="ts">
import { type InterceptRule } from '@/type'
import { VALIDATION_RULES, formatJson } from '@/utils'
import Codemirror from '@/components/VCodemirror.vue'

const emit = defineEmits<{
  ok: [rule: InterceptRule]
}>()

const props = defineProps<{
  isEdit?: boolean
}>()

const modelValue = defineModel<InterceptRule>({ default: {} })
const modelVisible = defineModel<boolean>('visible')
const form = ref()

const responseData = computed({
  get: () => {
    return formatJson(modelValue.value.response.data)
  },
  set: async (newValue) => {
    try {
      const data = newValue ? JSON.parse(newValue) : newValue
      modelValue.value.response.data = data
    } catch (e) {
      console.error(e)
    }
  }
})

const closeDialog = () => {
  modelVisible.value = false
}

const onOk = async () => {
  const { valid } = await form.value.validate()
  if (!valid) return
  emit('ok', toRaw(modelValue.value))
  closeDialog()
}
</script>

<template>
  <v-dialog v-model="modelVisible" @confirm="onOk" width="95%" max-width="640px">
    <v-card :title="props.isEdit ? i18n.t('editRule') : i18n.t('addRule')">
      <v-card-text>
        <v-form ref="form" color="primary">
          <div :class="$style.switch">
            <v-switch v-model="modelValue.enabled" color="primary" density="compact" hide-details />
          </div>
          <v-text-field v-model="modelValue.pattern" :label="i18n.t('matchRule')" :rules="VALIDATION_RULES.pattern" />
          <v-text-field v-model="modelValue.response.status" type="number" :label="i18n.t('status')"
            :rules="VALIDATION_RULES.status" />
          <v-text-field v-model="modelValue.description" :label="i18n.t('description')" />
          <Codemirror v-model="responseData" />
        </v-form>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn :text="i18n.t('close')" variant="plain" @click="closeDialog" />
        <v-btn :text="i18n.t('ok')" variant="tonal" color="primary" @click="onOk" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>


<style lang="scss" module>
.switch {
  padding: 0px 6px 6px;
}
</style>