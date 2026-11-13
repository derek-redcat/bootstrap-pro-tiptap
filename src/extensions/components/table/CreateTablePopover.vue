<script setup lang="ts">
import type { StyleValue } from 'vue'
import type { CreateTablePayload, GridSize } from './type'

import { BFormCheckbox } from 'bootstrap-vue-next'
import { reactive, ref, unref } from 'vue'
import { TABLE_DEFAULT_SELECTED_GRID_SIZE, TABLE_INIT_GRID_SIZE, TABLE_MAX_GRID_SIZE } from '@/constants/define'
import { useLocale } from '@/locales'

import { isMobile } from '@/utils/is-mobile'

interface Emits {
  (event: 'createTable', payload: CreateTablePayload): void
}

const emit = defineEmits<Emits>()

const { t } = useLocale()

const withHeaderRow = ref<boolean>(true)
const tableGridSize = reactive<GridSize>({
  rows: isMobile() ? TABLE_MAX_GRID_SIZE : TABLE_INIT_GRID_SIZE,
  cols: isMobile() ? TABLE_MAX_GRID_SIZE : TABLE_INIT_GRID_SIZE,
})

const selectedTableGridSize: GridSize = reactive<GridSize>({
  rows: TABLE_DEFAULT_SELECTED_GRID_SIZE,
  cols: TABLE_DEFAULT_SELECTED_GRID_SIZE,
})

function cellInnerStyles(row: number, col: number): StyleValue {
  const values: StyleValue = {
    boxSizing: 'border-box',
    width: '16px',
    height: '16px',
    padding: '4px',
    border: '1px solid var(--bs-border-color)',
    borderRadius: '2px',
  }

  if (col <= selectedTableGridSize.cols && row <= selectedTableGridSize.rows) {
    values.backgroundColor = 'var(--bs-primary-bg-subtle)'
    values.borderColor = 'var(--bs-primary)'
  }

  return values
}

function selectTableGridSize(rows: number, cols: number): void {
  if (rows === tableGridSize.rows) {
    tableGridSize.rows = Math.min(rows + 1, TABLE_MAX_GRID_SIZE)
  }

  if (cols === tableGridSize.cols) {
    tableGridSize.cols = Math.min(cols + 1, TABLE_MAX_GRID_SIZE)
  }

  selectedTableGridSize.rows = rows
  selectedTableGridSize.cols = cols
}

function onMouseDown(rows: number, cols: number) {
  emit('createTable', { rows, cols, withHeaderRow: unref(withHeaderRow) })
  resetTableGridSize()
}

function resetTableGridSize(): void {
  withHeaderRow.value = true

  tableGridSize.rows = TABLE_INIT_GRID_SIZE
  tableGridSize.cols = TABLE_INIT_GRID_SIZE

  selectedTableGridSize.rows = TABLE_DEFAULT_SELECTED_GRID_SIZE
  selectedTableGridSize.cols = TABLE_DEFAULT_SELECTED_GRID_SIZE
}
</script>

<template>
  <div class="p-2">
    <BFormCheckbox v-model="withHeaderRow" class="small mb-2">
      {{ t('editor.table.menu.insert_table.with_header_row') }}
    </BFormCheckbox>

    <div class="d-flex flex-column" @mouseleave="selectedTableGridSize.rows = selectedTableGridSize.cols = 0">
      <div v-for="row in tableGridSize.rows" :key="`r${row}`" class="d-flex">
        <div
          v-for="col in tableGridSize.cols"
          :key="`c${col}`"
          class="p-1"
          role="button"
          @mouseover="selectTableGridSize(row, col)"
          @mousedown.prevent="onMouseDown(row, col)"
        >
          <div :style="cellInnerStyles(row, col)" />
        </div>
      </div>
    </div>

    <div class="small text-body-secondary mt-1">
      {{ selectedTableGridSize.rows }} x {{ selectedTableGridSize.cols }}
    </div>
  </div>
</template>
