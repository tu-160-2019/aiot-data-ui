<template>
  <div>
    <el-row>
          <el-col :span="12">
            <el-form :inline="true" :model="state.query" class="user-search">
              <el-form-item label="设备">
                <el-input v-model="state.query.keyword"  size="small" placeholder="输入设备DN" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="Search" size="small" @click="search">搜索</el-button>
              </el-form-item>
            </el-form>

            <el-table
              size="small"
              :data="state.deviceList"
              highlight-current-row
            >
              <el-table-column sortable label="产品" width="100" prop="product.name" />
              <el-table-column sortable label="产品Key" prop="productKey" />
              <el-table-column sortable label="设备ID" prop="deviceId" />
              <el-table-column sortable label="设备DN" prop="deviceName" />
              <el-table-column label="操作" width="150">
                <template #default="scope">
                  <el-button type="primary" size="small"  @click="selectDevice(scope.row)">选择</el-button>
                </template>
              </el-table-column>
            </el-table>
            <Pagination :total="state.total" :limit="state.page.pageSize" :page="state.page.pageNum" @pagination="getPageEvents"/>
          </el-col>


          <el-col :span="12" style="padding: 0 10px">
            <div style="padding-top: 30px">已绑定：</div>
            <el-table
              size="small"
              :data="state.bindDevices"
              highlight-current-row
            >
              <el-table-column sortable label="设备ID">
                <template #default="scope">
                  {{ scope.row }}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150">
                <template #default="scope">
                  <el-button type="danger" size="small" @click="handleDelBind(scope.$index, scope.row)" >删除</el-button>
                </template>
              </el-table-column>
            </el-table>


          </el-col>
        </el-row>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { getDevicesList } from '../../../api/devices.api'
import { saveVirtualDevicesBindDevices } from '../../../api/virtualDevices.api'


const route = useRoute()
const { id } = route.params

const emit = defineEmits(['bindDevice'])

const props = defineProps({
  detail: {
    type: Object,
    default() {
      return {}
    }
  },
})

const state = reactive({
  deviceList: [],
  bindDevices: props.detail.devices,
  total: 0,
  page: {
    pageSize: 10,
    pageNum: 1,
  },
  query: {
    productKey: props.detail.productKey,
    keyword: '',
  },
  loading: false,
})

watch(
  () => props.detail,
  (newDetail) => {
    // 在这里执行相应的更新逻辑
    state.query.productKey = newDetail.productKey
    getData()
    state.bindDevices = newDetail.devices
  },
);

const getData = () => {
  getDevicesList({...state.page, ...state.query}).then( res => {
      state.deviceList = res.data.rows || []
      state.total = res.data.total
  })
}
getData()

const selectDevice = (row) => {
  if ( state.bindDevices.findIndex((d) => {
      return d == row.id;
    }) >= 0
  ) {
    return;
  }
  state.bindDevices.push(row.id)
  saveBindDevices()
}

const handleDelBind = (index, row) => {
  state.bindDevices.splice(index, 1);
  saveBindDevices()
}

const saveBindDevices = () => {
  saveVirtualDevicesBindDevices({id: id, devices: state.bindDevices}).then((res) => {
    console.log(res)
  })
}

const search = () => {
  state.page.pageNum = 1
  getData()
}

const getPageEvents = (e)=> {
  state.page.pageSize = e.limit
  state.page.pageNum = e.page
  getData()
}

</script>