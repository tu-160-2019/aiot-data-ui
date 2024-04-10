<template>
  <codemirror class="code" ref="editScript" v-model="codeModel" :extensions="extensions" v-bind="cmOption" @ready="handleReady" />
</template>

<script lang="ts" setup>
import { Codemirror } from 'vue-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import { propTypes } from '@/utils/iot/propTypes'

const props = defineProps({
  code: propTypes.string.def(''),
  model: propTypes.string.def('text/javascript'),
})
const emits = defineEmits(['update:code'])
const codeModel = ref('')
watch(() => props.code, (newV) => {
  codeModel.value = newV
}, {
  immediate: true,
})
watch(codeModel, (newV) => {
  emits('update:code', newV)
})
const extensions = [javascript(), oneDark]
const view = shallowRef()
const handleReady = (payload: any) => {
  view.value = payload.view
}
const cmOption = reactive({
  tabSize: 2,
  lineNumbers: true,
  line: true,
  indentWithTabs: true,
  smartIndent: true,
  autofocus: true,
  mode: props.model,
  theme: 'monokai',
  foldGutter: true,
  lineWrapping: true,
  gutters: [
    'CodeMirror-linenumbers',
    'CodeMirror-foldgutter',
    'CodeMirror-lint-markers',
  ],
})
</script>

<style lang="scss" scoped>
::v-deep(.cm-editor) {
  min-height: 200px;
}
</style>
