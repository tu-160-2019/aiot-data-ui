<template>
  <el-dialog
    v-model="state.show"
    title="子设备列表"
    width="1100px"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    append-to-body
    destroy-on-close
  >
    <yt-table
      v-if="state.show"
      :column="columns"
      :data="data"
      :total="state.total"
      :loading="state.loading"
      v-model:page="state.page"
      :view-btn="false"
      :edit-btn="false"
      :selection="false"
      :del-btn="false"
      @on-load="getData"
      menu-slot
    >
      <template #state="scope">
        <el-tag v-if="scope.row.online" type="success" size="small">在线</el-tag>
        <el-tag v-else type="danger" size="small">离线</el-tag>
      </template>
      <template #menuSlot="scope">
        <el-popconfirm title="确认要解除与网关的关联吗？" @confirm="handleDelete(scope.row)">
          <template #reference>
            <el-button link type="danger" icon="Delete">解绑</el-button>
          </template>
        </el-popconfirm>
      </template>
    </yt-table>
  </el-dialog>
</template>
<script lang="ts" setup>
import { IColumn } from '@/components/iot/common/types/tableCommon'
import { getChildrenDeviceList } from '../../api/devices.api'
import { unbindDevice } from '../../api/devices.api'

import { ElPopconfirm } from 'element-plus'
import YtTable from '@/components/iot/common/yt-table'

const state = reactive({
  show: false,
  row: {} as any,
  page: {
    pageSize: 100,
    pageNum: 1,
  },
  total: 0,
  loading: false,
})
const columns = ref<IColumn[]>([
  {
    label: '设备ID',
    key: 'deviceId',
  },
  {
    label: '产品',
    key: 'productName',
    tableWidth: 120,
  },
  {
    label: '设备DN',
    key: 'deviceName',
    tableWidth: 150,
  },
  {
    label: '状态',
    key: 'state',
    slot: true,
    tableWidth: 80,
  },
  {
    label: '创建时间',
    key: 'createAt',
    type: 'date',
    sortable: true,
    tableWidth: 180,
  },
])
const data = ref([
  {
    id: '16465723451670abc123000030000011a',
    deviceId: '16465723451670abc123000030000011a',
    productKey: 'Rf4QSjbm65X45753',
    productName: '一路开关',
    deviceName: 'ABC12300003',
    model: 'S01',
    secret: null,
    parentId: '16465226744430aabbccdd22000000143',
    uid: 'fa1c5eaa-de6e-48b6-805e-8f091c7bb831',
    subUid: [],
    state: {
      online: true,
      onlineTime: 1681868220001,
      offlineTime: 1680171375073,
    },
    property: null,
    tag: {},
    group: {},
    createAt: 1646572345167,
  },
  {
    id: '16465723448670abc1230000200000115',
    deviceId: '16465723448670abc1230000200000115',
    productKey: 'Rf4QSjbm65X45753',
    productName: '一路开关',
    deviceName: 'ABC12300002',
    model: 'S01',
    secret: null,
    parentId: '16465226744430aabbccdd22000000143',
    uid: 'fa1c5eaa-de6e-48b6-805e-8f091c7bb831',
    subUid: [],
    state: {
      online: true,
      onlineTime: 1681868220123,
      offlineTime: 1680171375097,
    },
    property: null,
    tag: {},
    group: {},
    createAt: 1646572344867,
  },
])

const handleDelete = async (row: any) => {
  state.loading = true
  await unbindDevice(row.id)
  ElMessage.success('删除成功!')
  state.loading = false
  getData()
}

const getData = () => {
  getChildrenDeviceList({
    ...state.page,
    coverData: state.row.id,
  })
    .then((res) => {
      state.page.pageSize = res.data.length
      state.page.pageNum = 1
      state.total = res.data.length
      res.data.forEach((d: any) => {
        d['productName'] = d['product']?.name
      })
      data.value = res.data
      console.log(res)
    })
    .finally(() => {
      state.loading = false
    })
}

const openDialog = (row: any) => {
  state.show = true
  state.row = row
  console.log('row', row)
  state.loading = true
  getData()
}

defineExpose({
  openDialog,
})
</script>
