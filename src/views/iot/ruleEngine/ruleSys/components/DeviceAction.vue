<template>
  <div class="select-device" style="width: 240px;margin-bottom: 10px;display: inherit;">
    <select-device v-model:dn="selectedDn" placeholder="选择设备" @on-select="hadnleSelectDevice" />
  </div>
  <div v-if="selectedDn">
    <el-row v-for="service in servicesRef" :key="service.identifier" style="margin-bottom: 10px;">
      <el-col :span="22">
        <el-row class="service-box">
          <el-col :span="8">
            <el-select v-model="service.identifier" @change="serviceSelected(service)">
              <el-option label="设置属性" value="set" />
              <el-option v-for="s in servicesList || []" :label="s.name" :value="s.identifier" :key="s.identifier" />
            </el-select>
          </el-col>
          <el-col :span="16" style="padding-left: 5px">
            <el-row v-if="service.identifier == 'set'">
              <el-col :span="20">
                <el-row v-for="param in service.inputData" :key="param.identifier" style="margin-bottom: 10px;">
                  <el-col :span="10">
                    <el-select v-model="param.identifier">
                      <el-option v-for="prop in propertiesList" :label="prop.name" :value="prop.identifier" :key="prop.identifier" />
                    </el-select>
                  </el-col>
                  <el-col :span="2"> 值: </el-col>
                  <el-col :span="7">
                    <el-input v-model="param.value" />
                  </el-col>
                  <el-col :span="2">
                    <el-button @click="delParam(service.inputData, param)">-</el-button>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="2">
                <el-button @click="addParam(service.inputData)">+</el-button>
              </el-col>
            </el-row>
            <el-row v-else>
              <el-col :span="20">
                <el-row v-for="param in findService(service.identifier).inputData" :key="param.identifier" style="margin-bottom: 10px;">
                  <el-col :span="10">
                    {{ param.name }}
                  </el-col>
                  <el-col :span="2"> 值: </el-col>
                  <el-col :span="7">
                    <el-input v-model="param.value" />
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="2" style="padding-left: 3px">
        <el-button @click="delService(service)">-</el-button>
      </el-col>
    </el-row>
    <el-button @click="addService">+</el-button>
  </div>
</template>

<script>
import { getObjectModel } from '@/views/iot/equipment/api/products.api'

import SelectDevice from '@/components/iot/YtSelect/select-device.vue'
export default defineComponent({
  name: 'DeviceAction',
  props: {
    services: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    SelectDevice,
  },
  data() {
    return {
      showDeviceSelector: false,
      selectedPk: '',
      selectedDn: '',
      properties: [],
      servicesRef: this.services,
      propertiesList: [],
      servicesList: [],
    }
  },
  emits: ['update:services'],
  mounted() {
    console.log('1111', this.services)
    this.servicesRef = this.services
    this.services.map((m, i) => {
      if (m.device && i === 0) {
        const firstObj = m.device ? m.device.split('/') : ''
        if (firstObj) {
          this.selectedPk = firstObj[0] || ''
          this.selectedDn = firstObj[1] === '#' ? '' : firstObj[1]
        }
        this.getProductObjectModel(this.selectedPk)
      }
    })
  },
  methods: {
    openDeviceSelector() {
      this.showDeviceSelector = !this.showDeviceSelector
    },
    hadnleSelectDevice(device) {
      if (!device.productKey) return
      this.selectedDn = device.deviceName
      this.selectedPk = device.productKey
      this.getProductObjectModel(device.productKey)
    },
    getProductObjectModel(pk) {
      getObjectModel(pk).then((res) => {
        const data = res.data || {}
        this.initThingModel(pk, data)
      })
    },
    initThingModel(pk, res) {
      this.propertiesList = []
      this.servicesList = []
      if (!res) return
      res.model.properties.forEach((p) => {
        this.propertiesList.push(p)
      })
      res.model.services.forEach((s) => {
        this.servicesList.push(s)
      })
    },
    addService() {
      console.log(this.selectedPk + '/' + (this.selectedDn || '#'))
      this.servicesRef.push({
        device: this.selectedPk + '/' + (this.selectedDn || '#'),
        identifier: 'set',
        inputData: [],
      })
    },
    serviceSelected(service) {
      this.servicesList.forEach((s) => {
        if (service.identifier == s.identifier) {
          service.inputData = s.inputData
        }
      })
    },
    delService(service) {
      let idx = this.servicesRef.findIndex((s) => s.identifier == service.identifier)
      this.servicesRef.splice(idx, 1)
    },
    findService(identifier) {
      let service = {}
      if (this.servicesList.length === 0) return ''
      this.servicesList.forEach((s) => {
        if (s.identifier == identifier) {
          service = s
          return service
        }
      })
      this.servicesRef.forEach((s) => {
        if (s.identifier == identifier) {
          service = s
          return service
        }
      })
      return service
    },
    addParam(inputData) {
      inputData.push({})
    },
    delParam(inputData, param) {
      let idx = inputData.findIndex((d) => (d.identifier = param.identifier))
      inputData.splice(idx, 1)
    },
  },
})
</script>

<style scoped>
.service-box {
  border: 1px solid #ddd;
  border-radius: 3px;
  padding: 5px 5px;
  background-color: #eee;
}
</style>
