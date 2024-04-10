<template>
  <el-dialog
    ref="logDialogRef"
    width="70%"
    :title="type === 'rule' ? '场景执行日志' : '任务执行日志'"
    :loading="state.loading"
    :total="state.total"
    v-model:page="state.page"
    v-model:query="state.query"
    @on-load="getData"
    v-model="dialog"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    append-to-body
    destroy-on-close
  >
    <div v-if="dialog" class="mb10">
      <el-button type="primary" plain icon="Refresh" @click="getData">刷新</el-button>
      <ElPopconfirm :title="`是否确认删除该${type === 'rule' ? '规则' : '任务'}所有日志？`" @confirm="handleDelete">
        <template #reference>
          <el-button type="danger" plain icon="Delete" :disabled="false">{{ `删除该${type === 'rule' ? '规则' : '任务'}所有日志` }}</el-button>
        </template>
      </ElPopconfirm>
    </div>
    <yt-table v-if="dialog" :data="data" :total="state.total" :column="column" :menu="false" :selection="false">
      <template #state="scope">
        {{ getStateName(scope.row.state) }}
      </template>
      <template #success="scope">
        {{ scope.row.success ? "成功" : "失败" }}
      </template>
    </yt-table>
  </el-dialog>
</template>

<script lang="ts" setup>
import { propTypes } from '@/utils/iot/propTypes'
import { getRulesLog, clearRulesLog } from '../api/rule.api'
import { getTaskLog, clearTaskLog } from '../api/scheduledTask.api'

import ytTable from '@/components/iot/common/yt-table'
import { IColumn } from '@/components/iot/common/types/tableCommon'

const props = defineProps({
  type: propTypes.string.def('rule'),
  gutter: propTypes.number.def(12),
  span: propTypes.number.def(4),
})
const getStateName = (state: string) => {
  console.log(state)
  switch (state) {
    case 'matched_listener':
      return '匹配到监听器,过滤器执行失败'
    case 'matched_filter':
      return '过滤器执行通过,动作执行失败'
    case 'unmatched_filter':
      return '过滤器执行未通过'
    case 'executed_action':
      return '动作执行完成'
  }
  return ''
}
const state = reactive({
  page: {
    pageSize: 10,
    pageNum: 1,
  },
  total: 0,
  loading: false,
  query: {},
  id: '',
})
const data = ref([])
const column = ref<IColumn[]>([])
column.value = [
  ...column.value,
  {
    label: '执行结果',
    key: 'success',
    slot: true,
  },
  {
    label: '详细信息',
    key: 'content',
  },
  {
    label: '执行时间',
    key: 'logAt',
    type: 'date',
  },
]

const dialog = ref(false)
const logDialogRef = ref()
// 打开日志
const openDialog = (id: string) => {
  state.id = id
  getData()
  dialog.value = true
}
const getData = () => {
  state.loading = true
  const fun = props.type === 'rule' ? getRulesLog : getTaskLog
  fun({
    ...state.page,
    ...state.query,
    ruleId: state.id,
    taskId: state.id,
  })
    .then((res) => {
      state.total = res.data.total
      data.value = res.data.rows
    })
    .finally(() => {
      state.loading = false
    })
}

// 删除所有日志
const handleDelete = () => {
  state.loading = true
  const fun = props.type === 'rule' ? clearRulesLog : clearTaskLog
  fun(state.id)
    .then((res) => {
      ElMessage.success('删除成功')
      getData()
    })
    .finally(() => {
      state.loading = false
    })
  console.log(24234)
}
defineExpose({
  openDialog,
})
</script>
