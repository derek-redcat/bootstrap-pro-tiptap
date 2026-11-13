<!--
  * @Date: 2023-05-27 17:21:21
  * @LastEditors: yikoyu 2282373181@qq.com
  * @LastEditTime: 2023-09-09 21:36:31
  * @FilePath: \bootstrap-pro-tiptap\examples\App.vue
-->
<script setup lang="ts">
import type { BootstrapTiptapOnChange } from 'bootstrap-pro-tiptap'
import { BaseKit, Heading, locale } from 'bootstrap-pro-tiptap'
import { BAlert, BButton, BButtonGroup, BCard, BContainer, BModal } from 'bootstrap-vue-next'
import JsonEditorVue from 'json-editor-vue'
import { ref, unref } from 'vue'

import CustomLang from './components/CustomLang.vue'
import preview from './extensions/preview'
import { jsonValue } from './html'

const extensions = [
  preview.configure({ spacer: true }),
  BaseKit.configure({
    placeholder: {
      placeholder: 'Placeholder...',
    },
  }),
  Heading.configure({
    levels: [1, 2, 3, 4],
  }),
]

const isDark = ref(false)
const viewer = ref(false)
const markdownThemes = ['', 'default', 'github', 'maidragon']
const outputs = ['html', 'json', 'text'] as const

const BootstrapTiptapRef = ref<null | Record<string, any>>(null)
const output = ref<'html' | 'json' | 'text'>('html')
const content = ref(jsonValue)
const markdownTheme = ref('')
const outlined = ref(true)
const dense = ref(false)
const editHtml = ref(false)
const hideToolbar = ref(false)
const disableToolbar = ref(false)
const errorMessages = ref(null)
const maxWidth = ref<number>(900)

const customLang = ref({ ...locale.message.en })

// watch(content, val => {
//   console.log('output :>> ', val)
// })

function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.setAttribute('data-bs-theme', isDark.value ? 'dark' : 'light')
}

function setCustom() {
  locale.setMessage('custom', unref(customLang))
  locale.setLang('custom')
}

function onChangeEditor({ editor, output }: BootstrapTiptapOnChange) {
  console.log('output :>> ', output)
  console.log('output[html] :>> ', editor.getHTML())
  console.log('output[json] :>> ', editor.getJSON())
  console.log('output[text] :>> ', editor.getText())
}

function getHTML() {
  const value = BootstrapTiptapRef.value?.editor.getHTML()
  console.log('getHTML :>> ', value)
}

function getJSON() {
  const value = BootstrapTiptapRef.value?.editor.getJSON()
  console.log('getJSON :>> ', value, JSON.stringify(value))
}

function getText() {
  const value = BootstrapTiptapRef.value?.editor.getText()
  console.log('getText :>> ', value)
}
</script>

<template>
  <BContainer id="app" class="py-4">
    <BAlert class="mb-4" variant="info" :model-value="true">
      Bootstrap fork of
      <a href="https://github.com/yikoyu/vuetify-pro-tiptap" target="_blank" rel="noopener">vuetify-pro-tiptap</a>
      by yikoyu.
    </BAlert>

    <div class="d-flex flex-wrap gap-2 mb-3">
      <BButton variant="primary" @click="toggleTheme">
        {{ isDark ? 'dark' : 'light' }}
      </BButton>
      <BButton variant="primary" @click="locale.setLang('zhHans')">
        set Chinese
      </BButton>
      <BButton variant="primary" @click="locale.setLang('en')">
        set English
      </BButton>
      <BButton variant="primary" @click="setCustom">
        set Custom Lang
      </BButton>
    </div>

    <BButtonGroup class="mb-3 me-3">
      <BButton
        v-for="theme in markdownThemes"
        :key="theme"
        variant="outline-secondary"
        :pressed="markdownTheme === theme"
        @click="markdownTheme = theme"
      >
        {{ theme || 'Global' }}
      </BButton>
    </BButtonGroup>

    <BButtonGroup class="mb-3">
      <BButton
        v-for="item in outputs"
        :key="item"
        variant="outline-secondary"
        :pressed="output === item"
        @click="output = item"
      >
        {{ item }}
      </BButton>
    </BButtonGroup>

    <div class="d-flex flex-wrap gap-2 mb-3">
      <BButton variant="primary" @click="getHTML">
        getHTML
      </BButton>
      <BButton variant="primary" @click="getJSON">
        getJSON
      </BButton>
      <BButton variant="primary" @click="getText">
        getText
      </BButton>
      <BButton variant="primary" @click="viewer = true">
        Viewer
      </BButton>
    </div>

    <BModal v-model="viewer" size="xl" title="Viewer" no-footer>
      <BootstrapViewer :value="content" />
    </BModal>

    <BootstrapTiptap
      ref="BootstrapTiptapRef"
      v-model="content"
      v-model:markdown-theme="markdownTheme"
      label="Title"
      :output="output"
      :hide-toolbar="hideToolbar"
      :disable-toolbar="disableToolbar"
      :outlined="outlined"
      :dense="dense"
      :error-messages="errorMessages"
      :max-height="465"
      :max-width="maxWidth"
      :extensions="extensions"
      @change="onChangeEditor"
    />

    <hr class="my-4">

    <JsonEditorVue v-model="content" read-only height="400px" />

    <hr class="my-4">

    <BCard no-body>
      <BootstrapTiptap
        v-model:markdown-theme="markdownTheme"
        label="Editor 2 (forced dark)"
        :outlined="outlined"
        :dense="dense"
        dark
        :max-height="465"
        :max-width="maxWidth"
        :extensions="extensions"
      />
    </BCard>

    <hr class="my-4">

    <CustomLang v-model="customLang" />
  </BContainer>
</template>

<style>
.jse-main {
  max-height: 400px;
}
</style>
