<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import { BButton, BFormGroup, BFormInput, BModal } from 'bootstrap-vue-next'
import { computed, ref, unref, watchEffect } from 'vue'

import { useActivator } from '@/hooks/use-activator'
import { useLocale } from '@/locales'

interface Props {
  value?: string
  editor: Editor
  destroy?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  value: undefined,
  destroy: undefined,
})

const { t } = useLocale()

const url = ref<string>('')

const dialog = ref<boolean>(false)

useActivator()?.onActivate(() => {
  dialog.value = true
})

const isDisabled = computed(() => {
  if (props.value === url.value)
    return true
  if (!unref(url))
    return true
  return false
})

function apply() {
  if (unref(url)) {
    props.editor.chain().focus().setVideo({ src: url.value }).run()
  }
  close()
}

function close() {
  dialog.value = false
  url.value = ''

  setTimeout(() => props.destroy?.(), 300)
}

watchEffect(() => {
  if (props.value) {
    url.value = props.value
  }
})
</script>

<template>
  <BModal v-model="dialog" lazy :title="t('editor.video.dialog.title')" centered @hidden="close">
    <BFormGroup :label="t('editor.video.dialog.link')" label-for="bpt-video-url">
      <BFormInput id="bpt-video-url" v-model="url" type="url" autofocus @keydown.enter.prevent="!isDisabled && apply()" />
    </BFormGroup>

    <template #footer>
      <BButton variant="primary" :disabled="isDisabled" @click="apply">
        {{ t('editor.video.dialog.button.apply') }}
      </BButton>
    </template>
  </BModal>
</template>
