<template>
  <div>
    <yt-crud
      v-bind="options"
      ref="crudRef"
      :data="data"
      :column="column"
      :loading="state.loading"
      :total="state.total"
      v-model:page="state.page"
      v-model:query="state.query"
      @on-load="getData"
      @saveFun="onSave"
      @del-fun="handleDelete"
    >
      <template #state="scope">
        <el-switch
          v-model="scope.row.state"
          active-value="running"
          inactive-value="stopped"
          disabled
          style="--el-switch-on-color: #029D40; --el-switch-off-color: #DFDFDF"
        />
        <!-- <div v-if="scope.row.state === 'stopped'" style="color: red;">已停止</div>
        <div v-if="scope.row.state === 'running'" style="color: green;">运行中</div> -->
      </template>
      <template #log="scope">
        <el-button size="small" type="primary" @click="handleViewLog(scope.row.id)">查看</el-button>
      </template>
      <template #menuSlot="scope">
        <el-tooltip class="box-item" effect="dark" content="停止" placement="top">
          <el-button v-if="scope.row.state === 'running'" link type="danger" icon="SwitchButton" @click="handlePause(scope.row)" />
        </el-tooltip>
        <el-tooltip class="box-item" effect="dark" content="开启" placement="top">
          <el-button v-if="scope.row.state === 'stopped'" link type="success" icon="Open" @click="handleOpen(scope.row)" />
        </el-tooltip>
      </template>
      <template #customFormItem="{row}">
        <el-tabs v-model="activeName" type="border-card">
          <el-tab-pane label="监听器" :name="1">
            <listener v-if="activeName === 1" v-model:listeners="row.listeners" />
          </el-tab-pane>
          <el-tab-pane label="过滤器" :name="2">
            <filtera v-if="activeName === 2" v-model:filters="row.filters" />
          </el-tab-pane>
          <el-tab-pane label="输出" :name="3">
            <Output v-if="activeName === 3" v-model:list="row.actions" type="rule" actions="device,http,mqtt,kafka,tcp,alert" />
          </el-tab-pane>
        </el-tabs>
      </template>
    </yt-crud>
    <log-dialog ref="logDialogRef" title="场景执行日志" />
  </div>
</template>
<script lang="ts" setup>
import { IColumn } from '@/components/iot/common/types/tableCommon'
import { getRuleList, saveRule, deleteRule, pauseRule, resumeRule } from '../api/rule.api'

import Listener from './modules/listener.vue'
import Filtera from './modules/filtera.vue'
import Output from './modules/output.vue'
import LogDialog from '../modules/logDialog.vue'
import YtCrud from '@/components/iot/common/yt-crud.vue'

// 查看日志
const logDialogRef = ref()
const handleViewLog = (id: string) => {
  logDialogRef.value.openDialog(id)
}
const activeName = ref(1)
const column: IColumn[] = [
  {
    label: '规则名称',
    key: 'name',
    rules: [{ required: true, message: '规则名称不能为空' }],
  },
  {
    label: '状态',
    key: 'state',
    slot: true,
    formHide: true,
  },
  {
    label: '规则类型',
    key: 'type',
    type: 'select',
    search: true,
    componentProps: {
      defaultValue: 'scene',
      clearable: false,
      options: [
        {
          label: '场景联动',
          value: 'scene',
        },
        {
          label: '数据流转',
          value: 'flow',
        },
      ],
    },
  },
  {
    label: '执行日志',
    key: 'log',
    slot: true,
    formHide: true,
  },
  {
    label: '场景描述',
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
  {
    label: '创建时间',
    key: 'createAt',
    type: 'date',
    formHide: true,
  },
]
const state = reactive({
  page: {
    pageSize: 10,
    pageNum: 1,
  },
  total: 0,
  loading: false,
  query: {
    type: 'scene',
  },
})
const data = ref([])
// 保存数据
const onSave = ({ type, data, cancel }: any) => {
  state.loading = true
  const obj = toRaw(data)
  console.log('save:', obj)
  obj.listeners = (obj.listeners || [])?.map((m) => {
    const mObj = {
      type: m.type,
      pk: m.pk,
      dn: m.dn,
      conditions: m.conditions.map((m2) => ({
        ...m2,
        device: m.device,
      })),
    }
    return {
      ...mObj,
      config: JSON.stringify(mObj),
    }
  })
  obj.filters = (obj.filters || [])?.map((m) => {
    if (m.conditions == undefined && m.config) {
      m = JSON.parse(m.config)
    }
    const mObj = {
      type: 'device',
      pk: m.pk,
      dn: m.dn,
      conditions: m.conditions.map((m2) => ({
        ...m2,
        device: m.device,
      })),
      deviceRadio: m.deviceRadio,
    }
    return {
      ...mObj,
      config: JSON.stringify(mObj),
    }
  })
  obj.actions = (obj.actions || [])?.map((m) => {
    console.log('111111：', m)
    m.saved = true
    if (m.config) {
      return m
    }
    return {
      ...m,
      config: JSON.stringify(m),
    }
  })
  saveRule(obj)
    .then((res) => {
      ElMessage.success(type === 'add' ? '添加成功' : '编辑成功')
      cancel()
      getData()
    })
    .finally(() => {
      state.loading = false
    })
}
const getData = () => {
  state.loading = true
  getRuleList({
    ...state.page,
    ...state.query,
  }).then((res) => {
    data.value = res.data.rows
    state.total = res.data.total
  })
  state.loading = false
}
const handleDelete = (row) => {
  state.loading = true
  deleteRule(row.id)
    .then((res) => {
      ElMessage.success('删除成功!')
      getData()
    })
    .finally(() => {
      state.loading = false
    })
}
const handleOpen = (row) => {
  state.loading = true
  resumeRule(row.id)
    .then((res) => {
      ElMessage.success('开启成功!')
      getData()
    })
    .finally(() => {
      state.loading = false
    })
}
const handlePause = (row) => {
  state.loading = true
  pauseRule(row.id)
    .then((res) => {
      ElMessage.success('停止成功!')
      getData()
    })
    .finally(() => {
      state.loading = false
    })
}
const options = reactive({
  formProps: {
    width: 1000,
  },
  tableProps: {
    selection: false,
    viewBtn: false,
    menuSlot: true,
    menuWidth: 300,
  },
  searchProps: {},
})
</script>

<!-- <style lang="scss" scoped>

</style> -->
