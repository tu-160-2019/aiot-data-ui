<template>
  <div>
    <yt-crud
      ref="crudRef"
      :data="data"
      :column="column"
      v-model:page="state.page"
      v-model:query="state.query"
      :total="state.total"
      :loading="state.loading"
      :tableProps=" {
        selection: true,
        viewBtn: true,
        delBtn: true,
        customTable: layoutType === 'card',
        menuSlot: true,
        menuWidth: 300,
      }"
      :fun-props="{
        exportBtn: true,
        delBtn: false,
      }"
      @openBeforeFun="openBeforeFun"
      @delFun="handleDel"
      @exportFun="handleExport"
      @onLoad="getData"
      @saveFun="onSave"
    >
      <template #customTable>
        <el-row class="card-list flex">
          <el-col class="card-item" v-for="(item, index) in data" :key="index">
            <div class="text-box">
              <div class="title flex align-center">
                <div class="icon">
                  <svg-icon-iot icon-class="cube" class="design-iconfont" />
                </div>
                {{ item.name }}
              </div>
              <div class="text flex">
                <div class="txt">
                  <div class="txt-item">
                    <div class="label">所属分类</div>
                    <div class="value active">{{ getCateName(item.category) }}</div>
                  </div>
                  <div class="txt-item">
                    <div class="label">产品类型</div>
                    <div class="value">{{ getNodeTypeNmae(item.nodeType) }}</div>
                  </div>
                  <div class="txt-item">
                    <div class="label">透传设备</div>
                    <div class="value">
                      <span v-if="item.transparent">是</span>
                      <span v-if="!item.transparent">否</span>
                    </div>
                  </div>
                  <div class="txt-item">
                    <div class="label">设备定位</div>
                    <div class="value">{{ item.isOpenLocate ? item.locateUpdateType == 'manual' ? '手动' : '设备上报' : '关闭' }}</div>
                  </div>
                </div>
                <div class="img">
                  <img :src="item.img || defaultImg" alt="" />
                </div>
              </div>
            </div>
            <div class="btn-group">
              <el-button class="cu-btn" type="primary" icon="EditPen" plain @click="crudRef.handleUpdate(item)">编辑</el-button>
              <el-button class="cu-btn" type="warning" icon="View" plain @click="crudRef.handleView(item)">详情</el-button>
              <el-button class="cu-btn" type="success" icon="ScaleToOriginal" plain @click="openObjectModel(item)">物模型</el-button>
              <el-divider direction="vertical" />
              <el-popconfirm title="是否确认删除?" @confirm="handleDel(item)">
                <template #reference>
                  <el-button type="danger" icon="Delete" plain />
                </template>
              </el-popconfirm>
            </div>
          </el-col>
        </el-row>
      </template>
      <template #menuSlot="scope">
        <el-tooltip class="box-item" effect="dark" content="物模型" placement="top">
          <el-button link type="primary" icon="ScaleToOriginal" @click="openObjectModel(scope.row)" />
        </el-tooltip>
      </template>
      <template #rightToolbar>
        <el-radio-group v-model="layoutType">
          <el-radio-button label="table">
            <svg-icon-iot icon-class="table2" />
          </el-radio-button>
          <el-radio-button label="card">
            <svg-icon-iot icon-class="card" />
          </el-radio-button>
        </el-radio-group>
      </template>
    </yt-crud>
    <object-model ref="objectModelRef" />
  </div>
</template>

<script lang="ts" setup>
import defaultImg from '@/assets/iot/pic_device.png'
import { IColumn } from '@/components/iot/common/types/tableCommon'

import ObjectModel from './modules/objectModel.vue'
import YtCrud from '@/components/iot/common/yt-crud.vue'
import { getProductsList, saveProducts, IProductsVO, deleteProduct } from '../api/products.api'
import { getCategoriesAll } from '../api/categories.api'
import { ElDivider } from 'element-plus'

const crudRef = ref()
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
const getNodeTypeNmae = (type) => {
  return nodeTypeOptions.find((f) => f.value === type)?.label || ''
}
let cateOptions: any[] = []

const getCateName = (id: string) => {
  return cateOptions.find((f) => f.id === id)?.name || ''
}
const data = ref<IProductsVO[]>([])
const randomString = (len: number) => {
  len = len || 32
  var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  var maxPos = $chars.length
  var pwd = ''
  for (var i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
  }
  if (data.value.findIndex((f) => f.productKey === pwd) !== -1) {
    return randomString(len)
  }
  return pwd
}
const column = ref<IColumn[]>([
  {
    label: '产品密钥',
    key: 'productSecret',
    hide: true,
    addHide: true,
    editDisabled: true,
  },
  {
    label: '产品Key',
    key: 'productKey',
    search: true,
    editDisabled: true,
    addDisabled: true,
    rules: [{ required: true, message: '产品Key不能为空' }],
  },
  {
    label: '产品名称',
    key: 'name',
    search: true,
    rules: [{ required: true, message: '产品名称不能为空' }],
  },
  {
    label: '品类',
    key: 'category',
    type: 'select',
    tableWidth: 80,
    componentProps: {
      labelAlias: 'name',
      valueAlias: 'id',
    },
    rules: [{ required: true, message: '品类不能为空' }],
  },
  {
    label: '节点类型',
    key: 'nodeType',
    type: 'radio',
    componentProps: {
      defaultValue: 0,
      options: nodeTypeOptions,
    },
  },
  {
    label: '透传设备',
    key: 'transparent',
    type: 'radio',
    tableWidth: 80,
    componentProps: {
      defaultValue: false,
      options: [
        {
          value: true,
          label: '是',
        },
        {
          value: false,
          label: '否',
        },
      ],
    },
  },
  {
    label: '保活时长(秒)',
    key: 'keepAliveTime',
    type: 'number',
    search: false,
    rules: [{ required: true, message: '保活时长不能为空' }],
  },
  {
    label: '设备定位',
    key: 'isOpenLocate',
    type: 'radio',
    tableWidth: 80,
    componentProps: {
      defaultValue: false,
      options: [
        {
          value: true,
          label: '开启',
        },
        {
          value: false,
          label: '关闭',
        },
      ],
    },
    formWatch: (scope) => {
      scope.column.forEach((f: IColumn) => {
        if (f.key === 'locateUpdateType') {
          f.formHide = !scope.value
        }
      })
      column.value = scope.column
    },
  },
  {
    label: '定位方式',
    key: 'locateUpdateType',
    type: 'radio',
    tableWidth: 80,
    formHide: true,
    componentProps: {
      defaultValue: 'manual',
      options: [
        {
          value: 'manual',
          label: '手动定位',
        },
        {
          value: 'device',
          label: '设备上报',
        },
      ],
    },
  },
  {
    label: '产品图片',
    key: 'img',
    type: 'image',
    componentProps: {
      uploadType: 'url',
    },
  },
  {
    label: '创建时间',
    key: 'createAt',
    type: 'date',
    sortable: true,
    formHide: true,
  },
])

const state = reactive({
  total: 0,
  page: {
    pageSize: 12,
    pageNum: 1,
  },
  query: {},
  loading: false,
})
const layoutType = ref('card')
const getData = () => {
  state.loading = true
  getProductsList({
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
// 获取字典
const getDict = () => {
  getCategoriesAll().then((res) => {
    res = res || {}
    cateOptions = res.data || []
    column.value.forEach((item) => {
      if (item.key === 'category') {
        item.componentProps.options = cateOptions
      }
    })
  })
}
// 导出
const handleExport = () => {
  ElMessage({
    type: 'warning',
    message: '功能尚未完善，请耐心等待哟',
  })
}
// 删除
const handleDel = (rows) => {
  console.log('rows', rows)
  let key = rows.productKey
  state.loading = true
  deleteProduct(key)
    .then((res) => {
      if (res.code === 200) {
        ElMessage({
          type: 'success',
          message: '删除成功',
        })
        getData()
      } else {
        ElMessage({
          type: 'error',
          message: res.message,
        })
      }
    })
    .finally(() => {
      state.loading = false
    })
}
// 上传前置操作
const openBeforeFun = ({ type, data }) => {
  if (type === 'add') {
    data.productKey = randomString(16)
  }
}
getDict()
// 保存数据
const onSave = ({ type, data, cancel }: any) => {
  state.loading = true
  saveProducts(toRaw(data))
    .then((res) => {
      ElMessage.success(type === 'add' ? '添加成功' : '编辑成功')
      cancel()
      getData()
    })
    .finally(() => {
      state.loading = false
    })
}

const objectModelRef = ref()
const openObjectModel = (row: any) => {
  objectModelRef.value.getInfo(row.productKey)
}
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
.card-list {
  .card-item {
    border: 1px solid #d8dee5;
    border-radius: 3px;
    margin-right: 16px;
    margin-bottom: 16px;
    flex: 0 0 calc(25% - 12px);
    width: calc(25% - 12px);
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
          }
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
