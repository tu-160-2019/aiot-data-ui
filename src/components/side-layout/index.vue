<template>
  <el-row v-if="show" class="side-layout" :gutter="16">
    <el-col :span="5" class="left">
      <div class="left-box">
        <div v-if="leftTitle" class="left-title">
          <slot name="left-title">
            <span>{{ leftTitle }}</span>
          </slot>
        </div>
        <div class="left-content">
          <slot name="left" />
        </div>
      </div>
    </el-col>
    <el-col :span="19" class="right">
      <div class="right-box">
        <div v-if="rightTitle" class="right-title">{{ rightTitle }}</div>
        <div class="right-content">
          <slot name="right"><el-empty description="请选择左侧目录 获取详情" /></slot>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script setup lang="ts" name="SideLayout">

import { computed, reactive, ref } from 'vue'

  const props = defineProps({
  	leftTitle: {
  		type: String,
  		required: false,
		default: ()=> ''
  	},
	rightTitle: {
		type: String,
		required: false,
		default: ()=> ''
	},
	show: {
		type: Boolean,
		required: false,
		default: ()=> true
	},
  })
</script>

<style lang="scss">
  .side-layout {
    height: 100%;
    box-sizing: border-box;
    .el-col {
      transition: width 0.4s;
    }
    .left,
    .right {
      height: 100%;
    }
    .left {
      position: relative;
    }
    /* .large-icon {
      position: absolute;
      top: 50%;
      right: -10px;
      transform: translateY(-50%);
      border: none;
      height: auto;
      i {
        font-size: 18px;
        cursor: pointer;
      }
    } */
    .left-box {
      height: 100%;
      display: flex;
      flex-direction: column;
      .left-title {
        height: 44px;
        line-height: 44px;
        padding: 0px 16px;
        background-image: url('@/assets/left-title.png');
        background-size: 100% auto;
        background-repeat: no-repeat;
        font-size: 16px;
        font-family: Alibaba-PuHuiTi-M, Alibaba-PuHuiTi;
        font-weight: normal;
        color: #020e19;
        border-radius: 8px 8px 0 0;
        position: relative;
        .rm-left-title {
          position: relative;
          .my-icon {
            font-size: 16px;
            height: 16px;
            width: 16px;
            position: absolute;
            right: 0px;
            top: 16px;
          }
        }
      }
      .left-content {
        flex: 1;
        overflow: auto;
        > div:first-child {
          background-color: #fff;
          height: 100%;
          padding: 10px;
          box-sizing: border-box;
          overflow: auto;
          border-radius: 8px;
        }
      }
    }
    .right-box {
      height: 100%;
      display: flex;
      flex-direction: column;
      .right-title {
		font-family: Alibaba-PuHuiTi-M, Alibaba-PuHuiTi;
		font-weight: normal;
		color: #020e19;
		font-size: 16px;
        height: 44px;
        line-height: 44px;
        padding: 0px 16px;
        background: #ffffff linear-gradient(90deg, rgba(17, 138, 249, 0.1) 0%, rgba(17, 138, 249, 0) 100%);
        border-radius: 8px 8px 0 0;
      }
      .right-content {
        flex: 1;
        overflow: auto;
        > div:first-child {
          background-color: #fff;
          height: 100%;
          padding: 10px;
          box-sizing: border-box;
          overflow: auto;
          border-radius: 8px;
        }
      }
    }
  }
</style>
