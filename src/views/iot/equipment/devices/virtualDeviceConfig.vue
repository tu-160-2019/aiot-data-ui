<template>
  <div class="box">
    <el-page-header @back="goBack" content="虚拟设备详情" />
    <el-divider></el-divider>
    <!-- 头部信息 -->
    <el-form :inline="true" label-width="80px">
      <el-form-item label="名称:">
        {{ data.name }}
      </el-form-item>
      <el-form-item label="产品:">
        {{ data.productKey }}
      </el-form-item>
      <el-form-item label="类型:">
        {{ state.typeName[data.type] }}
      </el-form-item>
      <el-form-item label="触发方式:">
        <!-- 触发方式，cron：定时执行；random：随机执行；none：无（手动） -->
        {{ data.trigger == 'cron' ? "定时执行" :  data.trigger == 'random' ? '随机执行' : '手动' }}
      </el-form-item>

      <el-form-item label="状态:">
        <el-button v-if="data.state == 'running'" type="success" size="small" plain @click="setState(data.id, 'stopped')">运行中</el-button>
        <el-button v-if="data.state == 'stopped'" type="danger" size="small" plain @click="setState(data.id, 'running')">已停止</el-button>
      </el-form-item>
      <el-form-item label=" ">
        <el-button @click="run(data.id)" size="small">立即执行</el-button>
      </el-form-item>
    </el-form>
    <el-tabs v-model="state.activeName">
      <el-tab-pane label="绑定设备" name="config">
        <bind-devices v-if="state.activeName === 'config'" :detail="data"/>
      </el-tab-pane>
      <el-tab-pane label="脚本" name="script">
        <script-box v-if="state.activeName === 'script'" :script="data.script"/>
      </el-tab-pane>
      <el-tab-pane label="日志" name="log">
        <device-log v-if="state.activeName === 'log'" ref="childLogRef"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts" setup>
import BindDevices from './modules/virtualDevices/bindDevices.vue'
import DeviceLog from './modules/virtualDevices/log.vue'
import ScriptBox from './modules/virtualDevices/script.vue'
import { ElNotification } from 'element-plus'
import { setVirtualDeviceState, runVirtualDevices, getVirtualDevicesDetail } from '../api/virtualDevices.api'

const router = useRouter()
const route = useRoute()
const { id } = route.params

const goBack = () => {
  router.back()
}
const data = ref({
  'id': '6293953092084e2df303ba3e',
  'uid': 'fa1c5eaa-de6e-48b6-805e-8f091c7bb831',
  'name': '三路开关',
  'productKey': 'cGCrkK7Ex4FESAwe',
  'devices': [],
  'type': 'thingModel',
  'script': '\nvar mid=1000;\n\nfunction getMid(){\n  mid++;\n  if(mid>9999){\n\tmid=1;\n  }\n  return mid+"";\n}\n\nfunction getRequestId(){\n  return "RID"+new Date().getTime()+getMid();\n}\n\n\nthis.receive=function(service,device){\n  return [];\n}\n\nthis.report=function(device){\n  return {\n    "mid":getRequestId(),\n    "productKey":device.productKey,  \n    "deviceName":device.deviceName,\n    "type":"property",\n    "identifier":"report",\n    "occurred":new Date().getTime(),\t//时间戳，设备上的事件或数据产生的本地时间\n    "time":new Date().getTime(),\t\t//时间戳，消息上报时间\n    "data":{\n\t  "rssi":127-parseInt(Math.random()*127),\n\t  "powerstate_1":Math.random()>0.5?1:0,\n\t  "powerstate_2":Math.random()>0.5?1:0,\n\t  "powerstate_3":Math.random()>0.5?1:0\n    }\n  }\n}',
  'trigger': 'none',
  'triggerExpression': 'hour',
  'state': 'stopped',
  'createAt': 1653839152090
})

const state = reactive({
  activeName: 'config',
  typeName: {
    thingModel: '基于物模型',
    protocol: '基于设备协议',
  },
})

// 调用getVirtualDevicesDetail api函数，获取虚拟设备详情，数据赋值给ref data
getVirtualDevicesDetail(id).then((res) => {
  data.value = res.data
})

const childLogRef = ref<any>();
const run = (id) => {
  runVirtualDevices(id).then(() => {
    ElNotification.success({
      title: '成功',
      message: '执行成功',
    })
    childLogRef.value.getLogs()
  })
}

const setState = (id: string, state: any) => {
  setVirtualDeviceState({ id: id, state: state }).then((res) => {
    if ( res.code == 200 ) {
      ElNotification.success({
        title: '成功',
        message: '状态切换成功',
      })
      data.value.state = state
    }
  })
}
</script>

<style lang="scss" scoped>
.box {
  margin: 15px;
  padding: 15px;
  background: #fff;
}
</style>
