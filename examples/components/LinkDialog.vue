<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import { locale, useActivator } from 'bootstrap-pro-tiptap'
import { BButton, BFormGroup, BFormInput, BModal } from 'bootstrap-vue-next'
import { computed, ref, watch } from 'vue'

interface LinkAttrs {
  href?: string
  target?: '_self' | '_blank'
}

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

function generateLinkAttrs(): LinkAttrs {
  return {
    href: '',
    target: '_blank',
  }
}

const attrs = ref(generateLinkAttrs())

const dialog = ref<boolean>(false)

// Opens when the toolbar button is clicked (replaces Vuetify's activator="parent")
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
  <BModal v-model="dialog" lazy :title="locale.message[locale.lang]['editor.link.dialog.title']" centered @hidden="close">
    <p>This is a custom dialog component; please use the <strong>dialogComponent</strong> parameter.</p>

    <BFormGroup :label="locale.message[locale.lang]['editor.link.dialog.link']">
      <BFormInput v-model="attrs.href" autofocus />
    </BFormGroup>

    <template #footer>
      <BButton variant="primary" :disabled="isDisabled" @click="apply">
        {{ locale.message[locale.lang]['editor.link.dialog.button.apply'] }}
      </BButton>
    </template>
  </BModal>
</template>
