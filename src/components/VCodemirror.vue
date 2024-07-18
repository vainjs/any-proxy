<script setup lang="ts">
import {
  type ViewUpdate,
  placeholder as viewPlaceholder,
  highlightActiveLine,
  lineNumbers,
  keymap
} from '@codemirror/view'
import { type CSSProperties, shallowRef, onMounted, onBeforeUnmount } from 'vue'
import { json, jsonParseLinter } from '@codemirror/lang-json'
import { closeBrackets } from '@codemirror/autocomplete'
import { bracketMatching } from '@codemirror/language'
import { minimalSetup, EditorView } from 'codemirror'
import { indentWithTab } from '@codemirror/commands'
import { linter } from '@codemirror/lint'
import cls from 'classnames'
import { normalizeJSON } from '@/utils'

const emit = defineEmits<{
  (e: 'focus'): void
  (e: 'blur'): void
}>()

const props = defineProps<{
  showLineNumber?: boolean
  style?: CSSProperties
  placeholder?: string
  class?: string
}>()

const model = defineModel<string>()
const { showLineNumber, placeholder, style } = props
const container = shallowRef<HTMLDivElement>()
const view = shallowRef<EditorView>()
const baseTheme = EditorView.theme(
  {
    '&': {
      height: '100%'
    },
    '&.cm-focused': {
      outline: 'none'
    },
    '.cm-scroller': {
      overflow: 'auto'
    },
    '.cm-gutters': {
      background: 'transparent',
      border: 'none'
    },
    '.cm-lineNumbers .cm-gutterElement': {
      padding: 0,
      textAlign: 'center'
    }
  },
  { dark: false }
)

const formatJson = (view: EditorView) => {
  try {
    const doc = view.state.doc.toString()
    const formatted = normalizeJSON(doc)
    view.dispatch({
      changes: {
        from: 0,
        to: view.state.doc.length,
        insert: formatted
      }
    })
    return true
  } catch (e) {
    console.error('Invalid JSON')
    return false
  }
}

const customJsonLinter = () => {
  return (view: EditorView) => {
    const doc = view.state.doc.toString().trim()
    if (!doc) {
      return []
    }
    return jsonParseLinter()(view)
  }
}

onMounted(() => {
  const extensions = [
    linter(customJsonLinter()),
    EditorView.lineWrapping,
    highlightActiveLine(),
    bracketMatching(),
    closeBrackets(),
    minimalSetup,
    baseTheme,
    json(),
    EditorView.updateListener.of((v: ViewUpdate) => {
      if (v.docChanged) {
        model.value = v.state.doc.toString()
      }
    }),
    EditorView.domEventHandlers({
      blur: () => {
        emit('blur')
      },
      focus: () => {
        emit('focus')
      }
    }),
    keymap.of([
      indentWithTab,
      {
        key: 'Mod-Shift-f',
        run: formatJson
      },
      {
        key: 'Mod-s',
        run: formatJson
      }
    ])
  ]

  if (showLineNumber) {
    extensions.push(lineNumbers())
  }

  if (placeholder) {
    extensions.push(viewPlaceholder(placeholder))
  }
  view.value = new EditorView({
    parent: container.value,
    doc: model.value,
    extensions
  })
})

onBeforeUnmount(() => {
  if (view.value) {
    view.value.destroy()
  }
})

watch(model, (newValue) => {
  if (view.value && newValue !== view.value.state.doc.toString()) {
    view.value.dispatch({
      changes: {
        from: 0,
        to: view.value.state.doc.length,
        insert: newValue
      }
    })
  }
})

defineExpose({ name: 'VCodemirror' })
</script>

<template>
  <div :class="cls('v-codemirror', props.class)" ref="container" :style="style" />
</template>

<style lang="scss">
.v-codemirror {
  width: 100%;
  height: 100%;
}
</style>
