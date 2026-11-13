<script setup lang="ts">
import { BButton, BFormInput, BInputGroup } from 'bootstrap-vue-next'
import { computed, ref, watch } from 'vue'

import Icon from '@/components/Icon.vue'
import { COLORS_LIST } from '@/constants/define'
import { getIcon } from '@/constants/icons'
import ActivatorPopover from './ActivatorPopover.vue'

interface Props {
  modelValue?: string
}

interface Emits {
  (event: 'update:modelValue', color: string): void
  (event: 'change', color: string): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
})

const emit = defineEmits<Emits>()

const inputValue = ref('')
const menu = ref(false)

// <input type="color"> only accepts #rrggbb
const nativeValue = computed(() => (/^#[0-9a-f]{6}$/i.test(inputValue.value) ? inputValue.value : '#000000'))

watch(menu, () => {
  inputValue.value = props.modelValue ?? ''
})

function setColor(color: string) {
  if (!color)
    return

  emit('update:modelValue', color)
  emit('change', color)

  inputValue.value = color
  menu.value = false
}
</script>

<template>
  <ActivatorPopover v-model="menu" body-class="p-2">
    <div class="bootstrap-pro-tiptap-color-picker">
      <div class="bootstrap-pro-tiptap-color-picker__swatches">
        <button
          v-for="color in COLORS_LIST"
          :key="color"
          type="button"
          class="bootstrap-pro-tiptap-color-picker__swatch"
          :class="{ active: color.toLowerCase() === modelValue?.toLowerCase() }"
          :style="{ backgroundColor: color }"
          :title="color"
          :aria-label="color"
          @click="setColor(color)"
        />
      </div>

      <BInputGroup size="sm" class="mt-2">
        <input
          type="color"
          class="form-control form-control-color"
          :value="nativeValue"
          aria-label="Custom color"
          @input="inputValue = ($event.target as HTMLInputElement).value"
        >
        <BFormInput v-model="inputValue" placeholder="HEX" @keydown.enter.prevent="setColor(inputValue)" />
        <BButton variant="outline-secondary" :disabled="!inputValue" @click="setColor(inputValue)">
          <Icon :icon="getIcon('check')" size="1em" />
        </BButton>
      </BInputGroup>
    </div>
  </ActivatorPopover>
</template>
