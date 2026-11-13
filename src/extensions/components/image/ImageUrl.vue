<script setup lang="ts">
import type { ImageForm } from './types'

import { BFormCheckbox, BFormGroup, BFormInput } from 'bootstrap-vue-next'
import { computed } from 'vue'

interface Props {
  modelValue?: ImageForm
  t: (path: string) => string
}

interface Emits {
  (event: 'update:modelValue', value: ImageForm): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({}),
})

const emit = defineEmits<Emits>()

const form = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})
</script>

<template>
  <div>
    <BFormGroup :label="t('editor.image.dialog.form.link')" label-for="bpt-image-src" class="mb-3">
      <BFormInput id="bpt-image-src" v-model="form.src" type="url" autofocus />
    </BFormGroup>

    <BFormGroup :label="t('editor.image.dialog.form.alt')" label-for="bpt-image-alt" class="mb-3">
      <BFormInput id="bpt-image-alt" v-model="form.alt" />
    </BFormGroup>

    <BFormCheckbox v-model="form.lockAspectRatio">
      {{ t('editor.image.dialog.form.aspectRatio') }}
    </BFormCheckbox>
  </div>
</template>
