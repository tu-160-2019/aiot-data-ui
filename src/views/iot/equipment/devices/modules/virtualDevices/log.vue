<template>
  <el-table
    size="small"
    :data="logs"
    highlight-current-row
  >
    <el-table-column sortable label="时间" prop="logAt">
      <template #default="scope">
        <div>{{ dayjs(scope.row.logAt).format('YYYY-MM-DD HH:mm:ss') }}</div>
      </template>
    </el-table-column>

    <el-table-column sortable label="结果" prop="result"></el-table-column>
  </el-table>
  <Pagination :total="state.total" :limit="state.page.pageSize" :page="state.page.pageNum" @pagination="getPageEvents"/>
</template>

<script lang="ts" setup>
import { getVirtualDevicesLogs } from '../../../api/virtualDevices.api'
import dayjs from 'dayjs'

const route = useRoute()
const { id } = route.params

const logs = ref()

const state = reactive({
  total: 0,
  page: {
    pageSize: 10,
    pageNum: 1,
  },
})

const getLogs = () => {
  getVirtualDevicesLogs({deviceId: id, ...state.page}).then((res) => {
    logs.value = res.data.rows
    state.total = res.data.total
  })
}
defineExpose({ getLogs })

getLogs()

const getPageEvents = (e) => {
  state.page.pageSize = e.limit
  state.page.pageNum = e.page
  getLogs()
}

</script>
