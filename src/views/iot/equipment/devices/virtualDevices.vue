<template>
  <div>
    <yt-crud
      v-bind="options"
      ref="crudRef"
      :loading="state.loading"
      :total="state.total"
      v-model:page="state.page"
      v-model:query="state.query"
      @on-load="getData"
      @delFun="onDelete"
      @saveFun="onSave"
    >
      <template #menuSlot="scope">
        <el-tooltip class="box-item" effect="dark" content="配置" placement="top">
          <el-button link type="primary" icon="Setting" @click="handleConfig(scope.row.id)" />
        </el-tooltip>
      </template>
      <template #state="scope">
        <el-tag class="state" v-if="scope.row.state === 'running'" type="success" size="small" @click="setState(scope.row.id, 'stopped')">运行中</el-tag>
        <el-tag class="state" v-else-if="scope.row.state === 'stopped'" type="danger" size="small" @click="setState(scope.row.id, 'running')">已停止</el-tag>
      </template>
      <template #triggerExpression1FormItem="{column, row}">
        <el-form-item v-if="row.trigger === 'cron'" :label="column.label" :prop="column.key">
          <crontab-box v-model="row[column.key]" />
        </el-form-item>
      </template>
      <template #triggerExpression2FormItem="{column, row}">
        <el-form-item v-if="row.trigger === 'random'" :label="column.label" :prop="column.key">
          <el-radio-group v-model="row[column.key]">
            <el-radio-button label="second">秒</el-radio-button>
            <el-radio-button label="minute">分</el-radio-button>
            <el-radio-button label="hour">时</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </template>
    </yt-crud>
  </div>
</template>

<script lang="ts" setup>
import { IColumn } from '@/components/iot/common/types/tableCommon'
import { deleteVirtualDevices, batchDeleteVirtualDevices, getVirtualDevicesList, saveVirtualDevices, setVirtualDeviceState } from '../api/virtualDevices.api'
import { getProductsList, IProductsVO } from '../api/products.api'

import CrontabBox from '@/components/iot/Crontab/index.vue'
import YtCrud from '@/components/iot/common/yt-crud.vue'

// 跳转配置
const router = useRouter()
const handleConfig = (id: string) => {
  if (!id) return
  router.push(`/virtualDeviceConfig/${id}`)
}

// 产品字典
const productOptions = ref<IProductsVO[]>([])
const column = ref<IColumn[]>([{
  label: '名称',
  key: 'name',
  rules: [{ required: true, message: '名称不能为空' }],
}, {
  label: '所属产品',
  key: 'productKey',
  type: 'select',
  search: true,
  tableWidth: 120,
  componentProps: {
    labelAlias: 'name',
    valueAlias: 'productKey',
    options: productOptions,
  },
  rules: [{ required: true, message: '产品名称不能为空' }],
}, {
  label: '类型',
  key: 'type',
  type: 'radioButton',
  componentProps: {
    defaultValue: 'thingModel',
    options: [
      {
        value: 'thingModel',
        label: '基于物模型',
      }, {
        value: 'protocol',
        label: '基于设备协议',
      }
    ]
  }
}, {
  label: '触发方式',
  key: 'trigger',
  type: 'radioButton',
  tableWidth: 120,
  componentProps: {
    defaultValue: 'none',
    options: [
      {
        value: 'none',
        label: '无（手动）',
      }, {
        value: 'cron',
        label: '定时执行',
      }, {
        value: 'random',
        label: '随机执行',
      }
    ]
  }
}, {
  label: '状态',
  key: 'state',
  type: 'select',
  search: true,
  formHide: true,
  tableWidth: 80,
  slot: true,
  componentProps: {
    defaultValue: '',
    options: [
      {
        value: 'running',
        label: '运行中',
      }, {
        value: 'stopped',
        label: '已停止',
      }
    ]
  }
}, {
  label: 'cron表达式',
  key: 'triggerExpression1',
  type: 'cron',
  formItemSlot: true,
  hide: true,
}, {
  label: '随机单位',
  key: 'triggerExpression2',
  type: 'radioButton',
  hide: true,
  formItemSlot: true,
}, {
  label: '创建时间',
  key: 'createAt',
  type: 'date',
  sortable: true,
  formHide: true,
}])
const state = reactive({
  page: {
    pageSize: 10,
    pageNum: 1,
  },
  total: 0,
  loading: false,
  query: {},
})
const data = ref()
const getData = () => {
  state.loading = true
  getVirtualDevicesList({
    ...state.page, ...state.query
  }).then((res) => {
    // 循环res.data.rows, 通过判断row.trigger来判断是否显示triggerExpression1FormItem和triggerExpression2FormItem
    res.data.rows.forEach((item: any) => {
      if (item.trigger === 'cron') {
        item.triggerExpression1 = item.triggerExpression
      } else if (item.trigger === 'random') {
        item.triggerExpression2 = item.triggerExpression
      }
    })
    data.value = res.data.rows
    state.total = res.data.total
  })
  state.loading = false
}
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
// 保存数据
const onSave = ({type, data, cancel}: any) => {
  state.loading = true
  // 将data中的triggerExpression1和triggerExpression2转换成triggerExpression
  data.triggerExpression = data.triggerExpression1 || data.triggerExpression2
  // 删除data中的triggerExpression1和triggerExpression2
  delete data.triggerExpression1
  delete data.triggerExpression2

  saveVirtualDevices(toRaw(data)).then(res => {
    ElMessage.success(type === 'add' ? '添加成功' : '编辑成功')
    cancel()
    getData()
  }).finally(() => {
    state.loading = false
  })
}
// 删除
const onDelete = async (row: any) => {
  state.loading = true
  let ids = row.id
  let fun = deleteVirtualDevices
  if (row instanceof Array) {
    ids = row.map(m => m.id)
    fun = batchDeleteVirtualDevices
  }
  await fun(ids)
  ElMessage.success('删除成功!')
  state.loading = false
  getData()
}

const setState = (id, state) => {
  setVirtualDeviceState({id: id, state: state}).then(() => {
    ElMessage.success('设置成功!')
    getData()
  })
}


const options = reactive({
  ref: 'crudRef',
  tableProps: {
    selection: true,
    delBtn: true,
    menuSlot: true,
    menuWidth: 220,
  },
  funProps: {
    delBtn: true,
  },
  searchProps: {
    labelWidth: 120,
  },
  data,
  column,
})
</script>


<style lang="scss" scoped>
.state {
  cursor: pointer;
}
</style>
