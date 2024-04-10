<template>
  <div>
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item>
        <el-select v-model="formInline.type" placeholder="请选择日志类型">
          <el-option label="所有" value="" />
          <el-option label="状态" value="state" />
          <el-option label="事件" value="event" />
          <el-option label="属性" value="property" />
          <el-option label="服务" value="service" />
        </el-select>
      </el-form-item>
      <el-form-item label="搜索：">
        <el-input v-model="formInline.identifier" placeholder="日志识符" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="logSearch">搜索</el-button>
      </el-form-item>
      <el-form-item label="定时刷新">
        <el-switch v-model="refresh" />
      </el-form-item>
    </el-form>

    <el-table :data="logList" border style="width: 95%">
      <el-table-column label="时间" width="180">
        <template v-slot="scope">
          {{ formatDate(scope.row.time) }}
        </template>
      </el-table-column>

      <el-table-column prop="type" label="类型" width="80" />
      <el-table-column prop="name" label="名称(标识符)" width="180" />
      <el-table-column label="内容">
        <template #default="scope">
          {{ scope.row.content.data }}
        </template>
      </el-table-column>
    </el-table>
    <Pagination :data="formInline" @onPagePaging="getEvents" />
  </div>
</template>

<script>
import { formatDate } from '@/utils/iot/formatTime'
import {
  deviceLogs
} from '@/views/iot/equipment/api/devices.api'
export default {
  name: 'deviceLog',
  props: {
    deviceDetail: {
      type: Object
    },
    thingModelEvents: {
      type: Array
    },thingModelServices: {
      type: Array
    },
  },
  data() {
    return {
      formatDate,
      refresh: false,
      logList: [],
      timer: null,
      formInline: {
        type: '',
        identifier: '',
        page: 1,
        size: 10,
        total: 0,
      }, typeMap: {
        lifetime: '生命周期',
        state: '设备状态',
        property: '属性',
        event: '事件',
        service: '服务',
      },
    }
  },
  computed:{
    deviceId () {
      return this.deviceDetail.deviceId
    },
  },
  watch: {
    deviceId(newV) {
      this.logSearch()
    },
    refresh(newVal, oldVal){
      if(newVal==true){
        this.timer= setInterval(()=>{
            this.getEvents()
        }, 1000)
      }else{
        if(oldVal==true)
        clearInterval(this.timer)
        this.timer =null
      }
    }
  },

  created() {
    this.getEvents()
  },
  methods: {
    logSearch() {
      this.formInline.page = 1
      this.getEvents()
    },
    getEvents () {
      if (!this.deviceId) return
      deviceLogs({
        ...this.formInline,
        deviceId: this.deviceId,
      }).then((res) => {
          this.formInline.total = res.data.total
          let logs = []
          res.data.rows.map((de) => {
              let row = {
                time: de.time,
                type: this.typeMap[de.type],
                name: '未知事件',
                content: de,
              }
              this.calcLog(de, row)
              logs.push(row)

              row.name = row.name + '(' + de.identifier + ')'
              return de
          })
          console.log('logs', logs)
          this.logList = logs
      })
    },

    calcLog(de, row){
      let modeEvents = this.thingModelEvents
      if (modeEvents && modeEvents.length > 0) {
        modeEvents.forEach((e) => {
          if (de.identifier == e.identifier) {
            row.name = e.name
            return
          }
        })
      }
      let modeServices = this.thingModelServices
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
    }
  },
}
</script>
