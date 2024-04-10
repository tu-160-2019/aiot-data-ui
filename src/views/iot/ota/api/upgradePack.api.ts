import request from '@/utils/iot/request'

enum Api {
  list = '/iot/ota/package/getList',
  del = '/iot/ota/package/delById',
  add = '/iot/ota/package/add',
  upgrade = '/iot/ota/device/upgrade',
  upload = '/iot/ota/package/upload',
  devices = '/iot/device/list',
  lot = '/iot/ota/device/info',
  result = '/iot/ota/device/detail',
}

// 获取列表
export const getUpgradePack = (data) => {
  return request({
    url: Api.list,
    method: 'post',
    data,
  })
}

// 删除
export const delUpgradePack = (data) => {
  return request({
    url: Api.del,
    method: 'post',
    data,
  })
}
// 新增
export const addUpgradePack = (data) => {
  return request({
    url: Api.add,
    method: 'post',
    data,
  })
}
// 升级
export const upgradeUpgradePack = (data) => {
  return request({
    url: Api.upgrade,
    method: 'post',
    data,
  })
}
// 上传
export const uploadUpgradePack = (data) => {
  return request({
    url: Api.upload,
    method: 'post',
    data,
  })
}
// 结果
export const resultUpgradePack = (data) => {
  return request({
    url: Api.result,
    method: 'post',
    data,
  })
}

// 获取升级包设备
export const getDevices = (data) => {
  return request({
    url: Api.devices,
    method: 'post',
    data,
  })
}

// 设备升级批次查询
export const getUpgradePackLot = (data) => {
  return request({
    url: Api.lot,
    method: 'post',
    data,
  })
}
