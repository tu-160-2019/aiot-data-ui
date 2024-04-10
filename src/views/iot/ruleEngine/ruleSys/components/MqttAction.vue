<template>
  <div>
    <el-form label-width="120px" v-for="service in config.services" :key="service">
      <el-form-item label="MQTT地址">
        <el-input v-model="service.host" auto-complete="off" placeholder="IP地址或域名" />
      </el-form-item>
      <el-form-item label="MQTT端口">
        <el-input v-model="service.port" auto-complete="off" placeholder="输入端口" type="number" />
      </el-form-item>
      <el-form-item label="帐号">
        <el-input v-model="service.username" auto-complete="off" placeholder="输入帐号" />
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="service.password" auto-complete="off" placeholder="输入密码" />
      </el-form-item>
      <el-form-item label="转换脚本">
        <code-editor style="width: 100%" v-model:code="service.script" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import CodeEditor from '@/components/iot/CodeEditor/index.vue'

const props = defineProps({
  config: {
    type: Object,
    default: () => {
      return {
        type: 'mqtt',
        services: [
          {
            script: '',
            host: '',
            port: 1883,
            username: '',
            password: '',
          },
        ],
      }
    },
  },
})



const configRef = ref<any>(props.config)
const init = (data) => {
  if (!configRef.value.services) configRef.value.services = data
  if (configRef.value.services.length > 1) {
    configRef.value.services.splice(1, configRef.value.services.length - 1)
  }
}
watch(() => props.config, (newV) => {
  init(newV)
}, {
  immediate: true,
  deep: true,
})
</script>

<style scoped>
.CodeMirror {
  height: 300px !important;
}
</style>
<style>
.CodeMirror pre.CodeMirror-line,
.CodeMirror pre.CodeMirror-line-like {
  line-height: 21px !important;
}
</style>
