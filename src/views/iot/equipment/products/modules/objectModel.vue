<template>
  <el-dialog
    title="产品物模型"
    width="70%"
    v-model="state.visible"
    top="20px"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    append-to-body
    destroy-on-close
  >
    <div v-if="state.visible" v-loading="state.loading">
      <el-tabs type="border-card" v-model="activeTab">
        <el-tab-pane label="功能列表" :name="0">
          <function-config v-if="activeTab === 0" :id="state.id" :model="state.model" />
        </el-tab-pane>
        <el-tab-pane label="TSL" :name="1">
          <tsl v-if="activeTab === 1" :id="state.id" :model="state.model" />
        </el-tab-pane>
        <el-tab-pane label="型号配置" :name="2">
          <model-number-config v-if="activeTab === 2" :id="state.id" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-dialog>
</template>
<script lang="ts" setup>
import { useEmitt } from '@/hooks/iot/useEmitt'
import { getObjectModel } from '../../api/products.api'

import FunctionConfig from './functionConfig.vue'
import ModelNumberConfig from './modelNumberConfig.vue'
import Tsl from './tsl.vue'

const activeTab = ref(0)
const state = reactive({
  loading: false,
  visible: false,
  id: '',
  model: {
    services: [],
    properties: [],
    events: [],
  } as any,
})
// 获取数据
const getInfo = (key: string) => {
  state.visible = true
  state.loading = true
  state.id = key
  getData()
}
const { emitter } = useEmitt({
  name: 'updateObjectModel',
  callback: () => getData()
})
const getData = () => {
  getObjectModel(state.id).then(res => {
    const data = res.data || {}
    if (data.model) {
      data.model.services = data.model.services || []
      data.model.properties = data.model.properties || []
      data.model.events = data.model.events || []
    }
    state.model = data.model || {
      services: [],
      properties: [],
      events: [],
    }
  }).finally(() => {
    state.loading = false
  })
}
defineExpose({
  getInfo,
})
</script>

<!-- <style lang="less" scoped>

</style> -->
