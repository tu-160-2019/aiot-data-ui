<template>
  <div style="width: 100%">
    <el-form ref="formRef" class="model-form" :rules="rules" label-width="120px" :model="propertyRef">
      <el-form-item style="margin-bottom: 18px;" label="名称" prop="name">
        <el-input v-model="propertyRef.name" auto-complete="off" />
      </el-form-item>
      <el-form-item style="margin-bottom: 18px;" label="标识符" prop="identifier">
        <el-input :disabled="isUpdate" v-model="propertyRef.identifier" auto-complete="off" />
      </el-form-item>
      <el-form-item style="margin-bottom: 18px;" label="描述" prop="describe">
        <el-input v-model="propertyRef.description" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item style="margin-bottom: 18px;" label="单位" prop="describe">
        <el-input v-model="propertyRef.unit" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item style="margin-bottom: 18px;" label="数据类型" prop="dataType.type">
        <el-select v-model="propertyRef.dataType.type" placeholder="请选择数据类型">
          <el-option label="int32" value="int32" />
          <el-option label="float" value="float" />
          <el-option label="bool" value="bool" />
          <el-option label="enum" value="enum" />
          <el-option label="text" value="text" />
          <el-option label="date" value="date" />
          <el-option v-if="isProperty" label="position" value="position" />
        </el-select>
      </el-form-item>
      <el-form-item style="margin-bottom: 18px;" v-if="isSelectType('position')">
        <el-row :gutter="40" style="width: 100%;">
          <el-col :span="3">定位方式</el-col>
          <el-col :span="6">
            <el-select v-model="propertyRef.dataType.specs.locateType" placeholder="请选择定位方式">
              <el-option label="经纬度定位" value="lonLat" />
              <el-option label="基站信息定位" value="basestation" />
              <el-option label="IP信息定位" value="ipinfo" />
            </el-select>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item style="margin-bottom: 18px;" v-if="isSelectType('int32')">
        <el-col :span="3"> 取值范围 </el-col>
        <el-col :span="5">
          <el-input v-model="propertyRef.dataType.specs.min" placeholder="最小值" />
        </el-col>
        <el-col class="line" :span="1" style="text-align: center;">-</el-col>
        <el-col :span="5">
          <el-input v-model="propertyRef.dataType.specs.max" placeholder="最大值" />
        </el-col>
        <el-col :span="10"></el-col>
      </el-form-item>
      <el-form-item style="margin-bottom: 18px;" v-if="isSelectType('float')">
        <el-col :span="3"> 取值范围 </el-col>
        <el-col :span="3">
          <el-input v-model="propertyRef.dataType.specs.min" placeholder="最小值" />
        </el-col>
        <el-col class="line" :span="1" style="text-align: center;">-</el-col>
        <el-col :span="3">
          <el-input v-model="propertyRef.dataType.specs.max" placeholder="最大值" />
        </el-col>
        <el-col :span="1">&nbsp;</el-col>
        <el-col :span="10">
          <el-input v-model="propertyRef.dataType.specs.precision" placeholder="精度" style="margin-top: 6px">
            <template v-slot:append>(保留小数位,实际数据以int存储)</template>
          </el-input>
        </el-col>
      </el-form-item>
      <el-form-item style="margin-bottom: 10px;" v-if="isSelectType('bool')">
        <el-col :span="3">布尔值</el-col>
        <el-col :span="1"> 0 - </el-col>
        <el-col :span="3">
          <el-input v-model="boolItemRef._true" placeholder="如:否" />
        </el-col>
        <el-col :span="1">&nbsp; </el-col>
        <el-col :span="1"> 1 - </el-col>
        <el-col :span="3">
          <el-input v-model="boolItemRef._false" placeholder="如:是" />
        </el-col>
      </el-form-item>
      <el-form-item label=" " style="margin-bottom: 10px;" v-if="isSelectType('enum')">
        <el-col v-for="ei in enumItemsRef" :span="24" :key="ei.value">
          <el-row>
            <el-col :span="3"> 枚举值 </el-col>
            <el-col :span="3">
              <el-input type="number" v-model="ei.value" placeholder="如:0" />
            </el-col>
            <el-col :span="2"> &nbsp; </el-col>
            <el-col :span="3"> 枚举描述 </el-col>
            <el-col :span="5">
              <el-input v-model="ei.name" />
            </el-col>
            <el-col :span="1"> &nbsp; </el-col>
            <el-col :span="2">
              <el-button type="danger" plain @click="delEnum(ei)">删除</el-button>
            </el-col>
          </el-row>
        </el-col>
        <el-button @click="addEnumItem()" type="primary" plain>添加</el-button>
      </el-form-item>
      <el-form-item style="margin-bottom: 10px;" v-if="isSelectType('text')">
        <el-col :span="3">数据长度</el-col>
        <el-col :span="3">
          <el-input v-model="propertyRef.dataType.specs.length" placeholder="数据长度" />
        </el-col>
      </el-form-item>
      <el-form-item style="margin-bottom: 10px;" v-if="isSelectType('date')"> String类型的UTC时间戳（毫秒） </el-form-item>
      <el-form-item style="margin-bottom: 10px;" v-if="isProperty&&!isSelectType('position')" label="读写" prop="accessMode">
        <el-radio-group v-model="propertyRef.accessMode">
          <el-radio label="rw">读写</el-radio>
          <el-radio label="r">只读</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps({
  property: {
    type: Object,
    default: () => {},
  },
  enumItems: {
    type: Array,
    default: () => [],
  },
  boolItem: {
    type: Object,
    default: () => {},
  },
  isProperty: {
    typeof: Boolean,
    default: false,
  },
  isUpdate: {
    typeof: Boolean,
    default: false,
  },
})
const propertyRef = ref<any>(props.property)
const boolItemRef = ref<any>(props.boolItem)
const enumItemsRef = ref<any>(props.enumItems)
const formRef = ref()
const rules = reactive({
  description: [
    { required: false, message: '请输入描述', trigger: 'blur' },
  ],
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
  ],
  identifier: [
    { required: true, message: '请输入标识符', trigger: 'blur' },
  ],
  'dataType.type': [
    { required: true, message: '请选择数据类型', trigger: 'change' },
  ],
})
const validate = async () => {
  const data = await formRef.value.validate()
  return data
}
const isSelectType = (type: string | number) => {
  return type == propertyRef.value.dataType.type
  // return true;
}
const addEnumItem = () => {
  if (enumItemsRef.value.constructor === Array) {
    enumItemsRef.value.push({})
  }
}
const delEnum = (ei: any) => {
  let idx = enumItemsRef.value.findIndex((e: any) => e.value == ei.value)
  enumItemsRef.value.splice(idx, 1)
}

defineExpose({
  validate,
})
</script>

<style lang="scss" scoped>
::v-deep(.el-form-item) {
  .el-form-item {
    margin-bottom: 10px;
  }
}
</style>
