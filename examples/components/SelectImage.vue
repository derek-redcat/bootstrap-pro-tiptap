<script setup lang="ts">
import { BAlert, BFormCheckbox, BFormGroup, BFormInput, BFormSelect } from 'bootstrap-vue-next'
import { computed, unref, watch } from 'vue'

interface SelectImageProps {
  modelValue?: Record<string, any>
  upload?: (file: File) => Promise<string> // vue warn
  t: (path: string) => string // vue warn
}

interface SelectImageEmits {
  (event: 'update:modelValue', form?: Record<string, any>): void
}

const props = withDefaults(defineProps<SelectImageProps>(), {
  modelValue: () => ({}),
  upload: undefined,
})

const emits = defineEmits<SelectImageEmits>()

const form = computed({
  get: () => props.modelValue,
  set: (val) => {
    emits('update:modelValue', val)
  },
})

const items = [
  { alt: 'Test 1', src: 'https://picsum.photos/1920/1080.webp?t=1' },
  { alt: 'Test 2', src: 'https://picsum.photos/1920/1080.webp?t=2' },
  { alt: 'Test 3', src: 'https://picsum.photos/1920/1080.webp?t=3' },
]

watch(
  () => unref(form).src,
  (val) => {
    const find = items.find(k => k.src === val)
    if (find) {
      form.value.alt = find.alt
    }
  },
)
</script>

<template>
  <BAlert class="mb-3" variant="info" :model-value="true">
    Select tab is custom component
  </BAlert>

  <BFormGroup label="Select Image" class="mb-3">
    <BFormSelect v-model="form.src" :options="items" value-field="src" text-field="alt" />
  </BFormGroup>

  <BFormGroup label="Alt" class="mb-3">
    <BFormInput v-model="form.alt" />
  </BFormGroup>

  <BFormCheckbox v-model="form.lockAspectRatio">
    Lock original aspect ratio
  </BFormCheckbox>
</template>
