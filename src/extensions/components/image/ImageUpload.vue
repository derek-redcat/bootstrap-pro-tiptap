<script setup lang="ts">
import type { ImageForm } from './types'

import { BFormCheckbox, BFormFile, BFormGroup, BFormInput, BSpinner } from 'bootstrap-vue-next'
import { computed, ref, unref } from 'vue'

import Logger from '@/utils/logger'

interface Props {
  modelValue?: ImageForm
  upload?: (file: File) => Promise<string>
  t: (path: string) => string
}

interface Emits {
  (event: 'update:modelValue', value: ImageForm): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({}),
  upload: undefined,
})

const emit = defineEmits<Emits>()

const loading = ref<boolean>(false)
const form = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})

async function onFileSelected(files: File | File[] | null | undefined) {
  const file = files instanceof File ? files : files?.[0]
  if (!file) {
    form.value = { ...unref(form), file: undefined, src: undefined }
    return
  }

  try {
    loading.value = true
    const data = await props.upload?.(file)
    if (!data) {
      throw new Error('No link received after upload')
    }

    form.value = {
      ...unref(form),
      file,
      src: data,
    }
  }
  catch (err) {
    Logger.error(`Failed to execute upload file: ${err}`)
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <fieldset :disabled="loading">
    <BFormGroup :label="t('editor.image.dialog.form.file')" label-for="bpt-image-file" class="mb-3">
      <div class="d-flex align-items-center gap-2">
        <BFormFile id="bpt-image-file" accept="image/*" @update:model-value="onFileSelected" />
        <BSpinner v-if="loading" small />
      </div>
    </BFormGroup>

    <BFormGroup :label="t('editor.image.dialog.form.link')" label-for="bpt-image-upload-src" class="mb-3">
      <BFormInput id="bpt-image-upload-src" :model-value="form.src" disabled />
    </BFormGroup>

    <BFormGroup :label="t('editor.image.dialog.form.alt')" label-for="bpt-image-upload-alt" class="mb-3">
      <BFormInput id="bpt-image-upload-alt" v-model="form.alt" />
    </BFormGroup>

    <BFormCheckbox v-model="form.lockAspectRatio">
      {{ t('editor.image.dialog.form.aspectRatio') }}
    </BFormCheckbox>
  </fieldset>
</template>
