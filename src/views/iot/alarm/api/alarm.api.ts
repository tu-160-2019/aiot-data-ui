// 告警Api
import request from '@/utils/iot/request'

enum Api {
  configList = '/iot/alert/selectAlertConfigPage',
  configUpdate = '/iot/alert/updateAlertConfig',
  configAdd = '/iot/alert/createAlertConfig',
  configDelete = '/iot/alert/deleteAlertConfigById',
  msgList = '/iot/alert/selectAlertRecordPage',
}

// 获取告警配置列表
export const getConfigList = (data) => {
  return request({
    url: Api.configList,
    method: 'post',
    data,
  })
}
// 告警配置保存
export const saveConfig = (data) => {
  return request({
    url: data.id ? Api.configUpdate : Api.configAdd,
    method: 'post',
    data,
  })
}
// 告警配置删除
export const deleteConfig = (data) => {
  return request({
    url: Api.configDelete,
    method: 'post',
    data,
  })
}
// 告警消息
export const getMsgList = (data) => {
  return request({
    url: Api.msgList,
    method: 'post',
    data,
  })
}
