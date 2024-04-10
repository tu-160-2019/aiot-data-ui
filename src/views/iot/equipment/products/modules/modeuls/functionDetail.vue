<template>
  <el-dialog
    v-model="state.dialogShow"
    width="950px"
    :title="!state.isAdd ? '编辑功能' : '新增功能'"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    append-to-body
    destroy-on-close
  >
    <el-form v-if="state.dialogShow" class="model-form" :rules="rules" label-width="120px" :model="state.modelForm" ref="modelFormRef">
      <el-form-item label="功能类型">
        <el-radio-group :disabled="!state.isAdd" v-model="state.modelForm.type" size="small">
          <el-radio-button label="property">属性</el-radio-button>
          <el-radio-button label="service">服务</el-radio-button>
          <el-radio-button label="event">事件</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <div v-if="isSelectType('property')">
        <property-model
          ref="propertyModelRef"
          :property="state.modelForm.raw"
          :enumItems="state.enumItems"
          :boolItem="state.boolItem"
          :isProperty="true"
          :isUpdate="!state.isAdd"
        />
      </div>
      <div v-if="isSelectType('service')">
        <div class="type-service">
          <el-form-item label="名称" prop="name">
            <el-input v-model="state.modelForm.name" auto-complete="off" />
          </el-form-item>
          <el-form-item label="标识符" prop="identifier">
            <el-input v-model="state.modelForm.identifier" auto-complete="off" />
          </el-form-item>
          <el-form-item label="输入参数" prop="inputData">
            <ModelParams :modelParams="state.modelForm.raw.inputData" :is-update="!state.isAdd" />
          </el-form-item>
          <el-form-item label="输出参数" prop="outputData">
            <ModelParams :modelParams="state.modelForm.raw.outputData" :is-update="!state.isAdd" />
          </el-form-item>
        </div>
      </div>
      <div v-if="isSelectType('event')">
        <div class="type-event">
          <el-form-item label="名称" prop="name">
            <el-input v-model="state.modelForm.name" auto-complete="off" />
          </el-form-item>
          <el-form-item label="标识符" prop="identifier">
            <el-input v-model="state.modelForm.identifier" auto-complete="off" />
          </el-form-item>
          <el-form-item label="输出参数" prop="outputData">
            <ModelParams :modelParams="state.modelForm.raw.outputData" />
          </el-form-item>
        </div>
      </div>
      <el-form-item>
        <el-button @click="cancelEdit">取消</el-button>
        <el-button @click="saveThingModel()" type="primary">保存</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ParseProperty } from '@/views/iot/equipment/products/util'
import { saveObjectModel } from '../../../api/products.api'
import { propTypes } from '@/utils/iot/propTypes'

import PropertyModel from '../components/PropertyModel.vue'
import ModelParams from '../components/ModelParams.vue'
import { useEmitt } from '@/hooks/iot/useEmitt'
const props = defineProps({
  id: propTypes.string.def(''),
  model: propTypes.object.def({}),
})
const state = reactive({
  isAdd: true,
  data: {} as any,
  dialogShow: false,
  modelForm: {} as any,
  modelType: '1',
  model: {} as any,
  boolItem: {},
  enumItems: [{}],
  scriptRules: {
    model: [{ required: true, message: '设备型号不能为空', trigger: 'blur' }],
    script: [{ required: true, message: '脚本内容不能为空', trigger: 'blur' }],
  },
})
const rules = reactive({
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  identifier: [{ required: true, message: '请输入标识符', trigger: 'blur' }],
})

const modelFormRef = ref()
const openDialog = (row?: any, prop?: any) => {
  if (row) {
    state.modelForm = row
    state.isAdd = false
    state.modelType = row.model?.endsWith && row.model.endsWith('_default') ? '1' : '2'
    if (prop.enumItems) state.enumItems = prop.enumItems
    if (prop.boolItem) state.boolItem = prop.boolItem
  } else {
    state.isAdd = true
    state.modelForm = {
      type: 'property',
      identifier: '',
      name: '',
      raw: {
        name: '',
        identifier: '',
        description: '',
        type: 'property',
        dataType: {
          specs: {},
        },
        inputData: [],
        outputData: [],
        enumItems: [],
        boolItem: {
          _true: '',
          _false: '',
        },
      },
    }
  }
  state.model = props.model
  state.dialogShow = true
}
const cancelEdit = () => {
  state.dialogShow = false
}
const isSelectType = (type: string | number) => {
  return type == state.modelForm.type
}
const newProperty = () => {
  return ParseProperty(state.modelForm.raw, state.enumItems, state.boolItem)
}
const { emitter } = useEmitt()
const submitThingModelChange = () => {
  if (state.model) {
      state.model.services = state.model.services || []
      state.model.properties = state.model.properties || []
      state.model.events = state.model.events || []
  }
  saveObjectModel({
    productKey: props.id,
    model: JSON.stringify(state.model),
  }).then(() => {
    state.dialogShow = false
    cancelEdit()
  }).finally(()=>{
    emitter.emit('updateObjectModel')
  })
}
const propertyModelRef = ref()
const saveThingModel = async () => {
  const fun = state.modelForm.type == 'property' ? propertyModelRef.value.validate : modelFormRef.value.validate
  const valid = await fun()
  if (valid) {
    if (state.isAdd) {
      if (state.modelForm.type == 'property') {
        if (state.model.properties) {
          //删除旧的
          const idx = state.model.properties.findIndex((p: any) => p.identifier == state.modelForm.raw.identifier)
          if (idx >= 0) {
            state.model.properties.splice(idx, 1)
          }
        } else {
          state.model.properties = []
        }
        state.model.properties.push(newProperty())
      } else if (state.modelForm.type == 'service') {
        if (state.model.services) {
          //删除旧的
          const idx = state.model.services.findIndex((p: any) => p.identifier == state.modelForm.raw.identifier)
          if (idx >= 0) {
            state.model.services.splice(idx, 1)
          }
        } else {
          state.model.services = []
        }

        state.model.services.push({
          identifier: state.modelForm.identifier,
          name: state.modelForm.name,
          inputData: state.modelForm.raw.inputData,
          outputData: state.modelForm.raw.outputData,
        })
      } else if (state.modelForm.type == 'event') {
        if (state.model.events) {
          //删除旧的
          const idx = state.model.events.findIndex((p: any) => p.identifier == state.modelForm.raw.identifier)
          if (idx >= 0) {
            state.model.events.splice(idx, 1)
          }
        } else {
          state.model.events = []
        }

        state.model.events.push({
          identifier: state.modelForm.identifier,
          name: state.modelForm.name,
          outputData: state.modelForm.raw.outputData,
        })
      }
    } else {
      if (state.modelForm.type == 'property') {
        let prop = newProperty()
        for (var i = 0; i < state.model.properties?.length; i++) {
          if (state.model.properties[i].identifier == prop.identifier) {
            state.model.properties[i] = prop
          }
        }
      } else if (state.modelForm.type == 'service') {
        state.model.services?.forEach((s: any) => {
          if (s.identifier == state.modelForm.identifier) {
            s.identifier = state.modelForm.identifier
            s.name = state.modelForm.name
            s.inputData = state.modelForm.raw.inputData
            s.outputData = state.modelForm.raw.outputData
          }
        })
      } else if (state.modelForm.type == 'event') {
        state.model.events?.forEach((s: any) => {
          if (s.identifier == state.modelForm.identifier) {
            s.identifier = state.modelForm.identifier
            s.name = state.modelForm.name
            s.outputData = state.modelForm.raw.outputData
          }
        })
      }
    }
    submitThingModelChange()
  }
}

defineExpose({
  openDialog,
})
</script>
