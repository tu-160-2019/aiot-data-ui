<template>
  <div :class="{ 'hidden': hidden }" class="pagination-container">
    <el-pagination
      :background="background"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :layout="layout"
      :page-sizes="customPageSize"
      :pager-count="pagerCount"
      :total="total || 0"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'Pagination',
}
</script>

<script setup lang="ts">
import { deepClone } from '@/utils/iot'
import { scrollTo } from '@/utils/iot/scroll-to'
import { PropType } from 'vue'

const props = defineProps({
  total: {
    required: false,
    type: Number,
  },
  page: {
    type: Number,
    default: 1,
  },
  limit: {
    type: Number,
    default: 20,
  },
  pageSizes: {
    type: Array as PropType<number[]>,
    default() {
      return [5, 10, 20, 30, 50, 100]
    },
  },
  // 移动端页码按钮的数量端默认值5
  pagerCount: {
    type: Number,
    default: document.body.clientWidth < 992 ? 5 : 7,
  },
  layout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper',
  },
  background: {
    type: Boolean,
    default: true,
  },
  autoScroll: {
    type: Boolean,
    default: true,
  },
  hidden: {
    type: Boolean,
    default: false,
  },
  float: {
    type: String,
    default: 'right',
  },
})

const customPageSize = computed(() => {
  if (!props.pageSizes.includes(props.limit)) {
    const pageSizes = deepClone(props.pageSizes)
    pageSizes.push(props.limit)
    return pageSizes.sort((a, b) => a - b)
  }
  return props.pageSizes
})

const emit = defineEmits(['update:page', 'update:limit', 'pagination'])
const currentPage = computed({
  get() {
    return props.page
  },
  set(val) {
    emit('update:page', val)
  },
})
const pageSize = computed({
  get() {
    return props.limit
  },
  set(val) {
    emit('update:limit', val)
  },
})
function handleSizeChange(val: number) {
  if (props.total && currentPage.value * val > props.total) {
    currentPage.value = 1
  }
  emit('pagination', { page: currentPage.value, limit: val })
  if (props.autoScroll) {
    scrollTo(0, 800)
  }
}
function handleCurrentChange(val: number) {
  emit('pagination', { page: val, limit: pageSize.value })
  if (props.autoScroll) {
    scrollTo(0, 800)
  }
}
</script>

<style lang="scss" scoped>
.pagination-container {
  background: #fff;
  padding: 32px 16px;
  .el-pagination {
    float: v-bind(float);
  }
}
.pagination-container.hidden {
  display: none;
}
</style>
