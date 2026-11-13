<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import type { ImageAttrsOptions, ImageForm, ImageTab, ImageTabKey } from './types'

import { BButton, BModal, BTab, BTabs } from 'bootstrap-vue-next'
import { computed, ref, unref, watch } from 'vue'
import { useActivator } from '@/hooks/use-activator'
import { useLocale } from '@/locales'

import ImageUpload from './ImageUpload.vue'
import ImageUrl from './ImageUrl.vue'

interface Props {
  value?: ImageAttrsOptions
  editor: Editor
  upload?: (file: File) => Promise<string>
  imageTabs?: ImageTab[]
  hiddenTabs?: ImageTabKey[]
  destroy?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  value: () => ({}),
  upload: undefined,
  imageTabs: () => [],
  hiddenTabs: () => [],
  destroy: undefined,
})

const { t } = useLocale()

const dialog = ref<boolean>(false)

useActivator()?.onActivate(() => {
  dialog.value = true
})

const tab = ref<number>(0)
const form = ref<ImageForm>({})

const defaultImageTabs = computed<ImageTab[]>(() => {
  const defTabs: ImageTab[] = [
    {
      name: unref(t)('editor.image.dialog.tab.url'),
      type: 'url',
      component: ImageUrl,
    },
    {
      name: unref(t)('editor.image.dialog.tab.upload'),
      type: 'upload',
      component: ImageUpload,
    },
  ]

  const filterDefTabs = defTabs.filter((item) => {
    if (!item.type)
      return item
    return !props.hiddenTabs.includes(item.type)
  })

  return [...filterDefTabs, ...props.imageTabs]
})

const disabledApply = computed<boolean>(() => {
  const { src } = unref(form)
  if (typeof src === 'string' && src !== '')
    return false
  return true
})

async function apply() {
  const { src, lockAspectRatio, height } = unref(form)
  if (!src)
    return

  props.editor
    .chain()
    .focus()
    .setImage({
      ...unref(form),
      src,
      height: lockAspectRatio ? undefined : height,
    })
    .run()

  close()
}

function close() {
  dialog.value = false
  form.value = {}

  setTimeout(() => props.destroy?.(), 300)
}

watch(
  () => props.value,
  (val) => {
    form.value = {
      ...unref(form),
      ...val,
    }
  },
  { immediate: true, deep: true },
)
</script>

<template>
  <BModal v-model="dialog" lazy :title="t('editor.image.dialog.title')" centered @hidden="close">
    <BTabs v-model:index="tab" content-class="pt-3">
      <BTab v-for="(imageTab, i) in defaultImageTabs" :key="i" :title="imageTab.name">
        <component :is="imageTab.component" v-model="form" :upload="upload" :t="t" />
      </BTab>
    </BTabs>

    <template #footer>
      <BButton variant="primary" :disabled="disabledApply" @click="apply">
        {{ t('editor.image.dialog.button.apply') }}
      </BButton>
    </template>
  </BModal>
</template>
