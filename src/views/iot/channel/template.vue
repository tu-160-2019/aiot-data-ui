<template>
  <yt-crud
    ref="crudRef"
    :data="data"
    :column="column"
    v-model:page="state.page"
    v-model:query="state.query"
    :total="state.total"
    :loading="state.loading"
    :table-props="{
        selection: false,
      }"
    @onLoad="getData"
    @saveFun="onSave"
    @delFun="onDelete"
  />
</template>

<script lang="ts" setup>
import { IColumn } from '@/components/iot/common/types/tableCommon'

import YtCrud from '@/components/iot/common/yt-crud.vue'
import { getTemplatesList, saveTemplate, deleteTemplate, IChannelTemplateVo } from './api/templates.api'
import { getConfigAll } from './api/configs.api'

const data = ref<IChannelTemplateVo[]>([])
const column = ref<IColumn[]>([
  {
    label: '模板名称',
    key: 'title',
    tableWidth: 200,
    rules: [{ required: true, message: '模板名称不能为空' }],
  },
  {
    label: '通道配置',
    key: 'channelConfigId',
    tableWidth: 150,
    type: 'select',
    componentProps: {
      labelAlias: 'title',
      valueAlias: 'id',
    },
  },
  {
    label: '模板内容',
    key: 'content',
    componentProps: {
      type: 'textarea',
      rows: 4,
    },
  },
])

const state = reactive({
  total: 0,
  page: {
    pageSize: 10,
    pageNum: 1,
  },
  query: {},
  loading: false,
})
const getData = () => {
  state.loading = true
  getTemplatesList({
    ...state.page,
    ...state.query,
  })
    .then((res) => {
      data.value = res.data.rows || []
      state.total = res.data.total
    })
    .finally(() => {
      state.loading = false
    })
}
// 保存数据
const onSave = ({ type, data, cancel }: any) => {
  state.loading = true
  saveTemplate(toRaw(data))
    .then((res) => {
      ElMessage.success(type === 'add' ? '添加成功' : '编辑成功')
      cancel()
      getData()
    })
    .finally(() => {
      state.loading = false
    })
}
// 获取通道配置
const getConfig = () => {
  getConfigAll().then((res) => {
    const configOptions = res.data || []
    column.value.forEach((item) => {
      if (item.key === 'channelConfigId') {
        item.componentProps.options = configOptions
      }
    })
  })
}
getConfig()
// 删除
const onDelete = async (row: any) => {
  state.loading = true
  await deleteTemplate(row.id)
  ElMessage.success('删除成功!')
  state.loading = false
  getData()
}
</script>
