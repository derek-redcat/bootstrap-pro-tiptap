<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import type { CreateTablePayload, TableACtionKey, TableItem } from './type'

import { BListGroup, BListGroupItem } from 'bootstrap-vue-next'
import { computed, ref, unref, watch } from 'vue'
import Icon from '@/components/Icon.vue'
import { getIcon } from '@/constants/icons'

import { useLocale } from '@/locales'
import ActivatorPopover from '../ActivatorPopover.vue'
import CreateTablePopover from './CreateTablePopover.vue'

interface Props {
  editor: Editor
}

const props = withDefaults(defineProps<Props>(), {})

const { t } = useLocale()

const menu = ref<boolean>(false)
const showGrid = ref<boolean>(false)

watch(menu, (val) => {
  if (!val)
    showGrid.value = false
})
const items = computed<TableItem[]>(() => {
  return [
    {
      type: 'item',
      key: 'insert-table',
      title: unref(t)('editor.table.menu.insert_table'),
      icon: getIcon('tablePlus'),
      disabled: !props.editor.can().insertTable() || false,
    },
    {
      type: 'divider',
    },
    {
      type: 'item',
      key: 'add-column-before',
      title: unref(t)('editor.table.menu.add_column_before'),
      icon: getIcon('tableColumnPlusBefore'),
      disabled: !props.editor.can().addColumnBefore() || false,
    },
    {
      type: 'item',
      key: 'add-column-after',
      title: unref(t)('editor.table.menu.add_column_after'),
      icon: getIcon('tableColumnPlusAfter'),
      disabled: !props.editor.can().addColumnAfter() || false,
    },
    {
      type: 'item',
      key: 'delete-column',
      title: unref(t)('editor.table.menu.delete_column'),
      icon: getIcon('tableColumnRemove'),
      disabled: !props.editor.can().deleteColumn() || false,
    },
    {
      type: 'divider',
    },
    {
      type: 'item',
      key: 'add-row-before',
      title: unref(t)('editor.table.menu.add_row_before'),
      icon: getIcon('tableRowPlusBefore'),
      disabled: !props.editor.can().addRowBefore() || false,
    },
    {
      type: 'item',
      key: 'add-row-after',
      title: unref(t)('editor.table.menu.add_row_after'),
      icon: getIcon('tableRowPlusAfter'),
      disabled: !props.editor.can().addRowAfter() || false,
    },
    {
      type: 'item',
      key: 'delete-row',
      title: unref(t)('editor.table.menu.delete_row'),
      icon: getIcon('tableRowRemove'),
      disabled: !props.editor.can().deleteRow() || false,
    },
    {
      type: 'divider',
    },
    {
      type: 'item',
      key: 'merge-or-split-cells',
      title: unref(t)('editor.table.menu.merge_or_split_cells'),
      icon: getIcon('tableMergeCells'),
      disabled: !props.editor.can().mergeOrSplit() || false,
    },
    {
      type: 'divider',
    },
    {
      type: 'item',
      key: 'delete-table',
      title: unref(t)('editor.table.menu.delete_table'),
      icon: getIcon('tableRemove'),
      disabled: !props.editor.can().deleteTable() || false,
    },
  ] as TableItem[]
})

function setTable<T extends object>(key?: TableACtionKey, options?: T) {
  if (!key)
    return

  const { editor } = props

  const actions: Record<TableACtionKey, () => void> = {
    'insert-table': () =>
      editor
        .chain()
        .focus()
        .insertTable({ ...options })
        .run(),
    'add-column-before': () => editor.chain().focus().addColumnBefore().run(),
    'add-column-after': () => editor.chain().focus().addColumnAfter().run(),
    'delete-column': () => editor.chain().focus().deleteColumn().run(),
    'add-row-before': () => editor.chain().focus().addRowBefore().run(),
    'add-row-after': () => editor.chain().focus().addRowAfter().run(),
    'delete-row': () => editor.chain().focus().deleteRow().run(),
    'merge-or-split-cells': () => editor.chain().focus().mergeOrSplit().run(),
    'delete-table': () => editor.chain().focus().deleteTable().run(),
  }

  actions[key]?.()
  menu.value = false
}

function createTable(options: CreateTablePayload) {
  setTable('insert-table', options)
  menu.value = false
}
</script>

<template>
  <ActivatorPopover v-model="menu">
    <BListGroup flush class="bootstrap-pro-tiptap-menu">
      <template v-for="(item, index) in items" :key="index">
        <template v-if="item.key === 'insert-table'">
          <BListGroupItem
            button
            class="d-flex align-items-center gap-2 py-1"
            :active="showGrid"
            :disabled="item.disabled"
            @click="showGrid = !showGrid"
          >
            <Icon :icon="item.icon" />
            <span>{{ item.title }}</span>
          </BListGroupItem>

          <div v-if="showGrid" class="list-group-item p-0">
            <CreateTablePopover @create-table="createTable" />
          </div>
        </template>

        <BListGroupItem
          v-else-if="item.type === 'item'"
          button
          class="d-flex align-items-center gap-2 py-1"
          :disabled="item.disabled"
          @click="setTable(item.key)"
        >
          <Icon :icon="item.icon" />
          <span>{{ item.title }}</span>
        </BListGroupItem>

        <hr v-else class="my-0">
      </template>
    </BListGroup>
  </ActivatorPopover>
</template>
