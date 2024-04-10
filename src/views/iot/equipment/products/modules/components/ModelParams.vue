<template>
  <div style="width: 100%;">
    <el-table v-if="!state.showPropertyParam" size="small" :data="modelParams" highlight-current-row border style="width: 100%;">
      <el-table-column prop="name" label="参数名称" width="100" />
      <el-table-column prop="identifier" label="标识符" width="180" />
      <el-table-column prop="description" label="描述" width="100"> </el-table-column>
      <el-table-column prop="dataType.type" label="类型" width="80" />
      <el-table-column label="操作">
        <template v-slot:header>
          <el-button @click="addParams" type="primary" size="small" plain>添加参数</el-button>
        </template>
        <template #default="scope">
          <el-button size="small" @click="handleParamEdit(scope.$index, scope.row)">编辑</el-button>
          <el-popconfirm title="确认要删除该功能吗？" @confirm="deleteParam(scope.$index)">
            <template #reference>
              <el-button size="small" plain type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-tabs v-if="state.showPropertyParam" type="border-card">
      <el-tab-pane label="参数设置">
        <property-model
          ref="propertyModelRef"
          :property="state.currParamProperty"
          :enumItems="state.enumItems"
          :boolItem="state.boolItem"
          :isProperty="false"
          :is-update="!state.isAdd"
        />
        <el-row>
          <el-col :span="16" />
          <el-col :span="8">
            <el-button size="small" @click="cancelEditParam()">取消</el-button>
            <el-button size="small" @click="saveParam()" type="primary">保存</el-button>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts" setup>
import { propTypes } from '@/utils/iot/propTypes'
import PropertyModel from './PropertyModel.vue'
import { ParseProperty } from '@/views/iot/equipment/products/util'

const props = defineProps({
  modelParams: {
    type: Array,
    default: () => [],
  },
  isUpdate: propTypes.bool.def(false),
})
const modelParamsRef = ref<any>(props.modelParams)
const propertyModelRef = ref()
const state = reactive({
  showPropertyParam: false,
  isAdd: true,
  currParamProperty: {
    name: '',
    identifier: '',
    description: '',
    type: 'property',
    dataType: {}
  },
  enumItems: [{}],
  boolItem: {
    _true: '',
    _false: ''
  }
})

const handleParamEdit = (index: number, row: any) => {
  state.isAdd = false
  state.showPropertyParam = true
  state.currParamProperty = row

  let specs = row.dataType.specs
  if (row.dataType.type == 'enum' && specs) {
    let enumSpecs: any[] = []
    for (var p in specs) {
      enumSpecs.push({
        name: specs[p],
        value: p
      })
      state.enumItems = enumSpecs
    }
  }
  if (row.dataType.type == 'bool' && specs) {
    state.boolItem = {
      _true: specs['0'],
      _false: specs['1']
    }
  }

}
const addParams = () => {
  state.isAdd = true
  state.showPropertyParam = true
  state.currParamProperty = {
    name: '',
    identifier: '',
    description: '',
    type: 'property',
    dataType: {
      specs: {}
    }
  }

  state.enumItems = [{}]
  state.boolItem = {
    _true: '',
    _false: ''
  }
}
function deleteParam(index: number) {
  modelParamsRef.value.splice(index, 1)
}
function cancelEditParam() {
  state.showPropertyParam = false
}
function newProperty() {
  return ParseProperty(state.currParamProperty, state.enumItems, state.boolItem)
}
async function saveParam() {
  const valid = await propertyModelRef.value.validate()
  if (!valid) return
  if (state.isAdd) {
    modelParamsRef.value.push(newProperty())
  } else {
    let prop = newProperty() as any
    for (var i = 0; i < modelParamsRef.value.length; i++) {
      if (modelParamsRef.value[i].identifier == prop.identifier) {
        modelParamsRef.value[i] = prop
      }
    }
  }

  state.showPropertyParam = false
}
</script>
