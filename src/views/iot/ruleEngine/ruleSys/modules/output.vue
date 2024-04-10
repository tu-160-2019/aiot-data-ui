<template>
  <div>
    <div class="list-box">
      <el-collapse v-model="activeName">
        <el-collapse-item :name="index" v-for="(item, index) in dataList" :key="index">
          <template #title>
            <div class="flex" style="justify-content: space-between;width: 100%;">
              <div class="cu-title" @click.stop>
                <el-radio-group v-model="item.type" @change="actionTypeChange(item)" :disabled="!!item.saved">
                  <el-radio v-if="actions.indexOf('device') >= 0" :label="'device'">设备控制 </el-radio>
                  <el-radio v-if="actions.indexOf('alert') >= 0" :label="'alert'">告警消息 </el-radio>
                  <el-radio v-if="actions.indexOf('scene') >= 0" :label="'scene'">场景控制 </el-radio>
                  <el-radio v-if="actions.indexOf('http') >= 0" :label="'http'">http推送 </el-radio>
                  <el-radio v-if="actions.indexOf('mqtt') >= 0" :label="'mqtt'">mqtt推送 </el-radio>
                  <el-radio v-if="actions.indexOf('kafka') >= 0" :label="'kafka'">kafka推送 </el-radio>
                  <el-radio v-if="actions.indexOf('tcp') >= 0" :label="'tcp'">tcp推送 </el-radio>
                </el-radio-group>
              </div>
              <div style="padding-right: 10px;">
                <el-button @click="removeListener(index)">删除</el-button>
              </div>
            </div>
          </template>
          <div class="condition-box" v-if="item.type === 'device'">
            <DeviceAction ref="deviceActionRef" v-model:services="item.services" />
          </div>
          <div class="condition-box" v-if="item.type === 'http'">
            <HttpAction :config="item" />
          </div>
          <div class="condition-box" v-if="item.type === 'mqtt'">
            <MqttAction :config="item" />
          </div>
          <div class="condition-box" v-if="item.type === 'kafka'">
            <KafkaAction :config="item" />
          </div>
          <div class="condition-box" v-if="item.type === 'tcp'">
            <TcpAction :config="item" />
          </div>
          <div class="condition-box" v-if="item.type === 'alert'">
            <AlertAction :config="item" />
            保存后，在警告配置中关联此规则
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <el-button style="margin-top: 10px;" @click="handleAdd">新增输出</el-button>
  </div>
</template>
<script lang="ts" setup>
import { propTypes } from '@/utils/iot/propTypes'
import DeviceAction from '../components/DeviceAction.vue'
import HttpAction from '../components/HttpAction.vue'
import MqttAction from '../components/MqttAction.vue'
import KafkaAction from '../components/KafkaAction.vue'
import TcpAction from '../components/TcpAction.vue'
import AlertAction from '../components/AlertAction.vue'

const props = defineProps({
  list: propTypes.array.def([]),
  actions: propTypes.string.def(''),
})
const emits = defineEmits(['update:list'])
const arr: number[] = []
for (let i = 0; i < 10; i++) {
  arr.push(i)
}
const activeName = ref<number[]>(arr)
const dataList = ref<any[]>(props.list || [])
watch(
  () => dataList.value.length,
  (newV) => {
    const arr = dataList.value.map((m) => {
      if (m.config) {
        const obj = JSON.parse(m.config || '{}')
        return obj
      }
      return m
    })
    dataList.value = arr
    emits('update:list', arr)
  },
  {
    // deep: true,
    immediate: true,
  }
)
// 新增输出
const handleAdd = () => {
  dataList.value.push({
    services: [],
  })
}

// 删除输出
const removeListener = (index: number) => {
  dataList.value.splice(index, 1)
}

const deviceActionRef = ref()
const actionTypeChange = (item) => {
  console.log(item)
  if (item.services.length == 0) {
    if (item.type == 'http') {
      item.services = [
        {
          url: '',
          script: `this.translate=function(msg,device){
        }`,
        },
      ]
    } else if (item.type == 'alert') {
      item.services = [
        {
          script: `this.translate=function(msg,device){
        }`,
        },
      ]
    } else if (item.type == 'mqtt') {
      item.services = [
        {
          host: '',
          port: 1883,
          username: '',
          password: '',
          script: `this.translate=function(msg,device){
        }`,
        },
      ]
    } else if (item.type == 'kafka') {
      item.services = [
        {
          services: '',
          ack: '',
          script: `this.translate=function(msg,device){
        }`,
        },
      ]
    } else if (item.type === 'tcp') {
      item.services = [
        {
          host: '',
          port: 1883,
          script: `this.translate=function(msg,device){
        }`,
        },
      ]
    }
  }
}
onUnmounted(() => {
  console.log('onUnmounted')
  dataList.value = []
})
</script>

<style lang="scss" scoped>
.list-box {
  margin-top: 10px;
  .cu-title {
    width: calc(100% - 30px);
    cursor: auto;
    display: flex;
    align-items: center;
    .item {
      width: 250px;
      margin-right: 10px;
    }
  }
}
::v-deep(.el-collapse-item__header) {
  background-color: #f2f2f2;
  padding: 0 12px;
}
.condition-box {
  background-color: #f2f2f2;
  padding: 15px;
  border-top: 1px solid #d9d9d9;
  .main {
    border: 2px dashed rgb(217, 217, 217);
    .title {
      padding: 12px;
      color: #333;
      font-weight: 600;
      border-bottom: 1px solid rgb(217, 217, 217);
    }
    .main-box {
      padding: 10px;
      .box {
        display: flex;
        align-items: center;
        .item {
          border: 2px dashed rgb(217, 217, 217);
          padding: 6px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
          flex: 1;
          .param-item {
            margin-bottom: 8px;
          }
        }
        // .el-button {
        //   width: 50px;
        // }
      }
    }
  }
}
</style>
