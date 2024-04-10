// 设备Api
import request from '@/utils/iot/request'
import { AxiosPromise } from 'axios'

enum Api {
  devicesList = '/iot/device/list',
  devicesDel = '/iot/device/delete',
  devicesBatchDel = '/iot/device/batchDelete',
  devicesAdd = '/iot/device/add',
  devicesUpdate = '/iot/device/save',
  devicesUnbind = '/iot/device/unbind',
  devicesDetail = '/iot/device/detail',
  devicesTagAdd = '/iot/device/tag/add',
  deviceConfigSave = '/iot/device/config/save',
  deviceSimulateSend = '/iot/device/simulateSend',
  devicePropertyLogs = '/iot/device/deviceProperty/log/list',
  deviceConfigGet = '/iot/device/config/get',
  deviceConfigSend = '/iot/device/config/send',
  propertySet = '/iot/device/service/property/set',
  propertyGet = '/iot/device/service/property/get',
  deviceLogs = '/iot/device/deviceLogs/list',
  serviceInvoke = '/iot/device/service/invoke',
  childrenDeviceList = '/iot/device/children/list',
  childrenDevice = '',
  getParentDevices = '/iot/device/getParentDevices',

  deviceGroupsList = '/iot/device/groups/list',
  deviceGroupsAdd = '/iot/device/group/add',
  deviceGroupsUpdate = '/iot/device/group/edit',
  deviceGroupsDel = '/iot/device/group/delete',
  deviceGroupsClear = '/iot/device/group/clear',
  deviceGroupsAddDevices = '/iot/device/group/addDevices',
  deviceGroupsRemoveDevices = '/iot/device/group/removeDevices',
}
export interface IDevicesVO {
  id: number | string
  createAt: number
  createBy: number
  createDept: number
  createTime: string
  deviceId: string
  deviceName: string
  model: string
  offlineTime: number
  onlineTime: number
  parentId: string
  productKey: string
  secret: string
  state: string
  uid: string
  updateBy: number
  updateTime: string
}

export interface IDeviceGroupVo {
  id: number | string
  createAt: number
  deviceQty: number
  name: string
  remark: string
  uid: string
}

// 获取列表
export const getDevicesList = (data): AxiosPromise<any> => {
  return request({
    url: Api.devicesList,
    method: 'post',
    data,
  })
}

// 删除
export const deleteDevices = (data: string) => {
  return request({
    url: Api.devicesDel,
    method: 'post',
    data,
  })
}
// 批量删除
export const deleteBatchDevices = (data: (string | number)[]) => {
  return request({
    url: Api.devicesBatchDel,
    method: 'post',
    data,
  })
}

// 编辑、保存
export const saveDevices = (data: IDevicesVO) => {
  return request({
    url: data.id ? Api.devicesUpdate : Api.devicesAdd,
    method: 'post',
    data,
  })
}

// 解绑
export const unbindDevice = (data: string) => {
  return request({
    url: Api.devicesUnbind,
    method: 'post',
    data,
  })
}

// 获取设备详情
export const getDevicesDetail = (data) => {
  return request({
    url: Api.devicesDetail,
    method: 'post',
    data,
  })
}
// 添加设备标签
export const devicesTagAdd = (data) => {
  return request({
    url: Api.devicesTagAdd,
    method: 'post',
    data,
  })
}

// 模拟上报
export const deviceSimulateSend = (data) => {
  return request({
    url: Api.deviceSimulateSend,
    method: 'post',
    data,
  })
}
// 设备属性设置
export const propertySet = (data) => {
  return request({
    url: Api.propertySet,
    method: 'post',
    data,
  })
}

export const propertyGet = (data) => {
  return request({
    url: Api.propertyGet,
    method: 'post',
    data,
  })
}

// 设备日志查询
export const deviceLogs = (data) => {
  return request({
    url: Api.deviceLogs,
    method: 'post',
    data,
  })
}
// 设备服务调用
export const serviceInvoke = (data) => {
  return request({
    url: Api.serviceInvoke,
    method: 'post',
    data,
  })
}
// 获取子设备列表
export const getChildrenDeviceList = (data) => {
  return request({
    url: Api.childrenDeviceList,
    method: 'post',
    data,
  })
}
// 设备配置保存
export const saveDeviceConfig = (data) => {
  return request({
    url: Api.deviceConfigSave,
    method: 'post',
    data,
  })
}
// 获取设备配置
export const getDeviceConfig = (data) => {
  return request({
    url: Api.deviceConfigGet,
    method: 'post',
    data,
  })
}
// 设备配置下发
export const sendDeviceConfig = (data) => {
  return request({
    url: Api.deviceConfigSend,
    method: 'post',
    data,
  })
}

// 获取属性日志
export const devicePropertyLogs = (data) => {
  return request({
    url: Api.devicePropertyLogs,
    method: 'post',
    data,
  })
}

// 获取网关设备
export const getParentDevices = () => {
  return request({
    url: Api.getParentDevices,
    method: 'post',
  })
}


// 获取设备分组列表
export const getDeviceGroupsList = (data): AxiosPromise<any> => {
  return request({
    url: Api.deviceGroupsList,
    method: 'post',
    data,
  })
}


// 编辑、保存设备分组
export const saveDeviceGroup = (data: IDeviceGroupVo) => {
  return request({
    url: data.id ? Api.deviceGroupsUpdate : Api.deviceGroupsAdd,
    method: 'post',
    data,
  })
}

// 删除设备分组
export const deleteDeviceGroup = (data: string) => {
  return request({
    url: Api.deviceGroupsDel,
    method: 'post',
    data,
  })
}

// 删除设备分组
export const clearDeviceGroup = (data: string) => {
  return request({
    url: Api.deviceGroupsClear,
    method: 'post',
    data,
  })
}

// 清空组下所有设备
export const addDevicesGroup = (data: string) => {
  return request({
    url: Api.deviceGroupsClear,
    method: 'post',
    data,
  })
}

// 添加设备到组
export const addDeviceToDeviceGroup = (data) => {
  return request({
    url: Api.deviceGroupsAddDevices,
    method: 'post',
    data,
  })
}

// 将设备从组中移除
export const removeDeviceFromDeviceGroup = (data) => {
  return request({
    url: Api.deviceGroupsRemoveDevices,
    method: 'post',
    data,
  })
}
