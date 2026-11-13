<script setup lang="ts">
import type { PopoverPlacement } from 'bootstrap-vue-next'
import { BPopover } from 'bootstrap-vue-next'
import { ref, watch } from 'vue'
import { useActivator } from '@/hooks/use-activator'

interface Props {
  placement?: PopoverPlacement
  bodyClass?: string
}

withDefaults(defineProps<Props>(), {
  placement: 'bottom-start',
  bodyClass: 'p-0',
})

const open = defineModel<boolean>({ default: false })

const activator = useActivator()

// Only mount the (potentially heavy) content while the popover is open or animating out.
const rendered = ref(false)
watch(open, (val) => {
  if (val)
    rendered.value = true
})

function close() {
  open.value = false
}
</script>

<template>
  <BPopover
    v-if="activator?.el.value"
    v-model="open"
    :target="activator.el.value"
    :placement="placement"
    :body-class="bodyClass"
    class="bootstrap-pro-tiptap-popover"
    strategy="fixed"
    click
    @hidden="rendered = false"
  >
    <slot v-if="rendered" :close="close" />
  </BPopover>
</template>
