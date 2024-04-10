<template>
  <yt-crud ref="crudRef" :data="data" :column="column">
    <template #sloo="scope">
      <el-input v-model="scope.row.sloo" />
    </template>
    <template #slots3Form="scope">
      <el-input v-model="scope.row.sloo" />
    </template>
    <template #slots2Search="scope">
      <el-input v-model="scope.row.sloo" />
    </template>
  </yt-crud>
</template>
<script lang="ts" setup>
import { IColumn } from '@/components/iot/common/types/tableCommon'

import YtCrud from '@/components/iot/common/yt-crud.vue'

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
  key: 'sloo',
  slot: true,
}, {
  label: '搜索插槽',
  key: 'slots2',
  search: true,
  hide: true,
  searchSlot: true,
}, {
  label: '表单插槽',
  key: 'slots3',
  hide: true,
  formSlot: true,
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

const data = ref([{
  title: '标题1',
  value: '内容呢',
  type: 1,
  date: '1990-10-10',
  string: '字符串1',
  sloo: '1111',
  switch: true,
  number: 111,
  color: '#fff',
  rate: 5,
  radio: '1',
  checkbox: '1,2'
}])
const getScope = (s) => {
  console.log('s', s)
}
</script>

<!-- <style lang="scss" scoped>

</style> -->
