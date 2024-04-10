<template>
  <el-dialog
    title="Cron表达式生成器"
    v-model="cronDialog"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    append-to-body
    destroy-on-close
  >
    <table-index v-if="cronDialog" ref="cronBoxRef" @fill="cronFill" />
    <template #footer>
      <el-button type="primary" @click="submitFill">确定</el-button>
      <el-button type="warning" @click="clearCron">重置</el-button>
      <el-button @click="hidePopup">取消</el-button>
    </template>
  </el-dialog>
  <el-input v-model="stringValue">
    <template #append>
      <el-button @click="openDialog">生成</el-button>
    </template>
  </el-input>
</template>
<script lang="ts" setup>
import { propTypes } from '@/utils/iot/propTypes'
import tableIndex from './tabIndex.vue'

const props = defineProps({
  modelValue: propTypes.string.def('')
})

const stringValue = ref(props.modelValue)
console.log(props)

const emits = defineEmits(['update:modelValue'])
const cronBoxRef = ref()
const cronDialog = ref(false)
const submitFill = () => {
  nextTick(() => {
    cronBoxRef.value.submitFill()
  })
}
const clearCron = () => {
  nextTick(() => {
    cronBoxRef.value.clearCron()
  })
}
const hidePopup = () => {
  nextTick(() => {
    cronBoxRef.value.hidePopup()
    cronDialog.value = false
  })
}
const cronFill = (string: string) => {
  stringValue.value = string
  cronDialog.value = false
}
watch(() => stringValue.value, (newV) => {
  emits('update:modelValue', newV)
})
const openDialog = () => {
  cronDialog.value = true
}
</script>

<!-- <style lang="scss" scoped>

</style> -->
