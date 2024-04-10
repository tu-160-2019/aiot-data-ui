<template>
  <div>new (function () {</div>
  <code-editor style="width: 100%" v-model:code="script" />
  <div>})()</div>
  <div style="margin-top: 30px"></div>
  <el-button type="primary" @click="saveScript" size="small">保存</el-button>
</template>

<script lang="ts" setup>
import CodeEditor from '@/components/iot/CodeEditor/index.vue'
import { saveVirtualDevicesScript } from '../../../api/virtualDevices.api'

const route = useRoute()
const { id } = route.params

const props = defineProps({
  script: String,
})

const script = ref(props.script)

const saveScript = () => {
  saveVirtualDevicesScript({id: id, script: script.value}).then(res => {
    if (res.code == 200) {
      ElMessage.success('保存成功!')
    }
  })
}
</script>
