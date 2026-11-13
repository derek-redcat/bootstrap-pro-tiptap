<script setup lang="ts">
import type { ActionMenuButtonItem } from './types'

import { BListGroup, BListGroupItem } from 'bootstrap-vue-next'
import { computed, ref } from 'vue'
import Icon from '@/components/Icon.vue'
import { getIcon } from '@/constants/icons'
import { getCssUnitWithDefault } from '@/utils/utils'
import { ActionButton } from '../../ActionButton'
import ActivatorPopover from '../../ActivatorPopover.vue'
import { actionButtonMenuProps } from './props'

const props = defineProps(actionButtonMenuProps)

const menu = ref<boolean>(false)

const active = computed<ActionMenuButtonItem>(() => {
  const find = props.items.find(k => k.isActive())
  if (find && !find.default) {
    return {
      ...find,
      icon: find.icon ? find.icon : props.icon,
    }
  }

  const item: ActionMenuButtonItem = {
    title: props.tooltip,
    icon: props.icon,
    isActive: () => false,
  }

  return item
})

function onSelect(item: ActionMenuButtonItem) {
  item.action?.()
  menu.value = false
}
</script>

<template>
  <ActionButton
    :editor="editor"
    :icon="active.icon"
    :tooltip="active.title"
    :disabled="disabled"
    :color="color"
    :is-active="active.isActive"
  >
    <ActivatorPopover v-model="menu">
      <BListGroup
        flush
        class="bootstrap-pro-tiptap-menu"
        :style="{ maxHeight: getCssUnitWithDefault(maxHeight), overflowY: 'auto' }"
      >
        <template v-for="(item, i) in items" :key="i">
          <BListGroupItem
            button
            class="d-flex align-items-center gap-2 py-1"
            :class="{ 'border-bottom': item.divider }"
            :active="item.isActive()"
            :disabled="item.disabled"
            @click="onSelect(item)"
          >
            <Icon v-if="item.icon" :icon="getIcon(item.icon)" />
            <span :style="item.style">{{ item.title }}</span>
          </BListGroupItem>
        </template>
      </BListGroup>
    </ActivatorPopover>
  </ActionButton>
</template>
