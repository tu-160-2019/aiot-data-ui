<template>
  <div>
    <div class="list-box">
      <el-collapse v-model="activeName">
        <el-collapse-item :name="index" v-for="(item, index) in list" :key="index">
          <template #title>
            <div class="flex" style="justify-content: space-between;width: 100%;">
              <div class="cu-title" @click.stop>
                <el-radio-group style="margin-right: 20px;" v-model="item.type" class="ml-4">
                  <el-radio label="device" size="large">设备监听</el-radio>
                </el-radio-group>
                <div class="item">
                  <select-product v-model:pk="item.pk" @on-select="(row) => handleSelectProduct(row)" />
                </div>
                <div class="item" v-if="item.pk">
                  <select-device v-model:dn="item.dn" placeholder="默认全部设备" :product-pk="item.pk || ''" @on-select="handleEmits" />
                </div>
              </div>
              <div style="padding-right: 10px;">
                <el-button @click="removeListener(index)">删除</el-button>
              </div>
            </div>
          </template>
          <div class="condition-box" v-if="item.pk">
            <div class="main">
              <div class="title">条件</div>
              <div class="main-box">
                <div class="box" v-for="(cond, condIndex) in item.conditions" :key="condIndex">
                  <div class="item">
                    <el-row style="width: 100%;">
                      <el-col :span="7">
                        <el-select v-model="cond.identifier" @change="(e) => conditionChange(cond, (stateMap.get(item.pk)?.modelItems || []), e)">
                          <el-option-group v-for="group in (stateMap.get(item.pk)?.modelItems || [])" :key="group.name" :label="group.name">
                            <el-option v-for="pro in group.items" :label="pro.name" :value="pro.identifier" :key="pro.identifier" />
                          </el-option-group>
                        </el-select>
                      </el-col>
                      <el-col :span="15" v-if="!cond?.identifier?.endsWith(':*')">
                        <el-row class="param-item" v-for="(param, paramIndex) in cond.parameters" :key="param.identifier">
                          <el-col :span="10" v-if="cond.identifier == 'report'">
                            <el-select v-model="param.identifier" style="width: 100%;">
                              <el-option
                                v-for="p in (stateMap.get(item.pk)?.properties || [])"
                                :label="p.name"
                                :value="p.identifier"
                                :key="p.identifier"
                              />
                            </el-select>
                          </el-col>
                          <el-col :span="6">
                            <el-select v-model="param.comparator">
                              <el-option v-for="cp in comparators" :label="cp.name" :value="cp.value" :key="cp.value" />
                            </el-select>
                          </el-col>
                          <el-col :span="5">
                            <el-input v-model="param.value" auto-complete="off" />
                          </el-col>
                          <el-col :span="1">
                            <el-button
                              style="margin-left: 6px;"
                              type="danger"
                              icon="Delete"
                              size="small"
                              circle
                              @click="removeParmeter(paramIndex, cond)"
                            />
                          </el-col>
                        </el-row>
                      </el-col>
                      <el-col :span="2" v-if="!cond?.identifier?.endsWith(':*') && cond.identifier">
                        <el-button type="primary" size="small" icon="Plus" circle @click="addParmeter(cond)" />
                      </el-col>
                    </el-row>
                  </div>
                  <el-button
                    type="danger"
                    size="small"
                    icon="Delete"
                    style="margin-left: 10px;"
                    @click="handleRemoveCondition(item, condIndex)"
                  ></el-button>
                </div>
              </div>
            </div>
            <el-button type="primary" size="small" style="margin-top: 12px;" @click="handleAddCondition(item)">新增条件</el-button>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <el-button style="margin-top: 10px;" @click="handleAdd">新增监听器</el-button>
  </div>
</template>
<script lang="ts" setup>
import { propTypes } from '@/utils/iot/propTypes'
import { getObjectModel } from '@/views/iot/equipment/api/products.api'
import { generateUUID } from '@/utils/iot'

import SelectProduct from '@/components/iot/YtSelect/select-product.vue'
import SelectDevice from '@/components/iot/YtSelect/select-device.vue'

const props = defineProps({
  listeners: propTypes.array.def([]),
})
const emits = defineEmits(['update:listeners'])
const arr: number[] = []
for (let i = 0; i < 100; i++) {
  arr.push(i)
}

const activeName = ref<number[]>(arr)
const list = ref<any[]>(props.listeners || [])

// 选择产品-调用物模型
const handleSelectProduct = (product) => {
  if (!product.productKey) return
  getProductObjectModel(product.productKey)
}

const getProductObjectModel = (pk) => {
  if (!pk) {
    return
  }
  getObjectModel(pk).then((res) => {
    const data = res.data || {}
    initThingModel(pk, data)
  })
}
const initThingModel = (pk, res) => {
  const state: any = {
    modelItems: [],
    properties: [],
    events: [],
    services: [],
  }

  state.modelItems.push({
    name: '通配',
    items: [
      {
        type: 'state',
        identifier: 'state:*',
        name: '设备上下线',
      },
      {
        type: 'event',
        identifier: 'event:*',
        name: '任意事件上报',
      },
      {
        type: 'service_reply',
        identifier: 'service_reply:*',
        name: '任意服务回复',
      },
    ],
  })

  let items: any[] = []
  state.modelItems.push({
    name: '精确匹配',
    items: items,
  })
  items.push({
    type: 'property',
    identifier: 'report',
    name: '属性上报',
  })
  res?.model?.events &&
    res.model.events.forEach((s) => {
      items.push({
        type: 'event',
        identifier: s.identifier,
        name: s.name,
      })
    })
  res.model.services &&
    res.model.services.forEach((s) => {
      items.push({
        type: 'service',
        identifier: s.identifier,
        name: s.name,
      })
    })

  state.properties.push({
    identifier: '*',
    name: '任意',
  })
  res?.model?.properties &&
    res.model.properties.forEach((p) => {
      state.properties.push({
        identifier: p.identifier,
        name: p.name,
      })
    })

  res?.model?.events &&
    res.model.events.forEach((s) => {
      let items: any[] = []
      state.events.push({
        identifier: s.identifier,
        items: items,
      })

      s.outputData.forEach((p) => {
        items.push({
          identifier: p.identifier,
          name: p.name,
        })
      })
    })

  res?.model?.services &&
    res.model.services.forEach((s) => {
      let items: any[] = []
      state.services.push({
        identifier: s.identifier,
        items: items,
      })

      s.outputData.forEach((p) => {
        items.push({
          identifier: p.identifier,
          name: p.name,
        })
      })
    })
  stateMap.value.set(pk, state)
  handleEmits()
}

const stateMap = ref(new Map())
const handleEmits = () => {
  const arr = toRaw(list.value).map((m) => {
    let config = m
    console.log('config:', config)
    if (config.config) {
      config = JSON.parse(config.config || '{}')
    }
    if (!stateMap.value.has(config.pk)) getProductObjectModel(config.pk)
    return {
      ...config,
    }
  })
  list.value = arr
  emits('update:listeners', arr)
}
watch(
  () => list.value.length,
  (newV) => {
    handleEmits()
  },
  {
    immediate: true,
    // deep: true,
  }
)
// 新增监听器
const handleAdd = () => {
  list.value.push({
    type: 'device',
    conditions: [
      {
        parameters: [],
      },
    ],
  })
}

// 删除监听器
const removeListener = (index: number) => {
  list.value.splice(index, 1)
}
// 条件
const comparators = ref([
  {
    name: '大于',
    value: '>',
  },
  {
    name: '等于',
    value: '==',
  },
  {
    name: '小于',
    value: '<',
  },
  {
    name: '不等于',
    value: '!=',
  },
  {
    name: '包含',
    value: 'in',
  },
  {
    name: '不包含',
    value: 'notin',
  },
  {
    name: '相似',
    value: 'like',
  },
  {
    name: '任意',
    value: '*',
  },
])

const conditionChange = (cond, list, e) => {
  for (let i in list) {
    for (let k in list[i].items) {
      const item = list[i].items[k]
      if (item.identifier === e) {
        cond.type = item.type || ''
        return
      }
    }
  }
}

// 新增条件
const handleAddCondition = (item: any) => {
  if (!item.conditions) item.conditions = []
  item.conditions.push({})
}
// 删除条件
const handleRemoveCondition = (item: any, index: number) => {
  item.conditions.splice(index, 1)
}

// 新增参数
const addParmeter = (cond: any) => {
  if (!cond.parameters) cond.parameters = []
  cond.parameters.push({})
}
// 删除参数
const removeParmeter = (index: number, cond: any) => {
  cond.parameters.splice(index, 1)
}

onUnmounted(() => {
  console.log('onUnmounted')
  list.value = []
})
</script>

<style lang="scss" scoped>
.list-box {
  margin-top: 10px;
  .cu-title {
    width: calc(100% - 30px);
    cursor: auto;
    display: flex;
    align-items: center;
    .item {
      width: 250px;
      margin-right: 10px;
    }
  }
}
::v-deep(.el-collapse-item__header) {
  background-color: #f2f2f2;
  padding: 0 12px;
}
.condition-box {
  background-color: #f2f2f2;
  padding: 15px;
  border-top: 1px solid #d9d9d9;
  .main {
    border: 2px dashed rgb(217, 217, 217);
    .title {
      padding: 12px;
      color: #333;
      font-weight: 600;
      border-bottom: 1px solid rgb(217, 217, 217);
    }
    .main-box {
      padding: 10px;
      .box {
        display: flex;
        align-items: center;
        .item {
          border: 2px dashed rgb(217, 217, 217);
          padding: 6px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
          flex: 1;
          .param-item {
            margin-bottom: 8px;
          }
        }
        // .el-button {
        //   width: 50px;
        // }
      }
    }
  }
}
</style>
