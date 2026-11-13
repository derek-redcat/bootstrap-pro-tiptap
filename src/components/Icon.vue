<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** SVG path data (e.g. from @mdi/js). A leading `svg:` prefix is accepted for backwards compatibility. */
  icon?: string
  color?: string
  size?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  icon: undefined,
  color: undefined,
  size: '1.25em',
})

const path = computed(() => props.icon?.replace(/^svg:/, ''))
const dimension = computed(() => (typeof props.size === 'number' ? `${props.size}px` : props.size))
</script>

<template>
  <svg
    v-if="path"
    class="bootstrap-pro-tiptap-icon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    :width="dimension"
    :height="dimension"
    :style="{ color }"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path :d="path" />
  </svg>
</template>
