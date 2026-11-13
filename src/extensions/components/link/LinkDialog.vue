<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import type { LinkAttrs } from './types'

import { BButton, BFormGroup, BFormInput, BModal } from 'bootstrap-vue-next'
import { computed, ref, watch } from 'vue'

import { useActivator } from '@/hooks/use-activator'
import { useLocale } from '@/locales'

interface Props {
  value?: string
  target?: '_self' | '_blank'
  editor: Editor
  destroy?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  value: undefined,
  target: '_blank',
  destroy: undefined,
})

const { t } = useLocale()

function generateLinkAttrs(): LinkAttrs {
  return {
    href: '',
    target: '_blank',
  }
}

const attrs = ref(generateLinkAttrs())

const dialog = ref<boolean>(false)

useActivator()?.onActivate(() => {
  dialog.value = true
})

const isDisabled = computed(() => {
  const { href, target } = attrs.value
  if (!href)
    return true

  return props.value === href && props.target === target
})

function apply() {
  const { href, target } = attrs.value

  if (href) {
    props.editor.chain().focus().extendMarkRange('link').setLink({ href, target }).run()
  }
  close()
}

function close() {
  dialog.value = false
  attrs.value = generateLinkAttrs()

  setTimeout(() => props.destroy?.(), 300)
}

watch(dialog, (val) => {
  if (!val)
    return

  attrs.value = {
    href: props.value,
    target: props.target,
  }
})
</script>

<template>
  <BModal v-model="dialog" lazy :title="t('editor.link.dialog.title')" centered @hidden="close">
    <BFormGroup :label="t('editor.link.dialog.link')" label-for="bpt-link-href">
      <BFormInput id="bpt-link-href" v-model="attrs.href" type="url" autofocus @keydown.enter.prevent="!isDisabled && apply()" />
    </BFormGroup>

    <template #footer>
      <BButton variant="primary" :disabled="isDisabled" @click="apply">
        {{ t('editor.link.dialog.button.apply') }}
      </BButton>
    </template>
  </BModal>
</template>
