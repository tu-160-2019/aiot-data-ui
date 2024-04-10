<template>
  <yt-crud
    ref="crudRef"
    :data="data"
    :column="column"
    :table-props="{
        selection: false,
      }"
    @save-fun="onSave"
    @del-fun="handleDelete"
    @onLoad="getData"
    :loading="state.loading"
    :total="state.total"
    v-model:page="state.page"
    v-model:query="state.query"
  />
</template>

<script lang="ts" setup>
import { IColumn } from '@/components/iot/common/types/tableCommon'
import { getConfigList, saveConfig, deleteConfig } from './api/alarm.api'
import { getRuleList } from '../ruleEngine/api/rule.api'
import YtCrud from '@/components/iot/common/yt-crud.vue'
import { getTemplatesList } from '../channel/api/templates.api'

const state = reactive({
  page: {
    pageSize: 10,
    pageNum: 1,
  },
  total: 0,
  loading: false,
  query: {},
})
const column = ref<IColumn[]>([
  {
    label: '配置名称',
    key: 'name',
    search: true,
    rules: [{ required: true, message: '配置名称不能为空' }],
  },
  {
    label: '告警等级',
    key: 'level',
    tableWidth: 120,
    search: true,
    type: 'select',
    rules: [{ required: true, message: '请选择告警等级' }],
    componentProps: {
      options: [
        {
          label: 1,
          value: 1,
        },
        {
          label: 2,
          value: 2,
        },
        {
          label: 3,
          value: 3,
        },
        {
          label: 4,
          value: 4,
        },
        {
          label: 5,
          value: 5,
        },
      ],
    },
  },
  {
    label: '消息模板',
    key: 'messageTemplateId',
    type: 'select',
    tableWidth: 120,
    componentProps: {
      labelAlias: 'title',
      valueAlias: 'id',
      options: [],
    },
  },
  {
    label: '规则',
    key: 'ruleInfoId',
    tableWidth: 120,
    type: 'select',
    componentProps: {
      labelAlias: 'name',
      valueAlias: 'id',
      options: [],
    },
  },
  {
    label: '是否启用',
    key: 'enable',
    tableWidth: 120,
    type: 'switch',
  },
  {
    label: '告警描述',
    key: 'description',
    hide: true,
    componentProps: {
      type: 'textarea',
      rows: 4,
    },
  },
])

const getDict = async () => {
  let options: any[] = []
  const res1 = await getRuleList({
    pageSize: 999999,
    pageNum: 1,
    type: 'scene',
  })
  const res2 = await getRuleList({
    pageSize: 999999,
    pageNum: 1,
    type: 'flow',
  })
  options = [...res1.data.rows, ...res2.data.rows]
  column.value.forEach((item) => {
    if (item.key === 'ruleInfoId') {
      item.componentProps.options = options
    }
  })

  getTemplatesList().then((res) => {
    column.value.forEach((item) => {
      if (item.key === 'messageTemplateId') {
        item.componentProps.options = res.data.rows
      }
    })
  })
}
getDict()
const getData = () => {
  state.loading = true
  getConfigList({
    ...state.page,
    ...state.query,
  })
    .then((res) => {
      data.value = res.data.rows
      state.total = res.data.total
    })
    .finally(() => {
      state.loading = false
    })
}
// 保存数据
const onSave = ({ type, data, cancel }: any) => {
  state.loading = true
  saveConfig(toRaw(data))
    .then((res) => {
      if (res.code === 200) {
        cancel()
        getData()
      }
    })
    .finally(() => {
      state.loading = false
    })
}
// 删除
const handleDelete = (row: any) => {
  state.loading = true
  deleteConfig(row.id)
    .then((res) => {
      if (res.code === 200) {
        ElMessage.success('删除成功!')
        getData()
      }
    })
    .finally(() => {
      state.loading = false
    })
}
const data = ref([])
</script>

<!-- <style lang="scss" scoped>

</style> -->
