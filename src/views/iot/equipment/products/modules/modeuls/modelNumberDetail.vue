<template>
  <el-dialog
    v-model="state.dialogShow"
    :title="(productModelForm.id ?'编辑' : '新增') + '型号转换脚本'"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    append-to-body
    destroy-on-close
  >
    <el-form v-if="state.dialogShow" ref="productModelFormRef" :model="productModelForm" :rules="state.scriptRules" label-width="80px">
      <el-form-item label="型号" style="width: 300px" prop="model">
        <el-radio v-model="state.modelType" label="1">默认</el-radio>
        <el-radio v-model="state.modelType" label="2">自定义</el-radio>
        <el-input v-if="state.modelType == '2'" v-model="productModelForm.model" size="small" />
      </el-form-item>
      <el-form-item v-if="state.modelType == '2'" label="型号名称" style="width: 300px" prop="name">
        <el-input v-model="productModelForm.name" size="small" />
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-radio-group v-model="productModelForm.state" size="small">
          <el-radio label="dev">开发</el-radio>
          <el-radio label="publish">发布</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="脚本" prop="script" class="product-script">
        <el-radio v-model="productModelForm.type" label="JavaScript">JavaScript</el-radio>
        <!-- <el-radio v-model="productModelForm.type" label="LuaScript">LuaScript</el-radio> -->
        <div style="width: 100%">
          <code-editor v-if="productModelForm.type === 'JavaScript'" mode="text/javascript" v-model:code="productModelForm.script"></code-editor>
          <code-editor v-if="productModelForm.type === 'LuaScript'" mode="text/x-lua" v-model:code="productModelForm.script"></code-editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSaveProductModel()">保存</el-button>
        <el-button @click="cancelProductModel()">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script lang="ts" setup>
import { saveProductModel } from '../../../api/products.api'

import CodeEditor from '@/components/iot/CodeEditor/index.vue'

const productModelForm = ref({
  id: '',
  model: 'default',
  name: '默认',
  productKey: '',
  script: '',
  type: 'JavaScript',
  state: 'dev',
})
const state = reactive({
  modelType: '1',
  data: {} as any,
  dialogShow: false,
  scriptRules: {
    model: [{ required: true, message: '设备型号不能为空', trigger: 'blur' }],
    script: [{ required: true, message: '脚本内容不能为空', trigger: 'blur' }],
  },
})
const emits = defineEmits(['onSuccess'])
const openDialog = (row?: any) => {
  if (row) {
    productModelForm.value = row
    state.modelType = row.model && row.model?.endsWith('_default') ? '1' : '2'
  }
  state.dialogShow = true
}
const cancelProductModel = () => {
  state.dialogShow = false
}
const productModelFormRef = ref()
const handleSaveProductModel = () => {
  if (state.modelType == '1') {
    productModelForm.value.model = productModelForm.value.productKey + '_default'
  }
  productModelFormRef.value.validate((valid: any) => {
    if (valid) {
      saveProductModel(productModelForm.value).then((res) => {
        ElMessage.success('保存成功')
        cancelProductModel()
        emits('onSuccess')
      })
      console.log(valid)
    }
  })
}

defineExpose({
  openDialog,
})
</script>
