<template>
  <div>
    <yt-crud
      ref="crudRef"
      :data="data"
      :column="column"
      v-model:page="state.page"
      v-model:query="state.query"
      :total="state.total"
      :loading="state.loading"
      :tableProps=" {
        selection: false,
        viewBtn: false,
        menuWidth: 100,

      }"
      @onLoad="getData"
      @delFun="onDelete"
      @saveFun="onSave"
    />
  </div>
</template>

<script lang="ts" setup>
import { IColumn } from '@/components/iot/common/types/tableCommon'

import YtCrud from '@/components/iot/common/yt-crud.vue'
import { deleteCategories, getCategoriesList, saveCategories } from '../api/categories.api'
import { ICategoriesVO } from '../api/categories.api'

const column: IColumn[] = [{
  label: 'id',
  key: 'id',
  editDisabled: true,
  rules: [{ required: true, message: 'id不能为空' }],
}, {
  label: '名称',
  key: 'name',
  search: true,
  rules: [{ required: true, message: '名称不能为空' }],
}, {
  label: '创建时间',
  key: 'createAt',
  type: 'date',
  sortable: true,
  formHide: true,
}]

const data = ref<ICategoriesVO[]>([])
const state = reactive({
  total: 0,
  page: {
    pageSize: 10,
    pageNum: 1,
  },
  query: {},
  loading: false
})
// 保存数据
const onSave = async ({type, data, cancel}: any) => {
  state.loading = true
  await saveCategories(toRaw(data))
  state.loading = false
  cancel()
  getData()
}
// 删除
const onDelete = async (row: any) => {
  state.loading = true
  await deleteCategories(row.id)
  ElMessage.success('删除成功!')
  state.loading = false
  getData()
}
// 获取数据
const getData = async () => {
  state.loading = true
  getCategoriesList(state.page).then(res => {
    data.value = res.data.rows
    state.total = res.data.total
  }).finally(() => {
    state.loading = false
  })
}
// getData()
</script>

<!-- <style lang="scss" scoped>

</style> -->
