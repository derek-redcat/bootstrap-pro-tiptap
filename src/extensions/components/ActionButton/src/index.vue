<script setup lang="ts">
import type { ComponentPublicInstance, Ref } from 'vue'
import { BButton, BTooltip } from 'bootstrap-vue-next'
import { computed, inject, ref } from 'vue'
import Icon from '@/components/Icon.vue'
import { getIcon } from '@/constants/icons'
import { provideActivator } from '@/hooks/use-activator'
import { actionButtonProps } from './props'

const props = defineProps(actionButtonProps)

const disableToolbar = inject<Readonly<Ref<boolean>>>('disableToolbar', ref(false))

const btnRef = ref<ComponentPublicInstance | null>(null)
const el = computed<HTMLElement | null>(() => (btnRef.value?.$el as HTMLElement | undefined) ?? null)

const { activate } = provideActivator(el)

const active = computed(() => props.isActive?.() ?? false)
const tooltipOpen = ref(false)

function onClick() {
  tooltipOpen.value = false
  props.action?.()
  activate()
}
</script>

<template>
  <span class="bootstrap-pro-tiptap-action">
    <BButton
      ref="btnRef"
      class="bootstrap-pro-tiptap-action__btn"
      size="sm"
      variant="link"
      :disabled="disableToolbar || disabled"
      :class="{ active }"
      :aria-pressed="active"
      :aria-label="tooltip || undefined"
      @click="onClick"
    >
      <slot name="icon">
        <Icon :icon="getIcon(props.icon)" :color="color" />
      </slot>
    </BButton>

    <BTooltip v-if="tooltip && el" v-model="tooltipOpen" :target="el" :title="tooltip" placement="top" hover noninteractive />

    <slot :activator="el" />
  </span>
</template>
