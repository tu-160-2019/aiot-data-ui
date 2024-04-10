<template>
  <div class="status-tag" :class="type + '-tag'">
    <div class="round"></div>
    <div class="txt">{{ text }}</div>
  </div>
</template>

<script lang="ts" setup>
import { propTypes } from '@/utils/iot/propTypes'
import { PropType } from 'vue'
type TTypeTxt = 'primary' | 'danger' | 'success' | 'info' | 'warning'

defineProps({
  text: propTypes.string.def(''),
  type: {
    type: String as PropType<TTypeTxt>,
    default: 'primary'
  },
})
</script>

<style lang="scss" scoped>
.status-tag {
  display: inline-flex;
  align-items: center;
  &.success-tag {
    color: var(--el-color-success);
    .round {
      background-color: var(--el-color-success);
    }
  }
  &.danger-tag {
    color: var(--el-color-danger);
    .round {
      background-color: var(--el-color-danger);
    }
  }
  &.primary-tag {
    color: var(--el-color-primary);
    .round {
      background-color: var(--el-color-primary);
    }
  }
  &.info-tag {
    color: var(--el-color-info);
    .round {
      background-color: var(--el-color-info);
    }
  }
  &.warning-tag {
    color: var(--el-color-warning);
    .round {
      background-color: var(--el-color-warning);
    }
  }
  .round {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    margin-right: 6px;
  }
  .txt {
    font-size: 12px;
  }
}
</style>
