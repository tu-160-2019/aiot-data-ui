<template>
  <basic-layout>
    <yt-table-search :column="column" @handle-search="search">
      <template #slots="item, formModel">
        <el-input v-model="formModel[item.key]" />
      </template>
    </yt-table-search>
    <yt-table-fun @handle-add="handleAdd()">
      <yt-table :data="data" :column="column" @handle-update="handleUpdate" @handle-delete="handleDel" @handle-view="handleView">
        <template #slots="row">
          <el-switch v-model="row.slots" />
        </template>
      </yt-table>
    </yt-table-fun>
    <yt-table-form ref="tableFormRef" :column="column">
      <template #slots="col, data">
        <el-switch v-model="data.slots" />
      </template>
    </yt-table-form>
  </basic-layout>
</template>

<script lang="ts" setup>
import YtTableSearch from '@/components/iot/common/yt-table-search'
import YtTableFun from '@/components/iot/common/yt-table-fun.vue'
import YtTable from '@/components/iot/common/yt-table'
import YtTableForm from '@/components/iot/common/yt-table-form'
import { IColumn } from '@/components/iot/common/types/tableCommon'

const data = ref([{
  title: '标题1',
  value: '内容呢',
  type: 1,
  date: '1990-10-10',
  string: '字符串1',
  slots: true,
  switch: true,
  number: 111,
  color: '#fff',
  rate: 5,
  radio: '1',
  checkbox: '1,2'
}])
const tableFormRef = ref()
const handleAdd = () => {
  tableFormRef.value?.openDialog('add')
}
const handleDel = (row: any) => {
  console.log(row)
}
const handleUpdate = (row: any) => {
  tableFormRef.value?.openDialog('update', row)
}
const handleView = (row: any) => {
  tableFormRef.value?.openDialog('view', row)
}
const search = (params: any) => {
  console.log(params)
}
const column: IColumn[] = [{
  label: '产品类型',
  key: 'type',
  type: 'select',
  search: true,
  componentProps: {
    options: [{
      label: '类型1',
      value: '1'
    }, {
      label: '类型2',
      value: '2'
    }, {
      label: '类型3',
      value: '3'
    }]
  },
  rules: [{ required: true, message: '产品类型不能为空' }],
}, {
  label: '日期',
  key: 'date',
  type: 'date',
  componentProps: {
    format: 'YYYY/MM/DD',
    valueFormat: 'YYYY-MM-DD',
  },
}, {
  label: '字符串',
  key: 'string',
  rules: [{ required: true, message: '字符串不能为空' }],
}, {
  label: '插槽',
  key: 'slots',
  slot: true,
}, {
  label: '开关',
  key: 'switch',
  type: 'switch',
  hide: true,
}, {
  label: '数字',
  key: 'number',
  type: 'number',
}, {
  label: '颜色',
  key: 'color',
  type: 'color',
  hide: true,
}, {
  label: '评分',
  key: 'rate',
  type: 'rate',
  hide: true,
}, {
  label: '单选',
  key: 'radio',
  type: 'radio',
  componentProps: {
    options: [{
      label: '单选1',
      value: '1'
    }, {
      label: '单选2',
      value: '2'
    }]
  }
}, {
  label: '多选',
  key: 'checkbox',
  type: 'checkbox',
  hide: true,
  componentProps: {
    options: [{
      label: '多选1',
      value: '1'
    }, {
      label: '多选2',
      value: '2'
    }]
  }
}]
</script>
