<template>
  <yt-crud
    ref="crudRef"
    :data="data"
    :column="column"
    v-model:page="state.page"
    v-model:query="state.query"
    :total="state.total"
    :loading="state.loading"
    @onLoad="getData"
    :fun-props="{
        addBtn: false,
      }"
    :table-props="{
        editBtn: false,
        delBtn: false,
      }"
  >
    <template #status="{ row }">
      <el-switch v-model="row.status" disabled />
    </template>
  </yt-crud>
</template>

<script lang="ts" setup>
import { IColumn } from '@/components/iot/common/types/tableCommon'

import YtCrud from '@/components/iot/common/yt-crud.vue'
import { getMsgs,INotifyMessagesVO } from '../channel/api/configs.api'

const data = ref<INotifyMessagesVO[]>([])
const column: IColumn[] = [{
  label: '消息类型',
  key: 'messageType',
}, {
  label: '消息内容',
  key: 'content',
  type: 'string',
  componentProps: {
    type: 'textarea',
    rows: 4,
  }
}, {
  label: '状态',
  key: 'status',
  type: 'switch',
  slot: true,
}, {
  label: '发送日期',
  key: 'createAt',
  type: 'date',
}]
const state = reactive({
  total: 0,
  page: {
    pageSize: 10,
    pageNum: 1,
  },
  query: {},
  loading: false
})
const getData = () => {
  state.loading = true
  getMsgs({
    ...state.page,
    ...state.query,
  }).then(res => {
    data.value = res.data.rows || []
    state.total = res.data.total
  }).finally(() => {
    state.loading = false
  })
}
</script>

<!-- <style lang="scss" scoped>

</style> -->
