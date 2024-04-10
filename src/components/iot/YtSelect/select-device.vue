<template>
  <el-input class="cu-input" :placeholder="placeholder" size="small" v-model.trim="name" @clear="onClear" clearable @click="handleSelect">
    <template #append>
      <el-button type="primary" @click="handleSelect">选择</el-button>
    </template>
  </el-input>
  <el-dialog
    title="选择设备"
    v-model="dialogState.show"
    width="1200px"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    append-to-body
    destroy-on-close
  >
    <yt-crud
      v-if="dialogState.show"
      ref="crudRef"
      :data="data"
      :column="column"
      :table-props="{
        menu: false,
        selection: multiple,
      }"
      :fun-props="{
        hide: true
      }"
      :loading="state.loading"
      :total="state.total"
      v-model:page="state.page"
      v-model:query="state.query"
      @row-click="rowClick"
      @on-load="getData"
    >
      <template #online="scope">
        <el-tag v-if="scope.row.online" type="success" size="small">在线</el-tag>
        <el-tag v-else type="danger" size="small">离线</el-tag>
      </template>
    </yt-crud>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogState.show = false">取消</el-button>
        <el-button type="primary" @click="handleMultiple">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { propTypes } from '@/utils/iot/propTypes'
import { IColumn } from '../common/types/tableCommon'
import { getDevicesList } from '@/views/iot/equipment/api/devices.api'
import { getProductsList } from '@/views/iot/equipment/api/products.api'

import YtCrud from '@/components/iot/common/yt-crud.vue'

const props = defineProps({
  id: propTypes.string.def(''),
  dn: propTypes.string.def(''),
  // TODO:调接口时有产品id就传入
  // 固定产品key
  productPk: propTypes.string.def(''),
  // 是否多选
  multiple: propTypes.bool.def(false),
  placeholder: propTypes.string.def('请选择设备'),
})
const emits = defineEmits(['onSelect', 'update:id', 'update:dn'])

const state = reactive({
  page: {
    pageSize: 10,
    pageNum: 1,
  },
  total: 0,
  loading: false,
  query: {},
})
// 单击
const crudRef = ref()

const rowClick = (row: any) => {
  if (props.multiple) {
    crudRef.value.getTableRef().tableRef.toggleRowSelection(toRaw(row), undefined)
    return
  }
  emits('update:id', row.id)
  emits('update:dn', row.deviceName)
  emits('onSelect', row)
  dialogState.data = row
  dialogState.show = false
  console.log(row)
}
// 多选
const handleMultiple = () => {
  const rows = crudRef.value.getTableRef().tableRef.getSelectionRows()
  dialogState.data = {
    id: rows.map((m: any) => m.id),
    deviceName: rows.map((m: any) => m.deviceName).join(','),
  }
  emits('update:id', dialogState.data.id)
  dialogState.show = false
}

// 清空
const onClear = () => {
  emits('update:id', '')
  dialogState.data = {}
}
const dialogState = reactive({
  show: false,
  data: {} as any,
})
const name = computed(() => {
  return dialogState.data?.deviceName || props.id || props.dn || ''
})
const handleSelect = () => {
  console.log('handleSelect')
  dialogState.show = true
}
// 产品字典
const productOptions = ref<any[]>([])
const getDict = () => {
  getProductsList({
    pageNum: 1,
    pageSize: 10000000,
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
// 组列表
const groupOptions = [
  {
    id: 'g3',
    name: '组3',
    uid: 'fa1c5eaa-de6e-48b6-805e-8f091c7bb831',
    remark: '2223333',
    deviceQty: 17,
    createAt: 1659872082792,
  },
  {
    id: 'g2',
    name: '组2',
    uid: 'fa1c5eaa-de6e-48b6-805e-8f091c7bb831',
    remark: '222',
    deviceQty: 21,
    createAt: 1659872082803,
  },
  {
    id: 'g1',
    name: '分组1',
    uid: 'fa1c5eaa-de6e-48b6-805e-8f091c7bb831',
    remark: '1111',
    deviceQty: 10,
    createAt: 1659872082805,
  },
]
const column = ref<IColumn[]>([
  {
    label: '产品',
    key: 'productKey',
    type: 'select',
    search: !props.productPk,
    componentProps: {
      labelAlias: 'name',
      valueAlias: 'productKey',
      options: productOptions.value,
    },
    rules: [{ required: true, message: '产品名称不能为空' }],
  },
  {
    label: '设备DN',
    key: 'deviceName',
    componentProps: {
      placeholder: '一般为设备mac',
    },
    rules: [{ required: true, message: '设备DN不能为空' }],
  },
  //   {
  //   label: '分组',
  //   key: 'group',
  //   type: 'select',
  //   search: true,
  //   componentProps: {
  //     labelAlias: 'name',
  //     valueAlias: 'id',
  //     options: groupOptions,
  //   },
  // },
  {
    label: '状态',
    key: 'online',
    type: 'select',
    search: true,
    formHide: true,
    slot: true,
    componentProps: {
      labelAlias: 'name',
      valueAlias: 'value',
      options: [
        {
          name: '在线',
          value: true,
        },
        {
          name: '离线',
          value: false,
        },
      ],
    },
  },
  {
    label: '关键字',
    key: 'keyword',
    search: true,
    hide: true,
    formHide: true,
  },
  {
    label: '创建时间',
    key: 'createAt',
    tableWidth: 180,
    type: 'date',
    sortable: true,
    formHide: true,
  },
])
const data = ref([])

const getData = () => {
  state.loading = true
  getDevicesList({
    ...state.query,
    productKey: props.productPk || state.query['productKey'],
    ...state.page,
  }).then((res) => {
    data.value = res.data.rows || []
    state.total = res.data.total
  })
  state.loading = false
}
</script>

<style lang="scss" scoped>
.cu-input {
  cursor: pointer;
}
::v-deep(.el-input-group__append) {
  background-color: var(--el-color-primary);
  color: #fff;
}
</style>
