<script setup lang="ts">
import type { Editor as CoreEditor } from '@tiptap/core'
import type { AnyExtension, EditorOptions } from '@tiptap/vue-3'
import type { BootstrapTiptapOnChange } from '@/type'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import { computed, provide, ref, toRef, unref, useAttrs, watch } from 'vue'

import { EDITOR_UPDATE_THROTTLE_WAIT_TIME, EDITOR_UPDATE_WATCH_THROTTLE_WAIT_TIME } from '@/constants/define'

import { useBsTheme, useMarkdownTheme, useProvideTiptapStore } from '@/hooks'
import { useLocale } from '@/locales'
import { differenceBy, getCssUnitWithDefault, hasExtension, isEqual, throttle } from '@/utils/utils'
import BubbleMenu from './BubbleMenu.vue'
import TipTapToolbar from './TiptapToolbar.vue'

type HandleKeyDown = NonNullable<EditorOptions['editorProps']['handleKeyDown']>
type OnUpdate = NonNullable<EditorOptions['onUpdate']>

interface Props {
  modelValue?: string | object
  markdownTheme?: string | false
  output?: 'html' | 'json' | 'text'
  dark?: boolean
  dense?: boolean
  outlined?: boolean
  flat?: boolean
  disabled?: boolean
  label?: string
  hideToolbar?: boolean
  disableToolbar?: boolean
  hideBubble?: boolean
  removeDefaultWrapper?: boolean
  maxWidth?: string | number
  minHeight?: string | number
  maxHeight?: string | number
  extensions?: AnyExtension[]
  editorClass?: string | string[] | Record<string, any>
  errorMessages?: string | string[] | null
}

interface Emits {
  (event: 'enter'): void
  (event: 'change', value: BootstrapTiptapOnChange): void
  (event: 'update:modelValue', value: Props['modelValue']): void
  (event: 'update:markdownTheme', value: string): void
}

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  markdownTheme: undefined,
  output: 'html',
  dark: undefined,
  dense: false,
  outlined: true,
  flat: true,
  disabled: false,
  label: undefined,
  hideToolbar: false,
  disableToolbar: false,
  hideBubble: false,
  removeDefaultWrapper: false,
  maxWidth: undefined,
  minHeight: undefined,
  maxHeight: undefined,
  errorMessages: () => [],

  // Editor
  extensions: () => [],
  editorClass: undefined,
})

const emit = defineEmits<Emits>()
const attrs = useAttrs()

// Track the last value emitted by this component so onValueChange can
// distinguish a parent echoing back our own update vs a genuine
// external change that should overwrite the editor content.
const lastEmittedValue = ref<Props['modelValue']>(props.modelValue)

const rootRef = ref<HTMLElement | null>(null)
const { isDark, themeAttr } = useBsTheme(rootRef, () => props.dark)
const { state, isFullscreen } = useProvideTiptapStore()
const { markdownThemeStyle } = useMarkdownTheme(
  computed(() => props.markdownTheme),
  (value: string) => {
    emit('update:markdownTheme', value)
  },
)

const sortExtensions = computed<AnyExtension[]>(() => {
  const diff = differenceBy(props.extensions, state.extensions, 'name')

  // Override configurations for duplicate extensions
  const exts = state.extensions.map((k, i) => {
    const find = props.extensions.find(ext => ext.name === k.name)
    if (!find)
      return k

    return k.configure(find.options)
  })

  return [...exts, ...diff].map((k, i) => k.configure({ sort: i }))
})

const editor = useEditor({
  content: props.modelValue,
  editorProps: {
    handleKeyDown: throttle<HandleKeyDown>((view, event) => {
      if (event.key === 'Enter' && attrs.enter && !event.shiftKey) {
        emit('enter')

        return true
      }

      return false
    }, EDITOR_UPDATE_THROTTLE_WAIT_TIME),
  },
  onUpdate: throttle<OnUpdate>(({ editor }) => {
    const output = getOutput(editor, props.output)

    lastEmittedValue.value = output
    emit('update:modelValue', output)

    emit('change', { editor, output })
  }, EDITOR_UPDATE_THROTTLE_WAIT_TIME),
  extensions: unref(sortExtensions),
  autofocus: false,
  editable: !props.disabled,
  injectCSS: true,
})

const { t } = useLocale()

const contentDynamicClasses = computed(() => {
  const values: Record<string, any> = {
    __dark: unref(isDark),
    ...unref(markdownThemeStyle),
  }

  return [values, props.editorClass]
})

const hasError = computed<boolean>(() => {
  const value = props.errorMessages
  return Array.isArray(value) ? value.length > 0 : !!value
})

const errorList = computed<string[]>(() => {
  const value = props.errorMessages
  if (!value)
    return []
  return Array.isArray(value) ? value : [value]
})

const contentDynamicStyles = computed(() => {
  const maxWidth = getCssUnitWithDefault(props.maxWidth)

  const maxHeightStyle = {
    maxWidth,
    width: !maxWidth ? undefined : '100%',
    margin: !maxWidth ? undefined : '0 auto',
    backgroundColor: 'var(--bs-body-bg)',
  }
  if (unref(isFullscreen))
    return { height: '100%', overflowY: 'auto', ...maxHeightStyle }

  const minHeight = getCssUnitWithDefault(props.minHeight)
  const maxHeight = getCssUnitWithDefault(props.maxHeight)

  return {
    minHeight,
    maxHeight,
    overflowY: 'auto',
    ...maxHeightStyle,
  }
})

function getOutput(editor: CoreEditor, output: Props['output']) {
  if (props.removeDefaultWrapper) {
    if (output === 'html')
      return editor.isEmpty ? '' : editor.getHTML()
    if (output === 'json')
      return editor.isEmpty ? {} : editor.getJSON()
    if (output === 'text')
      return editor.isEmpty ? '' : editor.getText()
    return ''
  }

  if (output === 'html')
    return editor.getHTML()
  if (output === 'json')
    return editor.getJSON()
  if (output === 'text')
    return editor.getText()
  return ''
}

const onValueChange = throttle((val: NonNullable<Props['modelValue']>) => {
  if (!editor.value)
    return

  const output = getOutput(editor.value, props.output)

  // Skip if the editor already has this content, OR if the incoming value
  // is just the parent echoing back what we emitted. calling setContent
  // would overwrite characters the user typed since the last emission.
  if (isEqual(output, val) || isEqual(lastEmittedValue.value, val))
    return

  const { from, to } = editor.value.state.selection
  editor.value.commands.setContent(val, { emitUpdate: false })
  editor.value.commands.setTextSelection({ from, to })
}, EDITOR_UPDATE_WATCH_THROTTLE_WAIT_TIME)

const onDisabledChange = (val: boolean) => editor.value?.setEditable(!val)

watch(() => props.modelValue, onValueChange)
watch(() => props.disabled, onDisabledChange)

provide('disableToolbar', toRef(() => props.disableToolbar))

defineExpose({ editor })
</script>

<template>
  <Teleport to="body" :disabled="!isFullscreen">
    <div
      v-if="editor"
      ref="rootRef"
      class="bootstrap-pro-tiptap"
      :class="{ dense }"
      :data-bs-theme="themeAttr"
    >
      <div
        v-bind="$attrs"
        class="card bootstrap-pro-tiptap-editor"
        :class="{
          'bootstrap-pro-tiptap-editor--fullscreen': isFullscreen,
          'bootstrap-pro-tiptap-editor--outlined': outlined,
          'shadow-sm': !flat,
          'border-danger': hasError,
        }"
      >
        <div v-if="label && !isFullscreen" class="card-header fw-semibold">
          {{ label }}
        </div>

        <!-- Toolbar -->
        <TipTapToolbar
          v-if="!hideToolbar"
          class="bootstrap-pro-tiptap-editor__toolbar border-bottom"
          :editor="editor"
        />

        <!-- Edit Mode -->
        <BubbleMenu v-if="!hideBubble" :editor="editor" />

        <slot
          name="editor"
          v-bind="{ editor, props: { 'class': 'bootstrap-pro-tiptap-editor__content', 'data-testid': 'value' } }"
        >
          <EditorContent
            class="bootstrap-pro-tiptap-editor__content"
            :class="contentDynamicClasses"
            :style="contentDynamicStyles"
            :editor="editor"
            data-testid="value"
          />
        </slot>

        <slot name="bottom" v-bind="{ editor }">
          <div v-if="hasExtension(editor, 'characterCount')" class="card-footer d-flex justify-content-end gap-3 small text-body-secondary text-uppercase bootstrap-pro-tiptap-editor__footer">
            <span>{{ editor.storage.characterCount.words() }} {{ t('editor.words') }}</span>
            <span>{{ editor.storage.characterCount.characters() }} {{ t('editor.characters') }}</span>
          </div>
        </slot>
      </div>

      <div v-if="hasError" class="invalid-feedback d-block">
        <div v-for="(message, i) in errorList" :key="i">
          {{ message }}
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss">
@forward '@/styles/index';
</style>
