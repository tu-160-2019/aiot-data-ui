// 通讯组件Api
import request from '@/utils/iot/request'
import { AxiosPromise, AxiosResponse } from 'axios'

enum Api {
  list = '/iot/plugin/list',
  add = '/iot/plugin/add',
  edit = '/iot/plugin/edit',
  delete = '/iot/plugin/delete',
  detail = '/iot/plugin/detail',
  changeState = '/iot/plugin//changeState',
  saveScript = '/iot/plugin/saveScript',
}

export interface IPluginVO {
  id: number
  pluginId: string
  name: string
  file: string
  version: string
  description: string
  deployType: string
  type: string
  protocol: string
  state: string
  configSchema: string
  config: string
  script: string
  createTime: number
}

interface IPage {
  pageNum?: number
  pageSize?: number
}

// 获取列表
export const getPluginList = (): AxiosPromise<AxiosResponse<IPluginVO[]>> => {
  return request({
    url: Api.list,
    method: 'post',
  })
}

// 删除
export const deletePlugin = (data: (string | number)[]) => {
  return request({
    url: Api.delete,
    method: 'post',
    data,
  })
}

// 编辑
export const editPlugin = (data: any) => {
  return request({
    url: Api.edit,
    method: 'post',
    data,
  })
}
// 新增
export const addPlugin = (data: IPluginVO) => {
  return request({
    url: Api.add,
    method: 'post',
    data,
  })
}

// 状态更改
export const changeState = (data) => {
  return request({
    url: Api.changeState,
    method: 'post',
    data,
  })
}

// 获取详情
export const getDetail = (data: string | number) => {
  return request({
    url: Api.detail,
    method: 'post',
    data,
  })
}

// 保存组件脚本
export const saveScript = (data) => {
  return request({
    url: Api.saveScript,
    method: 'post',
    data,
  })
}
