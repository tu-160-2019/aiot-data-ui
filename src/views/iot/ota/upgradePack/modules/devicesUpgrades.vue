<template>
  <el-dialog
    title="设备升级"
    @close="handleClose"
    width="800"
    v-model="state.visible"
    :before-close="beforeClose"
    v-loading="state.loading"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    append-to-body
    destroy-on-close
  >
    <el-transfer
      v-model="dataValue"
      :props="{
        key: 'id',
        label: 'deviceName',
      }"
      :titles="['可选择设备', '已选择设备']"
      filterable
      :filter-method="filterMethod"
      filter-placeholder="搜索DN"
      :data="data"
    />
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">上传</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { getDevices, upgradeUpgradePack } from '../../api/upgradePack.api'

const state = reactive({
  visible: false,
  id: '',
  loading: false,
})

const data = ref<any[]>([])
const dataValue = ref([])
const getData = (key) => {
  state.loading = true
  getDevices({
    productKey: key || '',
  }).then(res => {
    data.value = res.data.rows || []
  }).finally(() => {
    state.loading = false
  })
}
const filterMethod = (query, item) => {
  return item.deviceName.toLowerCase().includes(query.toLowerCase())
}
const handleClose = () => {
  state.visible = false
}
const handleSubmit = () => {
  if (dataValue.value.length === 0) return ElMessage.error('请选择设备')
  upgradeUpgradePack({
    otaId: state.id,
    deviceIds: dataValue.value
  }).then((res) => {
    ElMessage.warning(res.data.result)
    handleClose()
  })
  state.visible = true
}

const openDialog = (row) => {
  if (!row.id) return ElMessage.error('id为空')
  state.visible = true
  state.id = row.id
  getData(row.productKey)
}
const beforeClose = (done: () => void) => {
  data.value = []
  dataValue.value = []
  done()
}
defineExpose({
  openDialog,
})
</script>

<style lang="scss" scoped>
:deep(.el-transfer-panel) {
  width: 300px;
}
:deep(.el-transfer-panel__filter) {
  width: 250px;
}
.el-transfer {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
