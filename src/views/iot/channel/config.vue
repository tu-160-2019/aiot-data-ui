<template>
  <yt-crud
    ref="crudRef"
    :data="data"
    :column="column"
    v-model:page="state.page"
    v-model:query="state.query"
    :total="state.total"
    :loading="state.loading"
    :table-props="{
        selection: false,
      }"
    @onLoad="getData"
    @saveFun="onSave"
    @delFun="onDelete"
  >
    <template #paramFormItem="{ row }">
      <el-card v-if="row.channelId" class="box-card" shadow="never">
        <template #header>
          <div class="clearfix">
            <span>参数配置</span>
          </div>
        </template>
        <div v-for="item in state.typeObj" :key="item.code">
          <div v-if="item.code === getChannelCode(row.channelId)">
            <el-form-item v-for="opt in item.list" :key="opt.value" :label="opt.label + ':'">
              <el-switch v-if="opt.type === 'switch'" v-model="row.param[opt.value]" />
              <el-input v-else v-model="row.param[opt.value]" :placeholder="'请输入' + opt.label" />
            </el-form-item>
          </div>
        </div>
      </el-card>
    </template>
  </yt-crud>
</template>
<script lang="ts" setup>
import { IColumn } from '@/components/iot/common/types/tableCommon'

import YtCrud from '@/components/iot/common/yt-crud.vue'
import { getConfigList, getChannelsList, IChannelsVO, addConfig, delConfigById, IChannelConfigsVO } from './api/configs.api'

const data = ref<IChannelConfigsVO[]>([])
const channelOptions = ref<IChannelsVO[]>([])
const state = reactive({
  total: 0,
  page: {
    pageSize: 10,
    pageNum: 1,
  },
  query: {},
  loading: false,
  typeObj: [
    {
      code: 'Email',
      list: [
        {
          label: '邮件发送人',
          value: 'from',
        },
        {
          label: '邮件主机',
          value: 'host',
        },
        {
          label: '用户名',
          value: 'userName',
        },
        {
          label: '密码',
          value: 'passWord',
        },
        {
          label: '邮件授权',
          value: 'mailSmtpAuth',
          type: 'switch',
        },
        {
          label: '邮件接收人',
          value: 'to',
        },
      ],
    },
    {
      code: 'QyWechat',
      list: [
        {
          label: '机器人webhook',
          value: 'qyWechatWebhook',
        },
      ],
    },
    {
      code: 'DingTalk',
      list: [
        {
          label: '机器人webhook',
          value: 'dingTalkWebhook',
        },
      ],
    },
  ],
  channelCode: '',
})
const column = ref<IColumn[]>([
  {
    label: '通道配置名称',
    key: 'title',
    tableWidth: 200,
    search: true,
    rules: [{ required: true, message: '通道配置名称不能为空' }],
  },
  {
    label: '通道类型',
    key: 'channelId',
    tableWidth: 150,
    type: 'select',
    rules: [{ required: true, message: '请选择类型' }],
    componentProps: {
      labelAlias: 'title',
      valueAlias: 'id',
    },
  },
  {
    label: '通道参数',
    key: 'paramStr',
    formHide: true,
  },
  {
    label: '参数配置',
    key: 'param',
    hide: true,
    formItemSlot: true,
    componentProps: {
      defaultValue: {},
    },
  },
])

const getData = () => {
  state.loading = true
  getConfigList({
    ...state.page,
    ...state.query,
  })
    .then((res) => {
      data.value =
        res.data.rows?.map((m) => ({
          ...m,
          paramStr: m.param,
          param: JSON.parse(m.param),
        })) || []
      state.total = res.data.total
    })
    .finally(() => {
      state.loading = false
    })
}

const getChannelCode = (id: number) => {
  const obj = channelOptions.value.find((f) => f.id == id)
  return obj?.code || ''
}

// 获取通道类型
const getChannel = () => {
  getChannelsList().then((res) => {
    console.log(res.data)
    channelOptions.value = res.data || []
    column.value.forEach((item) => {
      if (item.key === 'channelId') {
        item.componentProps.options = channelOptions.value.map((m) => ({
          ...m,
          id: (m.id || '').toString(),
        }))
      }
    })
  })
}
getChannel()

// 保存数据
const onSave = ({ type, data, cancel }: any) => {
  state.loading = true
  let data2: any = {}
  for (let p in data) {
    data2[p] = data[p]
  }
  data2['param'] = JSON.stringify(data['param'])

  addConfig(data2)
    .then((res) => {
      ElMessage.success(type === 'add' ? '添加成功' : '编辑成功')
      cancel()
      getData()
    })
    .finally(() => {
      state.loading = false
    })
}

// 删除
const onDelete = async (row: any) => {
  state.loading = true
  await delConfigById(row.id)
  ElMessage.success('删除成功!')
  state.loading = false
  getData()
}
</script>

<!-- <style lang="scss" scoped>

</style> -->
