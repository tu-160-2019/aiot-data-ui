<template>
  <div class="app-container">
    <div style="display: flex;">
      <div>
        <div style="font-size: 20px; font-weight: bold;">上传图片</div>
        <el-upload ref="upload"
                   :action="uploadFileUrl"
                   :headers="form.headers"
                   :auto-upload="true" :disabled="false" :limit="1"
                   :on-change="fileUploadChanges" :on-progress="handleFileUploadProgress"
                   :on-success="handleFileSuccess"
                   :show-file-list="true"
                   accept=".jpg,.jpeg,.png" drag class="upload-file">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处,或<em>点击上传</em>,<span>仅允许导入jpg, jpeg, png格式文件。文件不能超过20M</span>
          </div>
        </el-upload>
      </div>
      <div style="font-size: 20px; font-weight: bold; margin-left: 20px; margin-top: 40px;">
        烟火检测.
        <br> <p style="color: red;">想要效果好，需要自行提供高质量数据集进行二次训练</p>
      </div>
    </div>
    <div style="display: flex;">
      <div>
        <div style="font-size: 20px; font-weight: bold; position:relative; margin-top: 20px; display: flex;">原图片
        </div>
        <el-image style="position: relative; width: 500px; height: 500px; display: flex;" :src="originFile"/>
      </div>
      <div style="margin-left: 20px;">
        <div style="font-size: 20px; font-weight: bold; position:relative; margin-top: 20px; display: flex;">检测结果
        </div>
        <el-image style="position: relative; width: 500px; height: 500px; display: flex;" :src="resultFile"/>
      </div>

    </div>
  </div>
</template>

<script>

import store from '@/store'
import cache from '@/utils/cache'

export default {
  name: "helment",
  dicts: [],
  data() {
    return {
      //文件上传
      file: {},
      originFile: "",
      resultFile: "",
      uploadFileUrl: import.meta.env.VITE_API_URL + "/aidet/fireSmoke", // 上传的图片服务器地址
      form: {
        imageFile: "",
        headers: {
          Authorization: store.userStore.token
        },
        url:
          import.meta.env.VITE_API_URL + "/aidet/fireSmoke",
      },
      //快捷生成
      content: {},
    };
  },
  created() {
  },
  watch: {},
  methods: {
    isEmptyStr(s) {
      if (s == undefined || s == null || s == '') {
        return true
      }
      return false
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.form.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.$refs.upload.clearFiles();
      this.originFile = response.data.origin;
      this.resultFile = response.data.result;
      console.log("handleFileSuccess", response)
    },
    //文件状态改变
    fileUploadChanges(file, fileList) {
      this.file = file
      console.log("fileUploadChanges", file)
    },
  },
};
</script>
<style lang="scss" scoped>
.disply {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  .small {
    width: calc(50% - 5px);
  }
}

.upload-file {
  position: relative;
  margin-top: 10px;
  left: 1px;
}
</style>
