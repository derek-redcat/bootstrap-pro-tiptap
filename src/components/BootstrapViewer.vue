<script setup lang="ts">
import type { AnyExtension, JSONContent } from '@tiptap/core'
import type { IWhiteList } from 'xss'
import { generateHTML } from '@tiptap/html'
import { computed, ref, unref } from 'vue'
import Xss from 'xss'

import xssRules from '@/constants/xss-rules'
import { useBsTheme, useContext, useMarkdownTheme } from '@/hooks'
import { isString } from '@/utils/utils'

interface Props {
  value?: string | JSONContent
  dark?: boolean
  dense?: boolean
  markdownTheme?: string | false
  xss?: boolean | string[]
  xssOptions?: IWhiteList
  extensions?: AnyExtension[]
}

const props = withDefaults(defineProps<Props>(), {
  value: '',
  dark: undefined,
  dense: false,
  markdownTheme: undefined,
  xss: true,
  xssOptions: () => xssRules,
  extensions: () => [],
})

const { state } = useContext()
const rootRef = ref<HTMLElement | null>(null)
const { isDark, themeAttr } = useBsTheme(rootRef, () => props.dark)
const { markdownThemeStyle } = useMarkdownTheme(computed(() => props.markdownTheme))

const ext = computed<AnyExtension[]>(() => [...state.extensions, ...props.extensions])

const viewerClass = computed(() => ({
  __dark: unref(isDark),
  dense: props.dense,
  view: true,
  ...unref(markdownThemeStyle),
}))

const htmlValue = computed<string>(() => {
  if (isString(props.value))
    return props.value
  return generateHTML(props.value, unref(ext))
})

const cleanValue = computed(() => {
  if (props.xss === false) {
    return unref(htmlValue)
  }

  const value = unref(htmlValue)
    .replace('https://youtu.be/', 'https://www.youtube.com/watch?v=')
    .replace('watch?v=', 'embed/')
    .replace('https://vimeo.com/', 'https://player.vimeo.com/video/')

  const whiteList = props.xssOptions

  return Xss(value, { whiteList, css: false })
})
</script>

<template>
  <div
    ref="rootRef"
    class="bootstrap-pro-tiptap-editor__content"
    :class="viewerClass"
    :data-bs-theme="themeAttr"
    :style="{ width: '100%' }"
  >
    <slot name="before" />
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div class="content" v-html="cleanValue" />

    <slot name="after" />
  </div>
</template>
