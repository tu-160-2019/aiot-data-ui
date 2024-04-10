<template>
  <div>
    <yt-crud
      ref="crudRef"
      :data="data"
      :table-props="{
        delBtn: false,
        menuSlot: true,
        menuWidth: 270,
        selection: false,
      }"
      :form-props="{
        width: 800,
      }"
      :loading="state.loading"
      :total="state.total"
      v-model:page="state.page"
      v-model:query="state.query"
      @on-load="getData"
      @saveFun="onSave"
      :column="column"
    >
      <template #state="scope">
        <el-switch
          v-model="scope.row.state"
          active-value="running"
          inactive-value="stopped"
          disabled
          style="--el-switch-on-color: #029D40; --el-switch-off-color: #DFDFDF"
        />
      </template>
      <template #log="scope">
        <el-button size="small" type="primary" @click="handleViewLog(scope.row.id)">查看</el-button>
      </template>
      <template #menuSlot="scope">
        <el-popconfirm title="确认要删除？" @confirm="handleDelete(scope.row)" class="mg-left-10">
          <template #reference>
            <el-tooltip class="box-item" effect="dark" content="删除" placement="top">
              <el-button :disabled="scope.row.state != 'running'" link type="danger" icon="Delete" />
            </el-tooltip>
          </template>
        </el-popconfirm>
        <el-divider direction="vertical" />
        <el-tooltip v-if="scope.row.state === 'running'" class="box-item" effect="dark" content="停止" placement="top">
          <el-button link type="danger" icon="Close" @click="handleStop(scope.row)" />
        </el-tooltip>
        <el-tooltip v-else-if="scope.row.state === 'stopped'" class="box-item" effect="dark" content="开启" placement="top">
          <el-button link type="success" icon="Open" @click="handleOpen(scope.row)" />
        </el-tooltip>
        <el-tooltip v-else-if="scope.row.state === 'finished'" class="box-item" effect="dark" content="重新启动" placement="top">
          <el-button link type="success" icon="Refresh" @click="handleReload(scope.row)" />
        </el-tooltip>
      </template>
      <template #expressionFormItem="{column, row}">
        <el-form-item v-if="row.type === 'timer'" :label="column.label" :prop="column.key">
          <crontab-box v-model:value="row.expression" />
        </el-form-item>
      </template>
      <template #secondsFormItem="{column, row}">
        <el-form-item v-if="row.type === 'delay'" :label="column.label" :prop="column.key">
          <el-input
            :onkeyup="row.seconds"
            :min="0"
            type="number"
            v-model="row.seconds"
            :precision="0"
            auto-complete="off"
            @input="secondsInput($event, row)"
          >
            <template #append>{{ row.secondsDesc }}</template>
          </el-input>
        </el-form-item>
      </template>
      <template #actionForm="{ row }">
        <optput style="width: 100%;" v-model:list="row.actions" actions="device" />
      </template>
    </yt-crud>
    <log-dialog ref="logDialogRef" type="task" />
  </div>
</template>

<script lang="ts" setup>
import { IColumn } from '@/components/iot/common/types/tableCommon'
import { getTaskList, saveTask, stopTask, reloadTask, startTask, deleteTask } from '../api/scheduledTask.api'

import CrontabBox from '@/components/iot/Crontab/index.vue'
import LogDialog from '../modules/logDialog.vue'
import YtCrud from '@/components/iot/common/yt-crud.vue'
import optput from '../ruleSys/modules/output.vue'

// 查看日志
const logDialogRef = ref()
const handleViewLog = (id: string) => {
  logDialogRef.value.openDialog(id)
}

const column: IColumn[] = [
  {
    label: '任务名称',
    key: 'name',
    rules: [{ required: true, message: '任务名称不能为空' }],
  },
  {
    label: '状态',
    key: 'state',
    slot: true,
    formHide: true,
  },
  {
    label: '任务类型',
    key: 'type',
    type: 'radio',
    componentProps: {
      defaultValue: 'timer',
      options: [
        {
          label: '定时执行',
          value: 'timer',
        },
        {
          label: '延时执行',
          value: 'delay',
        },
      ],
    },
    rules: [{ required: true, message: '任务类型不能为空' }],
  },
  {
    label: 'cron表达式',
    key: 'expression',
    type: 'cron',
    formItemSlot: true,
    hide: true,
  },
  {
    label: '延时时间(秒)',
    key: 'seconds',
    type: 'radioButton',
    hide: true,
    formItemSlot: true,
  },
  {
    label: '执行动作',
    key: 'action',
    hide: true,
    formSlot: true,
  },
  {
    label: '执行日志',
    key: 'log',
    slot: true,
    formHide: true,
  },
  {
    label: '任务描述',
    key: 'desc',
    hide: true,
    componentProps: {
      type: 'textarea',
      row: 3,
    },
  },
  {
    label: '自定义表单项',
    key: 'custom',
    hide: true,
    formItemSlot: true,
  },
]

const data = ref()

const secondsInput = (val: string, row) => {
  let param = ''
  let val2: number = parseInt(val.replace(/[^\d].*/g, ''))
  if (!val2) {
    row.seconds = val2
    return
  }

  if (val2 < 60) {
    param = val2 + '秒'
  } else if (val2 < 3600) {
    param = parseInt((val2 / 60).toString()) + '分' + (val2 % 60) + '秒'
  } else {
    param = parseInt((val2 / 3600).toString()) + '时' + parseInt(((val2 % 3600) / 60).toString()) + '分' + (val2 % 60) + '秒'
  }
  row.seconds = val2
  row.secondsDesc = param
}

const handleDelete = (row) => {
  state.loading = true
  deleteTask(row.id)
    .then(() => {
      ElMessage.success('删除成功!')
      getData()
    })
    .finally(() => {
      state.loading = false
    })
}

const state = reactive({
  page: {
    pageSize: 10,
    pageNum: 1,
  },
  total: 0,
  loading: false,
  query: {},
})
// 保存数据
const onSave = ({ type, data, cancel }: any) => {
  console.log('onSave')
  state.loading = true

  let actions: any = []
  data.actions.forEach((e) => {
    actions.push({
      type: e.type,
      config: JSON.stringify(e),
    })
  })

  saveTask({
    ...toRaw(data),
    actions: toRaw(data).actions.map((m) => ({
      config: JSON.stringify(m),
      type: m.type,
    })),
  })
  .then(() => {
    ElMessage.success(type === 'add' ? '添加成功' : '编辑成功')
    cancel()
    getData()
  })
  .finally(() => {
    state.loading = false
  })
}
// 重启
const handleReload = (row) => {
  state.loading = true
  reloadTask(row.id)
    .then((res) => {
      if (res.data) {
        getData()
        ElMessage.success('重启成功')
        return
      }
      ElMessage.error(res.message)
    })
    .finally(() => {
      state.loading = false
    })
}
// 打开
const handleOpen = (row) => {
  state.loading = true
  startTask(row.id)
    .then((res) => {
      if (res.data) {
        getData()
        ElMessage.success('开启成功')
        return
      }
      ElMessage.error(res.message)
    })
    .finally(() => {
      state.loading = false
    })
}
// 停止
const handleStop = (row) => {
  state.loading = true
  stopTask(row.id)
    .then((res) => {
      if (res.data) {
        ElMessage.success('停止成功')
        getData()
        return
      }
      ElMessage.error(res.message)
    })
    .finally(() => {
      state.loading = false
    })
}
const getData = () => {
  state.loading = true
  getTaskList({
    ...state.page,
  }).then((res) => {
    data.value = res.data.rows
    state.total = res.data.total
  })
  state.loading = false
}
</script>
