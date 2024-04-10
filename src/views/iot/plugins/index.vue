<template>
  <div>
    <yt-table-fun @handle-add="handleAdd()">
      <el-row :gutter="16" v-loading="loading">
        <el-col :span="6" :sm="8" :xs="24" v-for="com in data" :key="com.id" style="margin: 10px 0">
          <el-card>
            <template #header>
              <div class="clearfix">
                <b>{{ com.name }}</b>
                <div style="float: right">
                  <el-popconfirm title="确认要删除吗？" @confirm="handleDelete(com)">
                    <template #reference>
                      <div>
                        <el-button icon="Delete" link type="danger" />
                      </div>
                    </template>
                  </el-popconfirm>
                </div>
              </div>
            </template>
            <el-descriptions :column="1" size="default" :labelStyle="{ fontWeight: 'bold' }">
              <el-descriptions-item label-class-name="custom-label" label="组件id">{{
                com.pluginId
              }}</el-descriptions-item>
              <el-descriptions-item label-class-name="custom-label" label="jar包" class-name="ov-text1">{{ com.file }}</el-descriptions-item>
              <el-descriptions-item label-class-name="custom-label" label="版本号">{{
                com.version
              }}</el-descriptions-item>
              <el-descriptions-item label-class-name="custom-label" label="部署方式">{{
                com.deployType=='upload'?'上传jar包':'独立运行'
              }}</el-descriptions-item>
              <el-descriptions-item label-class-name="custom-label" label="状态">
                <el-switch
                  v-model="com.state"
                  active-text="运行中"
                  inactive-text="已停止"
                  active-value="running"
                  inactive-value="stopped"
                  inline-prompt
                  size="large"
                  style="--el-switch-on-color: #029D40; --el-switch-off-color: #DFDFDF"
                  @change="stateChange(com)"
                />
              </el-descriptions-item>
              <el-descriptions-item label-class-name="custom-label" label="操作">
                <el-button @click="handleEdit(com)" link icon="Edit" type="primary">修改</el-button>
                <el-button @click="handleDetail(com.id)" link icon="setting" type="primary">详情</el-button>
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
      </el-row>
    </yt-table-fun>

    <yt-table-form ref="tableFormRef" :column="column" @onSuccess="handleSave" @openBeforeFun="openBeforeFun"> </yt-table-form>
  </div>
</template>
<script lang="ts" setup>
import { IColumn } from '@/components/iot/common/types/tableCommon'
import { getPluginList, deletePlugin, addPlugin, editPlugin, changeState } from './api/plugin.api'
import type { IPluginVO } from './api/plugin.api'
import YtTableFun from '@/components/iot/common/yt-table-fun.vue'
import YtTableForm from '@/components/iot/common/yt-table-form'

const tableFormRef = ref()
const handleAdd = () => {
  tableFormRef.value?.openDialog('add', {})
}
// 删除
const handleDelete = (row: any) => {
  loading.value = true
  deletePlugin(row.id)
    .then((res) => {
      if (res.code === 200) {
        ElMessage.success('删除成功')
        getData()
      } else {
        ElMessage.error(res.message)
      }
    })
    .finally(() => {
      loading.value = false
    })
}

// 编辑
const handleEdit = (row: any) => {
  tableFormRef.value?.openDialog('update', {
    ...toRaw(row),
  })
}

const router = useRouter()
const handleDetail = (id: number) => {
  if (!id) return
  router.push(`/pluginDetail/${id}`)
}

// 状态更改
const stateChange = (row: any) => {
  console.log(row)
  loading.value = true
  changeState({
    id: row.id,
    state: row.state,
  })
    .then((res) => {
      if (res.code === 200) {
        ElMessage.success('变更成功')
      } else {
        ElMessage.error(res.message)
      }
    })
    .finally(() => {
      getData()
      loading.value = false
    })
}
const formRule = reactive({
  name: [{ required: true, message: '请输入插件名称', trigger: 'blur' }],
})

const type = ref<any[]>([])
const column = ref<IColumn[]>([
  {
    label: '插件名称',
    key: 'name',
    rules: [{ required: true, message: '插件名称不能为空' }],
  },
  {
    label: '部署方式',
    type: 'select',
    key: 'deployType',
    rules: [{ required: true, message: '部署方式不能为空' }],
    componentProps: {
      defaultValue: 'upload',
      options: [
        {
          label: '上传jar',
          value: 'upload',
        },
      ],
    },
  },
])
const data = ref<IPluginVO[]>([])
// 弹窗前置操作
const openBeforeFun = ({ type, data }) => {
  if (type === 'add') {
    data.id = ''
  }
}
// 保存
const handleSave = ({ type, data, cancel }) => {
  loading.value = true
  let fun = addPlugin
  if (type === 'update') fun = editPlugin
  fun({
    ...toRaw(data),
  })
    .then(() => {
      ElMessage.success(type === 'add' ? '添加成功' : '编辑成功')
      cancel()
      getData()
    })
    .finally(() => {
      loading.value = false
    })
}
// 获取数据
const loading = ref(false)
const getData = () => {
  loading.value = true
  getPluginList()
    .then((res) => {
      data.value = res.data.rows || []
      console.log(data.value)
    })
    .finally(() => {
      loading.value = false
    })
}

getData()
</script>

<style lang="scss" scoped>
.cu-form {
  width: 100%;
  border: 1px solid #ddd;
  padding: 10px 10px;
  box-sizing: border-box;
  border-radius: 3px;
  ::v-deep(.el-form-item) {
    margin-bottom: 15px;
  }
}
::v-deep(.el-descriptions__cell) {
  display: flex;
  align-items: center;
}
::v-deep(.custom-label) {
  width: 60px;
  text-align: right;
}
::v-deep(.el-descriptions__body .el-descriptions__table:not(.is-bordered) .el-descriptions__cell) {
  padding-bottom: 6px;
}
::v-deep(.el-card__header) {
  padding: 16px !important;
}
</style>
