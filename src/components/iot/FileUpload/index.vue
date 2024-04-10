<template>
  <div class="upload-file">
    <el-upload
      multiple
      :action="uploadUrl"
      :before-upload="handleBeforeUpload"
      :file-list="fileList"
      :limit="limit"
      :on-error="handleUploadError"
      :on-exceed="handleExceed"
      :on-success="handleUploadSuccess"
      :show-file-list="false"
      :data="paramsData"
      :headers="headers"
      class="upload-file-uploader"
      ref="fileUploadRef"
    >
      <slot v-if="isSlot" name="buttonSlot"></slot>
      <!-- 上传按钮 -->
      <el-button v-else type="primary">选取文件</el-button>
    </el-upload>
    <!-- 上传提示 -->
    <div class="el-upload__tip" v-if="showTip">
      请上传
      <template v-if="fileSize">
        大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b>
      </template>
      <template v-if="fileType">
        格式为 <b style="color: #f56c6c">{{ fileType.join("/") }}</b>
      </template>
      的文件
    </div>
    <!-- 文件列表 -->
    <transition-group v-if="isShowList" class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear" tag="ul">
      <li :key="file.uid" class="el-upload-list__item ele-upload-list__item-content" v-for="(file, index) in fileList">
        <el-link :href="`${file.url}`" :underline="false" target="_blank">
          <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
        </el-link>
        <div class="ele-upload-list__item-content-action">
          <el-link :underline="false" @click="handleDelete(index)" type="danger">删除</el-link>
        </div>
      </li>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { generateUUID } from '@/utils/iot/index'
import { getToken } from '@/utils/iot/auth'
import { listByIds, delOss } from '@/api/iot/oss'
import { propTypes } from '@/utils/iot/propTypes'

import { ComponentInternalInstance } from 'vue'
import { ElUpload, UploadFile } from 'element-plus'

const props = defineProps({
  isSlot: propTypes.bool.def(false),
  isShowList: propTypes.bool.def(true),
  modelValue: [String, Object, Array],
  // 数量限制
  limit: {
    type: Number,
    default: 5,
  },
  // 大小限制(MB)
  fileSize: {
    type: Number,
    default: 5,
  },
  // 文件类型, 例如['png', 'jpg', 'jpeg']
  fileType: {
    type: Array,
    default: () => ['png', 'jpg', 'jpeg'],
  },
  // 是否显示提示
  isShowTip: {
    type: Boolean,
    default: true,
  },
  uploadUrl: {
    type: String,
    default: '/resource/oss/upload',
  },
  // 上传参数
  params: {
    type: Object,
    default: () => {},
  },
  // 是否覆盖
  isCover: propTypes.bool.def(false),
  // 图片上传类型： ossId || url
  uploadType: propTypes.string.def('ossId'),
})
const paramsData = ref(props.params || {})
const { proxy } = getCurrentInstance() as ComponentInternalInstance
const emit = defineEmits(['update:modelValue', 'stringSuccess', 'uploadSuccess'])
const number = ref(0)
const uploadList = ref<any[]>([])

const baseUrl = import.meta.env.VITE_APP_BASE_API
const uploadUrl = ref(baseUrl + props.uploadUrl) // 上传文件服务器地址
const headers = ref({ Authorization: 'Bearer ' + getToken() })

const fileList = ref<any[]>([])
const showTip = computed(() => props.isShowTip && (props.fileType || props.fileSize))

const fileUploadRef = ref(ElUpload)

watch(
  () => props.modelValue,
  async (val) => {
    if (val) {
      let temp = 1
      // 首先将值转为数组
      let list: any[] = []
      if (Array.isArray(val)) {
        list = val
      } else {
        if (props.uploadType === 'ossId') {
          const res = await listByIds(val as string)
          list = res.data.map((oss) => {
            const data = { name: oss.originalName, url: oss.url, ossId: oss.id }
            return data
          })
        } else {
          list = val.split(',').map((m) => ({ name: getFileName(m), url: m }))
        }
      }
      // 然后将数组转为对象数组
      fileList.value = list.map((item) => {
        item = { name: item.name, url: item.url, ossId: item.ossId }
        item.uid = item.uid || new Date().getTime() + temp++
        return item
      })
    } else {
      fileList.value = []
      return []
    }
  },
  { deep: true, immediate: true }
)

// 上传前校检格式和大小
const handleBeforeUpload = (file: any) => {
  paramsData.value.requestId = generateUUID()
  // 校检文件类型
  if (props.fileType.length) {
    const fileName = file.name.split('.')
    const fileExt = fileName[fileName.length - 1]
    const isTypeOk = props.fileType.indexOf(fileExt) >= 0
    if (!isTypeOk) {
      proxy?.$modal.msgError(`文件格式不正确, 请上传${props.fileType.join('/')}格式文件!`)
      return false
    }
  }
  // 校检文件大小
  if (props.fileSize) {
    const isLt = file.size / 1024 / 1024 < props.fileSize
    if (!isLt) {
      proxy?.$modal.msgError(`上传文件大小不能超过 ${props.fileSize} MB!`)
      return false
    }
  }
  proxy?.$modal.loading('正在上传文件，请稍候...')
  number.value++
  return true
}

// 文件个数超出
const handleExceed = () => {
  proxy?.$modal.msgError(`上传文件数量不能超过 ${props.limit} 个!`)
}

// 上传失败
const handleUploadError = () => {
  proxy?.$modal.msgError('上传文件失败')
}

// 上传成功回调
const handleUploadSuccess = (res: any, file: UploadFile) => {
  if (typeof res === 'string') {
    proxy?.$modal.closeLoading()
    emit('stringSuccess', {
      id: res,
      fileName: file.name,
    })
    return
  }
  if (res.code === 200) {
    if (res.data) {
      uploadList.value.push({ name: res.data.fileName || res.data.originalName, url: res.data.url, ossId: res.data.ossId, size: res.data.size })
    }
    uploadedSuccessfully(res)
  } else {
    number.value--
    proxy?.$modal.closeLoading()
    proxy?.$modal.msgError(res.message)
    fileUploadRef.value.handleRemove(file)
    uploadedSuccessfully(res)
  }
}

// 删除文件
const handleDelete = (index: number) => {
  let ossId = fileList.value[index].ossId
  if (props.uploadType === 'ossId') delOss([ossId])
  fileList.value.splice(index, 1)
  emit('update:modelValue', listToString(fileList.value))
}

// 上传结束处理
const uploadedSuccessfully = (res) => {
  if (number.value > 0 && uploadList.value.length === number.value) {
    fileList.value = fileList.value.filter((f) => f.url).concat(toRaw(uploadList.value))
    uploadList.value = []
    number.value = 0
    emit('uploadSuccess', toRaw(fileList.value))
    emit('update:modelValue', listToString(fileList.value))
  } else {
    emit('uploadSuccess', res)
  }
  proxy?.$modal.closeLoading()
}

// 获取文件名称
const getFileName = (name: string) => {
  // 如果是url那么取最后的名字 如果不是直接返回
  if (name.lastIndexOf('/') > -1) {
    return name.slice(name.lastIndexOf('/') + 1)
  } else {
    return name
  }
}

// 对象转成指定字符串分隔
const listToString = (list: any[], separator?: string) => {
  let strs = ''
  separator = separator || ','
  list.forEach((item) => {
    if (props.uploadType === 'ossId' && item.ossId) {
      strs += item.ossId + separator
    }
    if (props.uploadType === 'url' && item.url) {
      strs += item.url + separator
    }
  })
  return strs != '' ? strs.substring(0, strs.length - 1) : ''
}
</script>

<style scoped lang="scss">
.upload-file-uploader {
  margin-bottom: 5px;
}
.upload-file-list .el-upload-list__item {
  border: 1px solid #e4e7ed;
  line-height: 2;
  margin-bottom: 10px;
  position: relative;
}
.upload-file-list .ele-upload-list__item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: inherit;
  padding: 0 6px;
}
.ele-upload-list__item-content-action .el-link {
  margin-right: 10px;
}
.el-icon-document {
  padding-right: 8px;
}
</style>
