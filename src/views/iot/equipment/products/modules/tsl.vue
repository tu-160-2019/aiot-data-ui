<template>
  <vue-json-editor v-model:json="model" :showBtns="false" :mode="'code'" lang="zh" height="400" />
</template>
<script lang="ts" setup>
import { propTypes } from '@/utils/iot/propTypes'
import vueJsonEditor from 'vue3-ts-jsoneditor'

const props = defineProps({
  model: propTypes.object.def({}),
})

const model = ref(props.model)
watch(() => props.model, (newV) => {
  model.value = newV
})
</script>
