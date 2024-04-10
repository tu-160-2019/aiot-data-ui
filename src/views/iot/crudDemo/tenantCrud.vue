<template>
  <yt-crud ref="crudRef" v-model:queryParams="queryParams" :data="data" :column="column" :loading="loading" @save-fun="saveFun" @change="onLoad" />
</template>

<script lang="ts" setup>
import { IColumn } from '@/components/iot/common/types/tableCommon'

import { listTenant, addTenant, updateTenant } from '@/api/iot/tenant'

import { ElLoading } from 'element-plus'
import YtCrud from '@/components/iot/common/yt-crud.vue'

const column: IColumn[] = [{
  label: '租户编号',
  key: 'tenantId',
  search: true,
  formHide: true,
  rules: [{ required: true, message: '产品类型不能为空' }],
}, {
  label: '联系人',
  search: true,
  key: 'contactUserName',
}, {
  label: '联系电话',
  key: 'contactPhone',
  search: true,
}, {
  label: '用户名',
  key: 'username',
  hide: true,
}, {
  label: '用户密码',
  key: 'password',
  hide: true,
  componentProps: {
    type: 'password',
  },
}, {
  label: '企业名称',
  key: 'companyName',
  search: true,
}, {
  label: '社会信用代码',
  key: 'licenseNumber',
}, {
  label: '过期时间',
  key: 'expireTime',
  tableWidth: 180,
}, {
  label: '租户状态',
  key: 'status',
  type: 'switch',
}]


const data = ref()
const queryParams = reactive({
  searchParams: {},
  pageParams: {
    pageNum: 1,
    pageSize: 10
  },
})
// 保存方法
const saveFun = async (obj: any) => {
  const loading = ElLoading.service({
    lock: true,
    text: '保存中',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  console.log(obj)
  const { type, data } = obj
  if (type === 'add') await addTenant(data).finally(() => {
    loading.close()
  })
  if (type === 'update') await updateTenant(data).finally(() => {
    loading.close()
  })
}


const loading = ref(false)
const onLoad = async () => {
  const params = {
    ...queryParams?.searchParams,
    ...queryParams?.pageParams,
  }
  loading.value = true
  const res = await listTenant(params)
  loading.value = false

  if (res.code === 200) {
    data.value = res.rows
  }
}
onLoad()
</script>

<!-- <style lang="scss" scoped>

</style> -->
