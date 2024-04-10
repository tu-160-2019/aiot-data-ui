<template>
  <yt-crud
  ref="crudRef" :data="data" :column="column"
  :loading="state.loading"
  :total="state.total"
  v-model:page="state.page"
  v-model:query="state.query"
  :tableProps=" {
    selection: true,
    viewBtn: false,
    editBtn: false,
    delBtn: false,
    menuSlot: true,
    menuWidth: 300,
  }"
  :funProps="{
    addBtn: false,
    delBtn: true,
    delBtnText: '批量退组'
  }"
  @on-load="getData"
  @delFun="onDelete"
  >
      <template #menuSlot="scope">
        <el-button type="text" size="small" @click="removeFromGroup(scope.row.id)">退组</el-button>
      </template>

      <template #online="scope">
        <el-tag class="state" v-if="scope.row.online === true" type="success" size="small">在线</el-tag>
        <el-tag class="state" v-else-if="scope.row.online === false" type="danger" size="small">离线</el-tag>
      </template>

      <template #group="scope">
        <el-tag v-for="i,k in scope.row.group" :key="k">{{ i.name }}</el-tag>
      </template>
  </yt-crud>
</template>
<script lang="ts" setup>
import { IColumn } from '@/components/iot/common/types/tableCommon'

import YtCrud from '@/components/iot/common/yt-crud.vue'

import { getDevicesList, removeDeviceFromDeviceGroup } from '../api/devices.api'
import { getProductsList, IProductsVO } from '../api/products.api'

const route = useRoute()
const { id } = route.params

const column = ref<IColumn[]>([
  {
    label: '设备ID',
    key: 'deviceId',
  },
  {
    label: '产品',
    key: 'productKey',
    type: 'select',
    search: true,
    colSpan: 12,
    tableWidth: 120,
    editDisabled: true,
    componentProps: {
      labelAlias: 'name',
      valueAlias: 'productKey',
      options: [],
    },
  },
  {
    label: '设备DN',
    key: 'deviceName',
    tableWidth: 240,
    search: true
  },
  {
    label: '分组',
    key: 'group',
    tableWidth: 240,
    slot: true,
  },
  {
    label: '状态',
    key: 'online',
    type: 'select',
    componentProps: {
      options: [
        {
          label: '在线',
          value: true,
        },
        {
          label: '离线',
          value: false,
        },
      ],
    },
    search: false,
    tableWidth: 80,
    slot: true,
  },
  {
    label: '创建时间',
    key: 'createAt',
    tableWidth: 180,
    sortable: true,
    type: 'date',
  },
])

const data = ref()

const state = reactive({
  page: {
    pageSize: 10,
    pageNum: 1,
  },
  total: 0,
  loading: false,
  query: {
    group: id
  },
})

// 产品字典
const productOptions = ref<IProductsVO[]>([])
const getDict = () => {
  getProductsList({
    pageNum: 1,
    pageSize: 99999,
  }).then((res) => {
    productOptions.value = res.data.rows || []
    column.value.forEach((item) => {
      if (item.key === 'productKey') {
        item.componentProps.options = productOptions.value
      }
    })
  })
}
getDict()

const getData = () => {
  state.loading = true
  getDevicesList({
    ...state.page,
    ...state.query}).then(res => {
      data.value = res.data.rows
      state.total = res.data.total
  }).finally(() => state.loading = false)
}


// removeFromGroup 退组
const removeFromGroup = (deviceId: string) => {

  removeDeviceFromDeviceGroup({group: id, devices: [deviceId]}).then(res => {
    // 退组成功
    if (res.code == 200 ) {
      ElMessage.success('退组成功!')
      getData()
    }
  })
}


// 删除
const onDelete = async (row: any) => {
  state.loading = true
  if (row instanceof Array) {
    await removeDeviceFromDeviceGroup({group: id, devices: row.map((m) => m.id)})
  } else {
    await removeDeviceFromDeviceGroup({group: id, devices: [row.id]})
  }
  ElMessage.success('退组成功!')
  state.loading = false
  getData()
}

</script>

<!-- <style lang="scss" scoped>

</style> -->
