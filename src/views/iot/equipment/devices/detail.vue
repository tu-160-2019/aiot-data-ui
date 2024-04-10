<template>
  <div class="box equipment-detail">
    <el-page-header @back="goBack" content="设备详情"></el-page-header>
    <el-divider></el-divider>
    <el-tabs v-loading="loading" v-model="state.activeName" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="base">
        <el-row :gutter="20" v-if="state.activeName === 'base'">
          <el-col :span="12">
            <el-descriptions :column="1" border :labelStyle="{ 'font-weight': 'bold' }">
              <el-descriptions-item label="设备ID">{{
                state.deviceDetail.deviceId
              }}</el-descriptions-item>
              <el-descriptions-item label="产品productKey">{{
                state.deviceDetail.productKey
              }}</el-descriptions-item>
              <el-descriptions-item label="设备deviceName">{{
                state.deviceDetail.deviceName
              }}</el-descriptions-item>
              <el-descriptions-item label="设备密钥">{{
                state.deviceDetail.secret
              }}</el-descriptions-item>
              <el-descriptions-item label="创建时间">{{
                formatDate(state.deviceDetail.createAt)
              }}</el-descriptions-item>
              <el-descriptions-item label="设备状态">{{
                state.deviceDetail.state
                ? state.deviceDetail.state.online
                  ? "在线"
                  : "离线"
                : "离线"
              }}</el-descriptions-item>
              <el-descriptions-item label="最后上线时间">{{
                formatDate(state.deviceDetail.onlineTime)
              }}</el-descriptions-item>
            </el-descriptions></el-col
          >
          <el-col v-if="state.showDeviceMap" :span="12">
            <Map :center="state.mapLnglat" />
          </el-col>
        </el-row>
        <div style="margin: 10px 10px">设备标签&nbsp;<el-button size="small" icon="Plus" @click="addTag"></el-button></div>
        <el-descriptions :column="2" border :labelStyle="{ 'font-weight': 'bold' }">
          <el-descriptions-item v-for="tag in state.tags" :key="tag.name" :label="tag.name + '(' + tag.id + ')'">{{ tag.value
          }}</el-descriptions-item>
        </el-descriptions>
      </el-tab-pane>

      <el-tab-pane label="属性" name="property">
        <el-table v-if="state.activeName === 'property'" :data="state.properties" border v-loading="state.loading" style="width: 100%">
          <el-table-column prop="name" label="属性名" width="250">
            <template v-slot="scope"> {{ scope.row.name }}({{ scope.row.identifier }}) </template>
          </el-table-column>
          <el-table-column prop="value" label="属性值">
            <template v-slot="scope">
              <span>{{ scope.row.value }} &nbsp;</span>
              <el-button @click="showPropertyHistory(scope.row)" size="small">历史</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="occurred" label="修改时间">
            <template v-slot="scope">
              <span>{{ formatDate(scope.row.occurred)}} </span>
            </template>
          </el-table-column>
          <el-table-column label="可读写" width="80">
            <template v-slot="scope">
              <el-tag v-if="!scope.row.write" type="info" size="small" effect="plain">只读</el-tag>
              <el-button @click="showWriteProperty(scope.row)" v-if="scope.row.write" size="small" type="success" plain>可写</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div v-if="!!state.propertyHistory.name">
          <el-divider></el-divider>
          <el-row>
            <el-col :span="2">
              <h5>历史数据</h5>
            </el-col>
            <el-col :span="9">
              <el-date-picker
                v-model="state.historyTime"
                type="datetimerange"
                :picker-options="state.pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right"
                @change="timeRangeChange"
              >
              </el-date-picker>
            </el-col>
            <el-col :span="4">
              <el-radio-group v-model="state.dataType">
                <el-radio-button label="">无</el-radio-button>
                <el-radio-button label="stats">统计</el-radio-button>
              </el-radio-group>
            </el-col>
          </el-row>
          <PropertyChart :name="state.propertyHistory.name" :properties="state.propertyHistory.data"></PropertyChart>
        </div>
      </el-tab-pane>

      <el-tab-pane label="服务" name="service">
        <el-table v-if="state.activeName === 'service'" :data="state.services" border v-loading="state.loading" style="width: 100%">
          <el-table-column label="服务名称" width="180">
            <template v-slot="scope"> {{ scope.row.name }}({{ scope.row.identifier }}) </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template v-slot="scope">
              <el-button @click="showInvokeService(scope.row)" type="success" size="small" plain>调用</el-button>
            </template>
          </el-table-column>
          <el-table-column label="参数">
            <template v-slot="scope">
              <pre class="equipment-param">{{ scope.row.inputData }}</pre>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="日志" name="event">
        <el-form v-if="state.activeName === 'event'" :inline="true" :model="state.formInline" class="user-search">
          <el-form-item>
            <el-select v-model="state.formInline.type" placeholder="请选择日志类型">
              <el-option label="所有" value="" />
              <el-option label="状态" value="state" />
              <el-option label="事件" value="event" />
              <el-option label="属性" value="property" />
              <el-option label="服务" value="service" />
            </el-select>
          </el-form-item>
          <el-form-item label="搜索：">
            <el-input v-model="state.formInline.identifier" placeholder="日志识符" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="logSearch">搜索</el-button>
          </el-form-item>
        </el-form>

        <el-table :data="state.events" border v-loading="state.loading" style="width: 100%">
          <el-table-column label="时间" width="180">
            <template v-slot="scope">
              {{formatDate(scope.row.time) }}
            </template>
          </el-table-column>
          <el-table-column prop="type" label="类型" width="80" />
          <el-table-column prop="name" label="名称(标识符)" width="180" />
          <el-table-column label="内容">
            <template v-slot="scope">
              <pre class="equipment-param">{{ scope.row.content.data }}</pre>
            </template>
          </el-table-column>
        </el-table>
        <Pagination
          :data="state.formInline"
          :total="state.formInline.total"
          :page="state.formInline.pageNum"
          :limit="state.formInline.pageSize"
          @pagination="getEvents"
        />
      </el-tab-pane>

      <el-tab-pane label="模拟上报" name="report">
        <el-table
          v-if="state.activeName === 'report'"
          :data="state.modelFunctions"
          highlight-current-row
          v-loading="state.loading"
          border
          element-loading-text="拼命加载中"
          style="width: 100%"
        >
          <el-table-column sortable prop="type" label="功能类型" width="100" />
          <el-table-column sortable prop="name" label="功能名称" width="180" />
          <el-table-column sortable prop="identifier" label="标识符" width="150" />
          <el-table-column sortable prop="dataTypeName" label="数据类型" width="100" />
          <el-table-column sortable prop="params" label="数据定义" />
          <el-table-column label="上报">
            <template #default="scope">
              <el-form inline v-model="scope.row" label-width="80px">
                <el-form-item label="值" v-if="scope.row.type == 'property'">
                  <el-input v-model="scope.row.value" size="small" />
                </el-form-item>
                <el-form-item label="内容" v-else>
                  <el-input type="textarea" v-model="scope.row.content" size="small" rows="4" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" size="small" @click="sendDeviceMsg(scope.row)">发送</el-button>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="设备配置" name="config">
        <DeviceConfig v-if="state.activeName === 'config'" :deviceId="state.deviceId" />
      </el-tab-pane>

      <el-tab-pane label="模拟设备" name="simulator">
        <DeviceSimulator v-if="state.activeName === 'simulator'" :thingModelFunctions="state.modelFunctions" :deviceDetail="state.deviceDetail" />
      </el-tab-pane>
    </el-tabs>

    <el-dialog
      :title="state.title"
      v-model="state.propertyWriteFormVisible"
      width="40%"
      @close="closeDialog"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      append-to-body
      destroy-on-close
    >
      <el-form v-if="state.propertyWriteFormVisible" label-width="120px" :model="state.propertyWriteForm" ref="propertyWriteForm">
        <div style="display: none">
          <el-input v-model="state.propertyWriteForm.identifier" type="hidden" />
        </div>
        <el-form-item label="属性值" prop="value">
          <el-input v-model="state.propertyWriteForm.value" auto-complete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" :loading="state.loading" class="title" @click="submitPropertyWriteForm">保存</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
      :title="state.title"
      v-model="state.serviceFormVisible"
      width="40%"
      @close="closeDialog"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      append-to-body
      destroy-on-close
    >
      <el-form v-if="state.serviceFormVisible" label-width="120px" :model="state.serviceForm" ref="serviceForm">
        <div>
          <el-input v-model="state.serviceForm.identifier" type="hidden" />
          <el-input v-model="state.serviceForm.productKey" type="hidden" />
          <el-input v-model="state.serviceForm.deviceName" type="hidden" />
        </div>
        <div v-if="state?.serviceForm?.params.length === 0">是否确认调用？</div>
        <el-form-item v-for="param in state.serviceForm.params" :key="param.identifier" :label="param.identifier" prop="params">
          <el-input v-model="param.value" auto-complete="off" />
          <div class="form-tips">{{ param.name }}</div>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" :loading="state.loading" class="title" @click="submitServiceForm">确认</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
      title="添加设备标签"
      v-model="state.showAddTag"
      width="400px"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      append-to-body
      destroy-on-close
    >
      <el-form v-if="state.showAddTag" ref="formRef" :model="state.tagForm" :rules="state.rules" label-width="80px">
        <el-form-item label="标签名称" prop="name">
          <el-input v-model="state.tagForm.name" />
        </el-form-item>
        <el-form-item label="标识符" prop="id">
          <el-input v-model="state.tagForm.id" />
        </el-form-item>
        <el-form-item label="标签值" prop="value">
          <el-input v-model="state.tagForm.value" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitAddTag">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { formatDate } from '@/utils/iot/formatTime'
import { getObjectModel } from '@/views/iot/equipment/api/products.api'
import {
  getDevicesDetail,
  devicesTagAdd,
  deviceSimulateSend,
  propertySet,
  deviceLogs,
  serviceInvoke,
  devicePropertyLogs,
} from '@/views/iot/equipment/api/devices.api'

import PropertyChart from './modules/PropertyChart.vue'
import DeviceConfig from './modules/detail/DeviceConfig.vue'
import Map from '@/components/iot/Map/index.vue'
import DeviceSimulator from './modules/detail/DeviceSimulator.vue'

const route = useRoute()
const router = useRouter()
const { id } = route.params
const { showMap } = route.query || false
const goBack = () => {
  router.back()
}

const formRef = ref()
const state = reactive<any>({
  loading: false,
  activeName: 'base',
  title: '',
  propertyWriteFormVisible: false,
  propertyWriteForm: {
    identifier: '',
    productKey: '',
    deviceName: '',
    value: '',
  },
  serviceFormVisible: false,
  serviceForm: {
    identifier: '',
    productKey: '',
    deviceName: '',
    params: [],
  },
  showAddTag: false,
  showDeviceMap: false,
  tagForm: {
    name: '',
    identifier: '',
    value: '',
  },
  rules: {
    id: [{ required: true, message: '请输入标识符', trigger: 'blur' }],
    name: [{ required: true, message: '请输入标签名称', trigger: 'blur' }],
    value: [{ required: true, message: '请输入标签值', trigger: 'blur' }],
  },
  deviceId: '',
  deviceDetail: {},
  thingModel: null,
  modelFunctions: [],
  properties: [],
  services: [],
  events: [],
  eventMap: {},
  mapLnglat: '',
  tags: [],
  formInline: {
    type: '',
    identifier: '',
    pageNum: 1,
    pageSize: 10,
    total: 0,
  },
  deviceLogs: [],
  typeMap: {
    lifetime: '生命周期',
    state: '设备状态',
    property: '属性',
    event: '事件',
    service: '服务',
  },
  propertyHistory: {
    name: '',
    data: [],
  },
  dataType: '',
  currHistoryProperty: {},
  historyTime: [new Date(new Date().getTime() - 24 * 3600 * 1000), new Date(new Date().getTime() + 24 * 3600 * 1000)],
  pickerOptions: {
    shortcuts: [
      {
        text: '最近1小时',
        onClick(picker) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000)
          picker.$emit('pick', [start, end])
        },
      },
      {
        text: '最近6小时',
        onClick(picker) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 6)
          picker.$emit('pick', [start, end])
        },
      },
      {
        text: '最近1天',
        onClick(picker) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24)
          picker.$emit('pick', [start, end])
        },
      },
      {
        text: '最近5天',
        onClick(picker) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 5)
          picker.$emit('pick', [start, end])
        },
      },
    ],
  },
})
const getdata = () => {
  state.deviceId = id
  getDevicesDetail(state.deviceId).then((res: any) => {
    if (res.code !== 200) return
    const { data } = res
    if (data.state && data.state.onlineTime) {
      data.onlineTime = data.state.onlineTime
    } else {
      data.onlineTime = ''
    }
    let prop = data.property || {}
    state.deviceDetail = data
    if (data?.locate.longitude && data.locate.latitude) {
      state.mapLnglat = data.locate.longitude + ',' + data.locate.latitude
    }
    state.showDeviceMap = JSON.parse(showMap as string)
    //取设备物模型信息
    console.log('state.thingModel', state.thingModel)
    if (!state.thingModel) {
      getObjectModel(data.productKey).then((objRes: any) => {
        const data = objRes.data || {}
        //取物模型功能列表
        data.model = data.model || {
          properties: [],
          events: [],
          services: [],
        }
        let model = data.model
        console.log('model', model)

        state.thingModel = model

        state.services = model.services

        fillProperty(prop)

        data.model.properties = data.model.properties || []
        data.model.events = data.model.events || []
        data.model.services = data.model.services || []
        data.model = JSON.parse(JSON.stringify(data.model))

        model = data.model || {}
        let modelFuncs: any[] = []
        model.properties.forEach((p) => {
          let params = JSON.stringify(p.dataType.specs || '{}', null, 4)
          modelFuncs.push({
            raw: p,
            type: 'property',
            name: p.name,
            identifier: p.identifier,
            dataTypeName: p.dataType.type,
            params: params == '{}' ? '' : params,
            value: '',
            occurred: '',
          })
        })
        model.events.forEach((e) => {
          let output = {}
          e.outputData.forEach((p) => {
            output[p.identifier] = p.name
          })
          modelFuncs.push({
            raw: e,
            type: 'event',
            name: e.name,
            identifier: e.identifier,
            dataTypeName: '-',
            params: JSON.stringify(output, null, 4),
            content: JSON.stringify(output, null, 4),
          })
        })
        model.services.forEach((s) => {
          let input = {}
          ;(s.inputData || []).forEach((p) => {
            input[p.identifier] = p.name
          })
          let output = {}
          ;(s.outputData || []).forEach((p) => {
            output[p.identifier] = p.name
          })
          modelFuncs.push({
            raw: s,
            type: 'service',
            name: s.name + '回复',
            identifier: s.identifier + '_reply',
            dataTypeName: '-',
            params: JSON.stringify(output, null, 4),
            content: JSON.stringify(output, null, 4),
          })
        })
        state.modelFunctions = modelFuncs
      })
    } else {
      fillProperty(prop)
    }

    let deviceTag = data.tag
    state.tags = []
    for (var p in deviceTag) {
      var tag = deviceTag[p]
      state.tags.push({ id: tag.id, name: tag.name, value: tag.value })
    }
  })
}
const fillProperty = (prop) => {
  let model = state.thingModel
  let props: any[] = []
  model.properties.forEach((p) => {
    props.push({
      identifier: p.identifier,
      name: p.name,
      value: prop[p.identifier]?.value ?? prop[p.identifier],
      occurred: prop[p.identifier]?.occurred ?? '',
      write: p.accessMode != 'r',
    })
  })
  state.properties = props
}
const addTag = () => {
  state.showAddTag = true
}
const submitAddTag = () => {
  state.tagForm.deviceId = state.deviceId
  formRef.value.validate((valid) => {
    if (valid) {
      devicesTagAdd(state.tagForm).then(() => {
        ElMessage({
          type: 'success',
          message: '添加成功',
        })
        getdata()
        state.showAddTag = false
      })
    }
  })
}
const logSearch = () => {
  state.formInline.pageNum = 1
  getEvents({ page: 1, limit: 20 })
}
const getEvents = (e) => {
  console.log('deviceLogs', e)
  state.formInline.pageNum = e.page
  state.formInline.pageSize = e.limit
  deviceLogs({
    deviceId: state.deviceId,
    ...state.formInline,
  }).then((res) => {
    state.formInline.total = res.data.total
    let logs: any[] = []
    res.data.rows.map((de) => {
      let row = {
        time: de.time,
        type: state.typeMap[de.type],
        name: '未知事件',
        content: de,
      }
      logs.push(row)
      if (!state.thingModel) return
      let modeEvents = state.thingModel.events
      if (modeEvents && modeEvents.length > 0) {
        modeEvents.forEach((e) => {
          if (de.identifier == e.identifier) {
            row.name = e.name
            return
          }
        })
      }
      let modeServices = state.thingModel.services
      if (de.type == 'property') {
        if (de.identifier == 'set_reply') {
          row.name = '设置回复'
        } else if (de.identifier == 'report') {
          row.name = '上报'
        } else if (de.identifier == 'set') {
          row.name = '设置'
        }
      } else if (de.type == 'state') {
        if (de.identifier == 'online') {
          row.name = '上线'
        } else {
          row.name = '下线'
        }
      } else if (de.type == 'lifetime') {
        if (de.identifier == 'register') {
          row.name = '注册'
        }
      } else if (modeServices && modeServices.length > 0) {
        var ids = de.identifier.split('_reply')
        modeServices.forEach((e) => {
          if (ids[0] == e.identifier) {
            row.name = e.name + (ids.length > 1 ? '回复' : '')
            return
          }
        })
      }

      row.name = row.name + '(' + de.identifier + ')'
      return de
    })

    state.events = logs
  })
}
const showPropertyHistory = (row) => {
  state.currHistoryProperty = row
  refreshPropertyHistory()
}
const loading = ref(false)
const refreshPropertyHistory = () => {
  var end = state.historyTime[1]
  var start = state.historyTime[0]
  loading.value = true
  devicePropertyLogs({
    deviceId: state.deviceId,
    name: state.currHistoryProperty.identifier,
    start: start.getTime(),
    end: end.getTime(),
  })
    .then((res) => {
      state.propertyHistory.name = state.currHistoryProperty.name
      state.propertyHistory.data = res.data
    })
    .finally(() => {
      loading.value = false
    })
}
const timeRangeChange = () => {
  refreshPropertyHistory()
}
const handleClick = (tab) => {
  tab.paneName == 'event' ? getEvents({ page: 1 }) : getdata()
}
const showWriteProperty = (prop) => {
  state.propertyWriteFormVisible = true
  state.title = '设置属性'
  state.propertyWriteForm.identifier = prop.identifier
  state.propertyWriteForm.productKey = state.deviceDetail.productKey
  state.propertyWriteForm.deviceName = state.deviceDetail.deviceName
  state.propertyWriteForm.value = prop.value?.value ? prop.value.value : prop.value
}
const submitPropertyWriteForm = () => {
  let form = state.propertyWriteForm
  let prop = {}
  prop[form.identifier] = form.value
  propertySet({
    deviceId: state.deviceId,
    args: prop,
  }).then((res) => {
    if (res.code === 200) {
      ElMessage({
        type: 'success',
        message: '操作成功',
      })
    } else {
      ElMessage.error(res.message)
    }
  })
}
const showInvokeService = (service) => {
  state.serviceFormVisible = true
  state.title = '服务调用'
  state.serviceForm.identifier = service.identifier
  state.serviceForm.deviceId = state.deviceDetail.deviceId
  let params: any[] = []
  service.inputData.forEach((p) => {
    params.push({
      identifier: p.identifier,
      name: p.name,
      value: '',
    })
  })
  state.serviceForm.params = params
}
const submitServiceForm = () => {
  let form = state.serviceForm
  let param = {}
  state.serviceForm.params.forEach((p) => {
    param[p.identifier] = p.value
  })

  serviceInvoke({
    deviceId: state.deviceId,
    service: form.identifier,
    args: param,
  }).then((res) => {
    if (res.code === 200) {
      state.serviceFormVisible = false
      ElMessage({
        type: 'info',
        message: '操作成功',
      })
    } else {
      ElMessage({
        type: 'error',
        message: res.message,
      })
    }
  })
}
const sendDeviceMsg = (fun) => {
  //发送模拟设备消息
  let data = {}
  if (fun.type == 'property') {
    let val = fun.value
    switch (fun.dataTypeName) {
      case 'int32':
        break
      case 'bool':
        break
      case 'enum':
        if (!(val in fun.raw.dataType.specs)) {
          ElMessage({
            type: 'info',
            message: '数据类型错误',
          })
          return
        }
        break
      case 'float':
        val = parseFloat(val)
        break
    }
    data[fun.identifier] = val
  } else {
    data = JSON.parse(fun.content)
  }

  deviceSimulateSend({
    deviceId: state.deviceId,
    productKey: state.deviceDetail.productKey,
    deviceName: state.deviceDetail.deviceName,
    type: fun.type,
    identifier: fun.type == 'property' ? 'report' : fun.identifier,
    data: data,
  }).then(() => {
    ElMessage({
      type: 'info',
      message: '操作成功',
    })
  })
}
const closeDialog = () => {
  state.propertyWriteFormVisible = false
  state.serviceFormVisible = false
}
const locateChange = (e) => {
  state.propertyWriteForm.value = e[0] * 1 + ',' + e[1] * 1
}

getdata()
logSearch()
</script>

<style lang="scss" scoped>
.box {
  padding: 15px;
  background: #fff;
}
.form-tips {
  font-size: 12px;
  line-height: 14px;
}
.equipment-param {
  max-height: 160px;
  overflow: hidden auto;
  word-wrap: break-word;
  white-space: pre-wrap;
  font-size: 12px;
  line-height: 14px;
}
</style>
