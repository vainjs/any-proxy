<script setup lang="ts">
const emit = defineEmits<{
  'confirm': []
}>()

const props = defineProps<{
  cancelText?: string
  content?: string
  okText?: string
  title?: string
}>()

const modelVisible = defineModel<boolean>('visible')
const { cancelText = i18n.t('cancelText'), okText = i18n.t('okText'), content, title } = props

const onCancel = () => {
  modelVisible.value = false
}

const onConfirm = () => {
  emit('confirm')
  onCancel()
}
</script>

<template>
  <v-dialog v-model="modelVisible">
    <v-card :title="title" :text="content">
      <v-card-actions>
        <v-btn variant="text" @click="onCancel">{{ cancelText }}</v-btn>
        <v-btn color="primary" variant="tonal" @click="onConfirm">{{ okText }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>