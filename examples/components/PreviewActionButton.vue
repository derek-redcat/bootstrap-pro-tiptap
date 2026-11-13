<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import { mdiFileCodeOutline } from '@mdi/js'
import { ActionButton, BootstrapViewer, Icon } from 'bootstrap-pro-tiptap'
import { BButton, BButtonGroup, BModal } from 'bootstrap-vue-next'
import { ref } from 'vue'

interface Props {
  editor: Editor
  tooltip?: string
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  tooltip: undefined,
  disabled: false,
})

const markdownTheme = ref('')
const dialog = ref(false)
const themes = [
  { text: 'Global', value: '' },
  { text: 'Default', value: 'default' },
  { text: 'Github', value: 'github' },
  { text: 'Maidragon', value: 'maidragon' },
]
</script>

<template>
  <ActionButton :editor="editor" tooltip="Preview" :disabled="disabled" :action="() => (dialog = true)">
    <template #icon>
      <Icon :icon="mdiFileCodeOutline" />
    </template>

    <BModal v-model="dialog" fullscreen title="Preview" no-footer>
      <BButtonGroup size="sm" class="mb-3">
        <BButton
          v-for="theme in themes"
          :key="theme.value"
          variant="outline-primary"
          :pressed="markdownTheme === theme.value"
          @click="markdownTheme = theme.value"
        >
          {{ theme.text }}
        </BButton>
      </BButtonGroup>

      <div class="mx-auto" style="max-width: 900px">
        <BootstrapViewer :value="editor.getJSON()" :markdown-theme="markdownTheme" />
      </div>
    </BModal>
  </ActionButton>
</template>
