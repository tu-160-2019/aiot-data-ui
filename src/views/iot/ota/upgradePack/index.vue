<template>
  <yt-crud
    ref="crudRef"
    :data="data"
    :loading="state.loading"
    :total="state.total"
    v-model:page="state.page"
    v-model:query="state.query"
    :tableProps="{
      editBtn: false,
      menuSlot: true,
    }"
    @on-load="getData"
    @saveFun="onSave"
    @delFun="onDelete"
    :column="column"
  >
    <template #urlForm="{ row, type }">
      <file-upload
        v-if="type !== 'view'"
        v-model="row.url"
        :is-show-tip="false"
        :file-size="10000"
        :limit="1"
        :file-type="[]"
        uploadUrl="/ota/package/upload"
        uploadType="url"
        @uploadSuccess="(list) => uploadSuccess(row, list)"
      />
      <a v-else :href="row.url" target="_blank">{{ row.url }}</a>
    </template>
    <template #productKeyForm="{ row }">
      <div style="width: 250px;">
        <select-product v-model:pk="row.productKey"></select-product>
      </div>
    </template>
    <template #menuSlot="scope">
      <el-tooltip class="box-item" effect="dark" content="设备升级" placement="top">
        <el-button link type="primary" icon="Upload" @click="handleUpgrades(scope.row)" />
      </el-tooltip>
      <el-divider direction="vertical" />
      <el-tooltip class="box-item" effect="dark" content="升级历史" placement="top">
        <el-button link type="primary" icon="Document" @click="handleHistory(scope.row)" />
      </el-tooltip>
    </template>
  </yt-crud>
  <devices-upgraders ref="devicesUpgradersRef" />
  <history-dialog ref="historyRef" />
</template>
<script lang="ts" setup>
import { IColumn } from '@/components/iot/common/types/tableCommon'
import { getUpgradePack, addUpgradePack, delUpgradePack } from '../api/upgradePack.api'
import { getProductsList } from '@/views/iot/equipment/api/products.api'
import SelectProduct from '@/components/iot/YtSelect/select-product.vue'
import DevicesUpgraders from './modules/devicesUpgrades.vue'
import HistoryDialog from './modules/history.vue'

const column = ref<IColumn[]>([
  {
    label: '名称',
    key: 'name',
    rules: [{
      required: true, message: '请输入名称',
    }]
  },
  {
    label: '升级包',
    key: 'url',
    type: 'upload',
    formSlot: true,
    hide: true,
    rules: [{
      required: true, message: '请上传升级包',
    }]
  },
  {
    label: '绑定产品',
    key: 'productKey',
    formSlot: true,
    type: 'select',
    componentProps: {
      labelAlias: 'name',
      valueAlias: 'productKey',
      options: [],
    },
    rules: [{
      required: true, message: '请绑定产品',
    }]
  },
  {
    label: '是否分包',
    key: 'isDiff',
    type: 'switch',
    componentProps: {
      defaultValue: false,
    }
  },
  {
    label: '签名方式',
    key: 'signMethod',
    type: 'select',
    componentProps: {
      defaultValue: 'md5',
      options: [{
        label: 'md5',
        value: 'md5',
      }]
    },
    rules: [{
      required: true, message: '请选择签名方式',
    }]
  },
  {
    label: '签名',
    key: 'sign',
    rules: [{
      required: true, message: '请输入签名',
    }]
  },
  {
    label: '版本',
    key: 'version',
    rules: [{
      required: true, message: '请输入版本',
    }]
  },
  {
    label: '模块',
    key: 'module',
    rules: [{
      required: true, message: '请输入模块',
    }]
  },
  {
    label: '包大小(KB)',
    key: 'size',
  },
  {
    label: '描述',
    key: 'desc',
    hide: true,
    componentProps: {
      type: 'textarea',
      rows: 4,
    }
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
  query: {},
})
const uploadSuccess = (row, list) => {
  console.log(row, list)
  if (list?.length > 0) {
    row.size = parseInt((list[0].size / 1024).toString())
  }
}
const onSave = ({ type, data, cancel }: any) => {
  addUpgradePack(toRaw(data)).then(res => {
    ElMessage.success('新增成功')
    cancel()
    getData()
  })
}
const getData = () => {
  state.loading = true
  getUpgradePack({
    ...state.page,
    ...state.query,
  }).then((res) => {
    data.value = res.data.rows
    state.total = res.data.total
  })
  state.loading = false
}
const onDelete = (row) => {
  state.loading = true
  delUpgradePack(row.id).then(res => {
    ElMessage.success('删除成功!')
    getData()
  }).finally(() => {
    state.loading = false
  })
}
const productOptions = ref<any[]>([])
const getDict = () => {
  getProductsList({
    pageNum: 1,
    pageSize: 99999,
  }).then(res => {
    productOptions.value = res.data.rows || []
    column.value.forEach(item => {
      if (item.key === 'productKey') {
        item.componentProps.options = productOptions.value
      }
    })
  })
}
getDict()
const getProductName = (key: string) => {
  return productOptions.value.find(f => f.productKey === key)?.name || ''
}
// 设备升级
const devicesUpgradersRef = ref()
const handleUpgrades = (row) => {
  devicesUpgradersRef.value.openDialog(row)
}
// 升级历史
const historyRef = ref()
const handleHistory = (row) => {
  historyRef.value.openDialog(row.id)
}
</script>
