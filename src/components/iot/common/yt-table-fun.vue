<template>
  <el-card shadow="never" v-if="!hide">
    <template #header>
      <el-row justify="space-between" style="margin-bottom: 0;">
        <el-row :gutter="gutter" align="middle" class="mb8">
          <el-col :span="span" v-if="addBtn">
            <el-button v-bind="addBind" type="primary" icon="Plus" @click="emits('handleAdd')">{{ addBtnText }}</el-button>
          </el-col>
          <el-col :span="span" v-if="exportBtn">
            <el-button v-bind="exportBind" plain @click="emits('handleExport')">
              <svg-icon-iot icon-class="export" />
              <span style="color: rgb(0, 112, 255);">{{ exportBtnText }}</span>
            </el-button>
          </el-col>
          <el-col :span="span" v-if="delBtn" class="ml10" style="display: flex;align-items: center;">
            <el-checkbox v-model="isAll" @change="(e) => emits('changeAll', e)" :indeterminate="isIndeterminate" label="all" size="large">
              <div class="checkbox-txt">
                已选<span>{{ props.multipleSelection.length || 0 }}</span
                >项
              </div>
            </el-checkbox>
            <el-button
              class="ml10"
              type="danger"
              link
              icon="Delete"
              v-bind="delBind"
              :disabled="props.multipleSelection.length === 0"
              @click="handleDel"
              >{{ delBtnText }}</el-button
            >
          </el-col>
        </el-row>
        <div class="rightToolbar">
          <slot name="rightToolbar"></slot>
        </div>
      </el-row>
    </template>
    <div>
      <slot></slot>
    </div>
  </el-card>
  <div v-else>
    <slot></slot>
  </div>
</template>
<script lang="ts" setup>
import { funProps } from './props/crudProps'

import { ElMessageBox } from 'element-plus'

const props = defineProps({...funProps})

const exportBind = reactive(props.exportPermi ? {
  vHasPermi: props.exportPermi
} : {})

const addBind = reactive(props.addPermi ? {
  vHasPermi: props.addPermi
} : {})
const delBind = reactive(props.delPermi ? {
  vHasPermi: props.delPermi
} : {})

// 参数
const showSearch = ref(false)
const isAll = ref(false)
const isIndeterminate = ref(false)
const emits = defineEmits(['handleAdd', 'handleDel', 'handleExport', 'reloadData', 'changeAll'])

const handleDel = () => {
  ElMessageBox.confirm(
    `是否确认批量删除${props.multipleSelection.length}条数据?`,
    '提示',
    {
      type: 'warning',
    }
  )
    .then(() => {
      emits('handleDel', props.multipleSelection)
    })
}
watch(() => props.multipleSelection, (newV) => {
  isAll.value = newV.length === props.limit
  isIndeterminate.value = 0 < newV.length && newV.length < props.limit
})
</script>

<style lang="scss" scoped>
.rightToolbar {
  display: flex;
  align-items: center;
  padding-right: 10px;
}
.checkbox-txt {
  color: #333;
  span {
    color: var(--el-color-primary);
    font-weight: 600;
  }
}
::v-deep(.el-checkbox.el-checkbox--large) {
  height: auto;
}
</style>
