<template>
  <el-card>
    <el-form :inline="true" ref="aigcFormRef" :model="aigcForm" @keyup.enter="submitHandle()">
      <el-row>
        <el-form-item prop="promptText" label="提示词">
          <el-input v-model="aigcForm.promptText" placeholder="提示词" clearable></el-input>
          <div>
            目录仅支持英文。如：a photo of an astronaut riding a horse on mars
          </div>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item prop="imgFile" label="上传图片">
          <div>
            <el-upload ref="upload"
                       v-model="aigcForm.imgFile"
                       :auto-upload="false" :limit="1"
                       :on-change="fileUploadChanges"
                       :on-success="handleFileSuccess"
                       :show-file-list="true"
                       accept=".jpg,.jpeg,.png" drag class="upload-file">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处,或<em>点击上传</em>,<span>仅允许导入jpg, jpeg, png格式文件。文件不能超过20M</span>
              </div>
            </el-upload>
            <span>注意：第一次执行时，会下载相关文件，如果网络不好下载不下来，后台会报错。</span>
          </div>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item>
          <el-button type="primary" @click="submitHandle()">提交</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </el-card>
  <template>
    <div style="margin-left: 20px;">
      <div style="font-size: 20px; font-weight: bold; position:relative; margin-top: 20px; display: flex;">生成结果
      </div>
      <el-image style="position: relative; width: 500px; height: 500px; display: flex;" :src="resultFile"/>
    </div>
  </template>
</template>

<script setup lang="ts" name="aigcIndex">
import { reactive, ref } from 'vue'
import store from "@/store";
import service from '@/utils/request'

const aigcFormRef = ref()
const aigcForm = reactive({
  promptText: '',
  imgFile: null
})

const resultFile = ref()

// 文件上传成功处理
const handleFileSuccess = (response, file, fileList) => {
  this.$refs.upload.clearFiles()
  resultFile = response.data.result
  console.log("handleFileSuccess", response)
}
//文件状态改变
const fileUploadChanges = (file, fileList) => {
  aigcForm.imgFile = file.raw
  console.log("fileUploadChanges", file)
}

const submitHandle = () => {
  // fromSubmit(aigcForm).then((res) => {
  //   //
  //   console.log(res)
  // })

  console.log("submitHandle", aigcForm)
  return service.post('/aidet/text2img', aigcForm,{
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: store.userStore.token
    }
  }).then((res) => {
    console.log(res)
  })
}

// export const fromSubmit = (dataForm: any) => {
//   return service.post('/aidet/text2img', dataForm,{
//     headers: {
//       'Content-Type': 'multipart/form-data',
//       Authorization: store.userStore.token
//     }
//   })
// }

</script>
