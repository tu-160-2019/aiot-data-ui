<template>
  <div class="box">
    <el-page-header @back="goBack" content="插件详情" />
    <el-divider></el-divider>
    <!-- 头部信息 -->
    <el-form :inline="true" label-width="80px">
      <el-form-item label="名称:">
        {{ data.name }}
      </el-form-item>
      <el-form-item label="插件id:">
        {{ data.pluginId }}
      </el-form-item>
      <el-form-item label="版本号:">
        {{ data.version }}
      </el-form-item>
      <el-form-item label="状态:">
        <el-switch
          v-model="data.state"
          active-text="运行中"
          inactive-text="已停止"
          active-value="running"
          inactive-value="stopped"
          inline-prompt
          size="large"
          :loading="loading"
          style="--el-switch-on-color: #029D40; --el-switch-off-color: #DFDFDF"
          @change="setState(data)"
        />
      </el-form-item>
    </el-form>
    <el-form :inline="true" label-width="80px">
      <el-form-item label="插件包:">
        {{ data.file }}
      </el-form-item>
      <el-form-item>
        <upload-file
          :fileType="['jar']"
          :limit="1"
          :fileSize="100"
          :params="uploadParam"
          @uploadSuccess="(res) => uploadJarSuccess(res, data)"
          uploadType="url"
          uploadUrl="/plugin/uploadJar"
        />
      </el-form-item>
      <el-form-item label="说明:" style="width: 100%;">
        {{ data.description }}
      </el-form-item>
    </el-form>
    <el-divider content-position="left">参数配置</el-divider>
    <el-form :inline="true" label-width="80px">
      <el-form-item v-for="scm in data.configSchema" :key="scm.id" :label="scm.name">
        <el-input v-model="scm.value" v-if="scm.type=='text'"></el-input>
        <el-input-number v-model="scm.value" v-else-if="scm.type=='number'"></el-input-number>
        <el-radio-group v-model="scm.value" v-else-if="scm.type=='radio'">
          <el-radio v-for="opt in scm.options" :key="opt.value" :label="opt.value" size="large" border>{{opt.name}}</el-radio>
        </el-radio-group>
        <el-select v-model="scm.value" v-else-if="scm.type=='select'">
          <el-option v-for="opt in scm.options" :key="opt.value" :label="opt.name" :value="opt.value" />
        </el-select>
      </el-form-item>
      <el-footer>
        <div class="el-upload__tip">注：修改参数要重启插件生效</div>
        <el-button :loading="loading" @click="handleSave" type="primary" style="margin-top: 5px;">保存</el-button>
      </el-footer>
    </el-form>

    <el-collapse accordion>
      <el-collapse-item title="转换脚本(可选)" name="2">
        <code-editor v-model:code="data.script" />
        <el-button :loading="loading" @click="handleSave" type="primary" style="margin-top: 5px;">保存</el-button>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script lang="ts" setup>
import { ElNotification } from 'element-plus'
import { getDetail, changeState, editPlugin } from './api/plugin.api'
import YtTableForm from '@/components/iot/common/yt-table-form'
import UploadFile from '@/components/iot/FileUpload/index.vue'
import CodeEditor from '@/components/iot/CodeEditor/index.vue'

const route = useRoute()
const router = useRouter()
const { id } = route.params
const goBack = () => {
  router.back()
}
const data = ref({
  id: 459488314626117,
  pluginId: 'fa1c5eaa-de6e-48b6-805e-8f091c7bb831',
  name: 'mqtt插件',
  description: '官方mqtt插件，配置host/port 测试测试测试测试测试测试测试测试测试测试测试',
  file: 'xxx.jar',
  deployType: 'upload',
  version: '1.0.0',
  script:
    '\nvar mid=1000;\n\nfunction getMid(){\n  mid++;\n  if(mid>9999){\n\tmid=1;\n  }\n  return mid+"";\n}\n\nfunction getRequestId(){\n  return "RID"+new Date().getTime()+getMid();\n}\n\n\nthis.receive=function(service,device){\n  return [];\n}\n\nthis.report=function(device){\n  return {\n    "mid":getRequestId(),\n    "productKey":device.productKey,  \n    "deviceName":device.deviceName,\n    "type":"property",\n    "identifier":"report",\n    "occurred":new Date().getTime(),\t//时间戳，设备上的事件或数据产生的本地时间\n    "time":new Date().getTime(),\t\t//时间戳，消息上报时间\n    "data":{\n\t  "rssi":127-parseInt(Math.random()*127),\n\t  "powerstate_1":Math.random()>0.5?1:0,\n\t  "powerstate_2":Math.random()>0.5?1:0,\n\t  "powerstate_3":Math.random()>0.5?1:0\n    }\n  }\n}',
  state: 'stopped',
  config: '{}',
  configSchema: [
    { id: 'port', name: '端口', type: 'number', value: 9081, desc: 'http端口，默认为9081' },
    {
      id: 'a',
      name: '参数a',
      type: 'select',
      value: 11,
      desc: '单选参数a',
      options: [
        { name: '值0', value: 0 },
        { name: '值1', value: 11 },
      ],
    },
  ],
  createAt: 1653839152090,
})
const uploadParam = ref({ id: 0 })

const state = reactive({
  detail: {},
  activeName: 'config',
})

const loading = ref(false)
// 上传jar成功
const uploadJarSuccess = (res, row) => {
  getData()
}

const handleSave = () => {
  console.log(data.value.configSchema)
  loading.value = true
  const config = {}
  if (data.value.configSchema) {
    data.value.configSchema.forEach((c) => {
      config[c.id] = c.value
    })
  }

  data.value.config = JSON.stringify(config)
  editPlugin(data.value).then(() => {
    getData()
  })
}

const setState = (data: any) => {
  loading.value = true
  changeState({ id: data.id, state: data.state }).then(
    () => {
      getData()
    },
    () => {
      loading.value = false
    }
  )
}

const getData = () => {
  loading.value = true
  getDetail(id.toString())
    .then((res) => {
      data.value = res.data || {}
      if (res.data.configSchema) {
        const configSchema = JSON.parse(res.data.configSchema)
        const config = JSON.parse(res.data.config || '{}')
        for (let key in config) {
          const idx = configSchema.findIndex((e) => e.id == key)
          const kv = idx >= 0 ? configSchema[idx] : null
          if (kv) {
            kv.value = config[key]
          }
        }
        data.value.configSchema = configSchema
      } else {
        data.value.configSchema = []
      }
      uploadParam.value.id = res.data.id
      console.log(data.value)
    })
    .finally(() => {
      loading.value = false
    })
}

getData()
</script>

<style lang="scss" scoped>
.box {
  margin: 15px;
  padding: 15px;
  background: #fff;
}
</style>
