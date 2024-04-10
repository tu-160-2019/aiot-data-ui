<template>
  <div>
    <vue-json-editor :json="config || {}" :showBtns="false" :mode="'tree'" lang="zh" height="600" @change="change" />
    <el-button @click="saveConfig" type="primary" style="margin-top: 15px;">保存</el-button>
    <el-button @click="sendConfig" type="primary" style="margin-top: 15px;">下发</el-button>
  </div>
</template>

<script>
import VueJsonEditor from 'vue3-ts-jsoneditor'
import {
  getDeviceConfig,
  sendDeviceConfig,
  saveDeviceConfig,
} from '@/views/iot/equipment/api/devices.api'
import { ElNotification } from 'element-plus'
export default defineComponent({
  name: 'deviceConfig',
  props: {
    deviceId: {
      type: String,
    },
  },
  components: {
    VueJsonEditor,
  },
  data() {
    return {
      config: '',
    }
  },
  mounted() {
    this.getConfig()
  },
  watch: {
    deviceId: function (newV) {
      if (newV) this.getConfig()
    },
  },
  methods: {
    change (e) {
      this.config = e.json
    },
    getConfig() {
      getDeviceConfig(this.deviceId).then((rst) => {
        if(rst.code === 200){
          this.config = rst.data?.config ? JSON.parse(rst.data?.config) : ''
        }
      })
    },
    saveConfig () {
      saveDeviceConfig({
        deviceId: this.deviceId,
        config: JSON.stringify(this.config || {}),
      }).then((res) => {
        ElNotification({
          title: '成功',
          message: '修改成功',
          type: 'success',
        })
      })
    },
    sendConfig() {
      sendDeviceConfig(this.deviceId).then((res) => {
        if (res.code === 200) {
          ElNotification({
            title: '成功',
            message: '下发成功',
            type: 'success',
          })
        } else {
          ElNotification({
            title: '提示',
            message: res.message,
            type: 'error',
          })
        }
      })
    },
  },
})
</script>

<style lang="scss" scoped>
::v-deep(.jse-menu) {
  .jse-group-button {
    &:nth-child(1),
    &:nth-child(3) {
      display: none;
    }
  }
}
</style>
