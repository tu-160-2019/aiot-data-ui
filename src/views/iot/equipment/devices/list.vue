<template>
  <div>
    <yt-crud
      v-bind="options"
      ref="crudRef"
      @onLoad="getData"
      :fun-props="{
        exportBtn: true,
        delBtn: layoutType !== 'card',
      }"
      :table-props="{
        selection: true,
        delBtn: false,
        viewBtn: false,
        editBtn: true,
        customTable: layoutType === 'card',
        menuSlot: true,
        menuWidth: 300,
      }"
      :loading="state.loading"
      :total="state.total"
      v-model:page="state.page"
      v-model:query="state.query"
      @delFun="handleDelete"
      @saveFun="onSave"
      @openBeforeFun="openBeforeFun"
      @change="onChange"
    >

      <template #rightToolbar>

        <el-col :span="12" style="margin-right: 15px;display: flex;">
          <el-button plain @click="handleImport">
            <svg-icon-iot icon-class="upload" />
            <span style="color: rgb(0, 112, 255);">导入设备</span>
          </el-button>

          <el-button plain @click="handleDownloadTemplate">
            <svg-icon-iot icon-class="download" />
            <span style="color: rgb(0, 112, 255);">下载模板</span>
          </el-button>
        </el-col>

        <el-button type="primary" class="addDeviceToGroup" :disabled="multipleSelection.length === 0" @click="handleToGroup">添加设备到组</el-button>

        <el-radio-group v-model="layoutType">
          <el-radio-button label="table">
            <svg-icon-iot icon-class="table2" />
          </el-radio-button>
          <el-radio-button label="card">
            <svg-icon-iot icon-class="card" />
          </el-radio-button>
        </el-radio-group>
      </template>
      <template #customTable>
        <el-row class="card-list flex">
          <el-col class="card-item" v-for="(item, index) in data" :key="index" :class="item.online ? 'success-box' : 'error-box'">
            <div class="text-box">
              <div class="title flex align-center">
                <div class="title-l">
                  <div class="icon">
                    <svg-icon-iot icon-class="card2" />
                  </div>
                  {{ item.deviceName }}
                </div>
                <div class="title-r">
                  <status-tag :type="item.online ? 'success' : 'danger'" :text="item.online ? '在线' : '离线'" />
                </div>
              </div>
              <div class="text flex">
                <div class="txt">
                  <div class="txt-item">
                    <div class="label">所属产品</div>
                    <div class="value active">{{ getProductName(item.product) }}</div>
                  </div>
                  <div class="txt-item">
                    <div class="label">设备类型</div>
                    <div class="value">{{ getNodeTypeName(item.product) }}</div>
                  </div>
                  <div class="txt-item">
                    <div class="copy-tag" v-copyText="item.deviceId" v-copyText:callback="copyIdSuccess">
                      <svg-icon-iot icon-class="copy" />
                      设备ID
                    </div>
                  </div>
                </div>
                <div class="img">
                  <img :src="defaultImg" alt="" />
                </div>
              </div>
            </div>
            <div class="btn-group">
              <el-button v-if="item.parentId ==null" class="cu-btn" type="success" icon="Box" plain @click="showChidrenDevices(item)"
                >子设备</el-button
              >
              <el-button class="cu-btn" type="primary" icon="EditPen" plain @click="crudRef.handleUpdate(item)">编辑</el-button>
              <el-button class="cu-btn" type="warning" icon="View" plain @click="handleView(item)">详情</el-button>
              <el-divider direction="vertical" />
              <el-popconfirm title="是否确认删除?" @confirm="handleDelete(item)">
                <template #reference>
                  <el-button type="danger" icon="Delete" plain />
                </template>
              </el-popconfirm>
            </div>
          </el-col>
        </el-row>
      </template>
      <template #online="scope">
        <el-tag v-if="scope.row.online" type="success" size="small">在线</el-tag>
        <el-tag v-else type="danger" size="small">离线</el-tag>
      </template>

      <template #group="scope">
        <el-tag v-for="i,k in scope.row.group" :key="k">{{ i.name }}</el-tag>
      </template>

      <template #menuSlot="scope">
        <!-- TODO: 没接口,nodeType无法获取，得改成 ！= 0 -->
        <el-tooltip class="box-item" effect="dark" content="子设备" placement="top">
          <el-button link icon="Box" :disabled="scope.row.nodeType == 0" @click="showChidrenDevices(scope.row)" />
        </el-tooltip>
        <el-divider direction="vertical" />
        <el-tooltip class="box-item" effect="dark" content="详情" placement="top">
          <el-button link type="primary" icon="View" @click="handleView(scope.row)" />
        </el-tooltip>
        <el-divider direction="vertical" />
        <el-tooltip class="box-item" effect="dark" content="删除" placement="top">
          <el-popconfirm title="是否确认删除该数据" @confirm="handleDelete(scope.row)">
            <template #reference>
              <el-button link type="danger" icon="Delete" />
            </template>
          </el-popconfirm>
        </el-tooltip>
      </template>
      <template #type="{ row }">{{ getNodeTypeName(row.productKey) }}</template>
      <template #deviceMapFormItem="{ row }">
        <div v-if="state.showDeviceMap">
          <Map :clickMap="true" @locateChange="(lnglat) => locateChange(lnglat, row)" :isWrite="true" v-model:center="state.mapLnglat" />
        </div>
      </template>
    </yt-crud>
    <children-dialog ref="childrenDialogRef" />

    <el-dialog title="添加设备到组" v-model="state.showDeviceToGroup" width="350px" append-to-body>
      <el-row style="align-items: center;">
        <el-col :span="7">
          <span><b> 请选择分组：</b></span>
        </el-col>

        <el-col :span="16">
          <el-select v-model="state.toGroupId" placeholder="请选择分组">
            <el-option v-for="item in groupOptions" :key="item.id" :label="item.name" :value="item.id"> </el-option>
          </el-select>
        </el-col>
      </el-row>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="state.showDeviceToGroup = false">取 消</el-button>
          <el-button type="primary" @click="handleAddDeviceToDeviceGroup">确 定</el-button>
        </span>
      </template>
    </el-dialog>


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
          uploadUrl="/device/importData" @upload-success="handleUploadSuccess"/>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script lang="ts" setup>
import defaultImg from '@/assets/iot/pic_device.png'
import { IColumn } from '@/components/iot/common/types/tableCommon'
import { ComponentInternalInstance } from 'vue'
import { getDevicesList, deleteDevices, saveDevices, getParentDevices, deleteBatchDevices } from '../api/devices.api'
import { getProductsList, IProductsVO } from '../api/products.api'
import { getDeviceGroupsList, addDeviceToDeviceGroup } from '../api/devices.api'

import Map from '@/components/iot/Map/index.vue'
import ChildrenDialog from './modules/childrenDialog.vue'
import YtCrud from '@/components/iot/common/yt-crud.vue'
import { ElPopconfirm } from 'element-plus'
import StatusTag from '@/components/iot/StatusTag/index.vue'

// const { proxy } = getCurrentInstance() as ComponentInternalInstance
import { download } from '@/utils/iot/request'
import modal from '@/plugins/modal'

const state = reactive({
  page: {
    pageSize: 12,
    pageNum: 1,
  },
  total: 0,
  loading: false,
  showDeviceMap: false,
  mapLnglat: '' as any,
  query: {},
  showDeviceToGroup: false,
  toGroupId: '',
})
const layoutType = ref('card')

// 查看详情
const router = useRouter()

const handleView = (row: any) => {
  if (!row.id) return
  let showMap = false
  productOptions.value.forEach((p) => {
    if (p.productKey == row.productKey) {
      showMap = p.isOpenLocate
    }
  })
  const deviceId = row.id
  router.push(`/devicesDetail/${row.id}?showMap=${showMap}`)
  // router.push("/devicesDetail/" + deviceId + "?showMap=" + showMap)

}
const nodeTypeOptions = [
  {
    value: 0,
    label: '网关设备',
  },
  {
    value: 1,
    label: '网关子设备',
  },
  {
    value: 2,
    label: '直连设备',
  },
]

// 打开子设备
const childrenDialogRef = ref()
const showChidrenDevices = (row: any) => {
  childrenDialogRef.value.openDialog(row)
}

// 复制ID
const copyIdSuccess = () => {
  modal.msgSuccess('复制成功')
}

// 产品字典
const productOptions = ref<IProductsVO[]>([])

// 组列表
const groupOptions = ref()

const getGroupsList = () => {
  getDeviceGroupsList({ pageNum: 1, pageSize: 99999, name: '' }).then((res) => {
    groupOptions.value = res.data.rows
  })
}

getGroupsList()

const column = ref<IColumn[]>([
  {
    label: '设备ID',
    key: 'deviceId',
    formHide: true,
    rules: [{ required: true, message: 'ProductKey不能为空' }],
  },
  {
    label: '产品',
    key: 'productKey',
    type: 'select',
    search: true,
    colSpan: 12,
    tableWidth: 120,
    editDisabled: true,
    componentProps: {
      labelAlias: 'name',
      valueAlias: 'productKey',
      options: [],
    },
    rules: [{ required: true, message: '产品名称不能为空' }],
    formWatch: (scope) => {
      scope.column.forEach((f: IColumn) => {
        if (['parentId', 'longitude', 'latitude'].includes(f.key)) {
          if (!scope.value) {
            f.formHide = true
            state.showDeviceMap = false
            return
          }
          productOptions.value.forEach((p) => {
            if (p.productKey == scope.value) {
              if (f.key === 'parentId') {
                f.formHide = p.nodeType !== 1
              } else {
                const flag = p.isOpenLocate && 'manual' == p.locateUpdateType
                state.showDeviceMap = flag
                f.formHide = !flag
              }
            }
          })
        }
      })
      column.value = scope.column
    },
  },
  {
    label: '设备类型',
    key: 'type',
    slot: true,
    formHide: true,
  },
  {
    label: '网关设备',
    key: 'parentId',
    type: 'select',
    colSpan: 12,
    tableWidth: 120,
    hide: true,
    formHide: true,
    componentProps: {
      labelAlias: 'deviceName',
      valueAlias: 'id',
      options: [],
      placeholder: '子设备可选择父设备',
    },
  },
  {
    label: '设备DN',
    key: 'deviceName',
    tableWidth: 240,
    componentProps: {
      placeholder: '一般为设备mac',
    },
    rules: [{ required: true, message: '设备DN不能为空' }],
  },
  {
    label: '设备经度',
    key: 'longitude',
    hide: true,
    formHide: true,
    colSpan: 12,
  },
  {
    label: '设备纬度',
    key: 'latitude',
    hide: true,
    formHide: true,
    colSpan: 12,
  },
  {
    label: '设备地图',
    key: 'deviceMap',
    hide: true,
    formItemSlot: true,
  },
  {
    label: '分组',
    key: 'group',
    type: 'select',
    search: true,
    componentProps: {
      labelAlias: 'name',
      valueAlias: 'id',
      options: groupOptions,
    },
    slot: true,
  },
  {
    label: '状态',
    key: 'online',
    type: 'select',
    componentProps: {
      options: [
        {
          label: '在线',
          value: true,
        },
        {
          label: '离线',
          value: false,
        },
      ],
    },
    search: true,
    formHide: true,
    tableWidth: 80,
    slot: true,
  },
  {
    label: '关键字',
    key: 'keyword',
    search: true,
    hide: true,
    formHide: true,
  },
  {
    label: '创建时间',
    key: 'createAt',
    tableWidth: 180,
    sortable: true,
    type: 'date',
    formHide: true,
  },
])
const crudRef = ref()
const data = ref<any[]>([])
const getData = () => {
  state.loading = true
  getDevicesList({
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

const getDict = () => {
  getProductsList({
    pageNum: 1,
    pageSize: 99999,
  }).then((res) => {
    productOptions.value = res.data.rows || []
    column.value.forEach((item) => {
      if (item.key === 'productKey') {
        item.componentProps.options = productOptions.value
      }
    })
  })
}
getDict()
const getProductName = (p: any) => {
  if (!p) {
    return ''
  }
  return p['name']
}
const getNodeTypeName = (p) => {
  if (!p) {
    return '直连设备'
  }

  const nodeType = p.nodeType ? p.nodeType : 0
  return ['网关设备', '网关子设备', '直连设备'][nodeType]
}
// 保存数据
const onSave = async ({ type, data, cancel }: any) => {
  state.loading = true
  await saveDevices(toRaw(data))

  state.loading = false
  cancel()
  getData()
}
// 弹窗前置操作
const openBeforeFun = ({ type, data }) => {
  if (type === 'add') {
    state.mapLnglat = ''
  } else if (type === 'update') {
    const latitude = data?.locate?.latitude || ''
    const longitude = data?.locate?.longitude || ''
    state.mapLnglat = longitude + ',' + latitude
  }
}
const parentDevices = async () => {
  let data = await getParentDevices()
  column.value.forEach((item) => {
    if (item.key === 'parentId') {
      item.componentProps.options = data.data
    }
  })
}
parentDevices()
// 删除
const handleDelete = async (row: any) => {
  state.loading = true
  if (row instanceof Array) {
    await deleteBatchDevices(row.map((m) => m.id))
  } else {
    await deleteDevices(row.id)
  }
  ElMessage.success('删除成功!')
  state.loading = false
  getData()
}

const multipleSelection = ref<{ deviceId: string }[]>([])

const onChange = (data) => {
  multipleSelection.value = data
}

// 添加设备到组弹框
const handleToGroup = () => {
  state.showDeviceToGroup = true
}

// 添加设备到组
const handleAddDeviceToDeviceGroup = () => {
  addDeviceToDeviceGroup({ group: state.toGroupId, devices: multipleSelection.value.map((m) => m.deviceId) }).then((res) => {
    if (res.code == 200) {
      ElMessage.success('添加成功!')
      state.showDeviceToGroup = false
      getData()
    } else {
      ElMessage.error(res.msg)
    }
  })
}

const handleUploadSuccess = (res) => {
  if (res.code == 200){
    ElMessage.success(res.message)
    getData()
  }
  fileUploadDialog.value.visible = false
}

const fileUploadDialog = ref({
  title: '导入设备数据',
  visible: false
})

const handleImport = () => {
  fileUploadDialog.value.visible = true
}

const handleDownloadTemplate = () => {
  // proxy?.download('device/exportData', {}, `device_template_${new Date().getTime()}.xlsx`)
  download('/iot/device/exportData', {}, `device_template_${new Date().getTime()}.xlsx`)
}

const locateChange = (e, row) => {
  if (!e) return
  row.longitude = e[0] || ''
  row.latitude = e[1] || ''
}
const options = reactive({
  ref: 'crudRef',
  data,
  column,
})
</script>

<style lang="scss" scoped>
::v-deep(.el-radio-button__inner) {
  padding: 8px;
}
::v-deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  border: 1px solid #0070ffff;
  background: #0070ff1a;
  box-shadow: none;
  svg {
    path {
      fill: #0070ffff;
    }
  }
}
.addDeviceToGroup {
  margin-right: 10px;
}
.el-radio-group {
  flex-wrap: nowrap;
}
.card-list {
  .card-item {
    border: 1px solid #d8dee5;
    border-radius: 3px;
    margin-right: 16px;
    margin-bottom: 16px;
    flex: 0 0 calc(25% - 12px);
    width: calc(25% - 12px);
    &.success-box {
      .text-box {
        background: linear-gradient(141.6deg, rgb(238, 250, 255) 0%, rgba(255, 255, 255, 0) 80%);
      }
    }
    &.error-box {
      .text-box {
        background: linear-gradient(141.6deg, rgb(255, 241, 241) 0%, rgba(255, 255, 255, 0) 80%);
      }
    }
    &:nth-child(4n) {
      margin-right: 0;
    }
    .text-box {
      padding: 16px;
      .title {
        font-size: 16px;
        font-weight: 600;
        align-items: center;
        margin-bottom: 12px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .title-l {
          display: flex;
          align-items: center;
        }
        .icon {
          margin-right: 10px;
          display: flex;
          align-items: center;
        }
      }
      .text {
        align-items: center;
        font-size: 14px;
        .txt {
          flex: 1;
          .txt-item {
            margin-bottom: 10px;
            &:last-child {
              margin-bottom: 0;
            }
            .copy-tag {
              padding: 4px 8px;
              background-color: #fff7ef;
              color: #ff7d00;
              display: inline-flex;
              align-items: center;
              transition: 0.3s ease;
              cursor: pointer;
              &:hover {
                opacity: 0.8;
                transform: translateY(-2px);
              }
              svg {
                margin-right: 8px;
              }
            }
          }
          border-radius: 2px;
          .label {
            display: inline-block;
            margin-right: 10px;
            color: #717c8e;
          }
          .value {
            display: inline-block;
            color: #0b1d30;
            &.active {
              color: #0070ff;
            }
          }
        }
        .img {
          width: 100px;
          height: 100px;
          img {
            width: 100%;
            height: auto;
          }
        }
      }
    }
    .btn-group {
      padding: 12px 16px;
      border-top: 1px solid #dcdfe1;
      .cu-btn {
        width: calc((100% - 73px) / 3);
      }
      .el-button {
        padding: 8px;
      }
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
}

@media screen and (max-width: 1560px) {
  .card-list .card-item .btn-group {
    padding: 12px;
    .el-button {
      font-size: 12px;
    }
    .cu-btn {
      width: calc((100% - 59px) / 3);
    }
    .el-button + .el-button {
      margin-left: 6px;
    }
  }
}
@media screen and (max-width: 1400px) {
  .card-list .card-item {
    width: calc(100% / 3 - 8px);
    flex: 0 0 calc(100% / 3 - 8px);
    margin-right: 12px;
    &:nth-child(4n) {
      margin-right: 12px;
    }
    &:nth-child(3n) {
      margin-right: 0;
    }
  }
}
</style>
