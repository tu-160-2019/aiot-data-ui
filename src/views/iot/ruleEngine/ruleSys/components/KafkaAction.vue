<template>
  <div>
    <el-form label-width="120px" v-for="service in configRef.services" :key="service">
      <el-form-item label="broker地址">
        <el-input v-model="service.services" auto-complete="off" placeholder="127.0.0.1:9092,127.0.0.1:9093" />
      </el-form-item>
      <el-form-item label="ACK">
        <el-select v-model="service.ack" placeholder="请选择应答级别">
          <el-option v-for="item in ackOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
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
        type: 'kafka',
        services: [
          {
            script: '',
            services: '',
            ack: ''
          },
        ],
      }
    },
  },
})

const ackOptions = [{
  value: '0',
  label: 'ACK_0'
}, {
  value: '1',
  label: 'ACK_1'
}, {
  value: '-1',
  label: 'ACK_-1'
}]
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
