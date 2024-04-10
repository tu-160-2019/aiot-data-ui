<template>
  <yt-crud
  v-bind="options"
  ref="crudRef" :data="data" :column="column"
  :loading="state.loading"
  :total="state.total"
  v-model:page="state.page"
  v-model:query="state.query"
  :tableProps=" {
    selection: false,
    viewBtn: false,
    delBtn: true,
    menuSlot: true,
    menuWidth: 300,
  }"
  :fun-props="{
    delBtn: false,
  }"
  @on-load="getData"
  @delFun="onDelete"
  @saveFun="onSave"
  >
    <template #rightToolbar>
      <el-col :span="12" style="margin-right: 5px">
        <el-button plain @click="handleImport">
          <svg-icon-iot icon-class="upload" />
          <span style="color: rgb(0, 112, 255);">导入分组</span>
        </el-button>
      </el-col>
      <el-col :span="12">
        <el-button plain @click="handleDownloadTemplate">
          <svg-icon-iot icon-class="download" />
          <span style="color: rgb(0, 112, 255);">下载模板</span>
        </el-button>
      </el-col>
    </template>
    <template #menuSlot="scope">
      <el-tooltip class="box-item" effect="dark" content="查看分组设备" placement="top">
        <el-button link type="primary" icon="cpu" @click="handleToDevices(scope.row.id)" />
      </el-tooltip>
    </template>
  </yt-crud>

   <!-- 添加文件上传 -->
   <el-dialog
      :title="fileUploadDialog.title"
      v-model="fileUploadDialog.visible"
      width="500px"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      append-to-body
      destroy-on-close
    >
      <el-form v-if="fileUploadDialog.visible" ref="ossFormRef" label-width="80px">
        <el-form-item label="文件名">
          <fileUpload :fileSize="10" :fileType="['xlsx']" :limit="1" uploadType="url"
          uploadUrl="/device/group/importData" @upload-success="handleUploadSuccess"/>
        </el-form-item>
      </el-form>
    </el-dialog>

</template>
<script lang="ts" setup>
import { IColumn } from '@/components/iot/common/types/tableCommon'
import YtCrud from '@/components/iot/common/yt-crud.vue'
import download from '@/utils/iot/request'

import { getDeviceGroupsList, saveDeviceGroup, deleteDeviceGroup, IDeviceGroupVo } from '../api/devices.api'
// import { ComponentInternalInstance } from 'vue'
// const { proxy } = getCurrentInstance() as ComponentInternalInstance

const column: IColumn[] = [{
  label: '分组id',
  key: 'id',
  rules: [{ required: true, message: '请填写组ID' }],
}, {
  label: '分组名',
  key: 'name',
  search: true,
  rules: [{ required: true, message: '请填写组名' }],
},
{
  label: '设备数量',
  key: 'deviceQty',
},
{
  label: '备注',
  key: 'remark',
}]

const state = reactive({
  page: {
    pageSize: 10,
    pageNum: 1,
  },
  total: 0,
  loading: false,
  query: {
    name: ''
  },
})

const data = ref()

const fileUploadDialog = ref({
  title: '导入分组数据',
  visible: false
})

const handleUploadSuccess = (res) => {
  if (res.code == 200) {
    ElMessage.success(res.message)
    getData()
  }
  fileUploadDialog.value.visible = false
}

const getData = () => {
  state.loading = true
  getDeviceGroupsList({...state.page, ...state.query}).then(res => {
    console.log(res)
    data.value = res.data.rows
    state.total = res.data.total
  }).finally(() => {
    state.loading = false
  })
}

// 保存数据
const onSave = ({type, data, cancel}: any) => {
  state.loading = true
  saveDeviceGroup(toRaw(data)).then(res => {
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
  await deleteDeviceGroup(ids)
  ElMessage.success('删除成功!')
  state.loading = false
  getData()
}

// 跳转配置
const router = useRouter()
const handleToDevices = (id: string) => {
  if (!id) return
  router.push(`/deviceGroupDetail/${id}`)
}

const handleDownloadTemplate = () => {
  // proxy?.download('device/group/exportData', {}, `device_group_template_${new Date().getTime()}.xlsx`)
  download('/iot/device/group/exportData', {}, `device_group_template_${new Date().getTime()}.xlsx`)
}

const handleImport = () => {
  fileUploadDialog.value.visible = true
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

<!-- <style lang="scss" scoped>

</style> -->
