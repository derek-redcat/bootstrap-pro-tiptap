<!--
  * @Date: 2023-06-14 21:43:39
  * @LastEditors: yikoyu 2282373181@qq.com
  * @LastEditTime: 2023-06-14 23:11:42
  * @FilePath: \bootstrap-pro-tiptap\examples\components\CustomLang.vue
-->
<script setup lang="ts">
import { BCard, BCol, BFormGroup, BFormInput, BRow } from 'bootstrap-vue-next'
import { computed, unref } from 'vue'

interface Props {
  modelValue?: {
    [x: string]: string
  }
}

interface Emits {
  (event: 'update:modelValue', modelValue: Props['modelValue']): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({}),
})
const emits = defineEmits<Emits>()

const customLang = computed({
  get: () => props.modelValue,
  set: (val) => {
    emits('update:modelValue', val)
  },
})
const customLangKey = computed(() => Object.keys(unref(customLang)))
</script>

<template>
  <BCard class="mt-2" title="Custom Lang">
    <BRow>
      <BCol v-for="key in customLangKey" :key="key" cols="12" sm="6" md="4" lg="3" class="mb-2">
        <BFormGroup :label="key" label-class="small text-truncate">
          <BFormInput v-model="customLang[key]" size="sm" />
        </BFormGroup>
      </BCol>
    </BRow>
  </BCard>
</template>
