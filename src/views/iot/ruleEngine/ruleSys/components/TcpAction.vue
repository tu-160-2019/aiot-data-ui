<template>
  <div>
    <el-form label-width="120px" v-for="(service,index) in config.services" :key="index">
      <el-form-item label="TCP服务地址">
        <el-input v-model="service.host" auto-complete="off" placeholder="IP地址或域名" />
      </el-form-item>
      <el-form-item label="TCP服务端口">
        <el-input v-model="service.port" auto-complete="off" placeholder="输入端口" type="number" />
      </el-form-item>
      <el-form-item label="转换脚本">
        <code-editor style="width: 100%" :code="service.script" />
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
        type: 'tcp',
        services: [
          {
            script: '',
            host: '',
            port: 2424
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
