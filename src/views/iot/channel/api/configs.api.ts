// 通道配置Api
import request from '@/utils/iot/request'
import { AxiosPromise, AxiosResponse } from 'axios'

enum Api {
  list = '/iot/notify/channel/getList',
  getConfigList = '/iot/notify/channel/config/getList',
  getConfigAll = '/iot/notify/channel/config/getAll',
  addConfig = '/iot/notify/channel/config/add',
  getConfigById = '/iot/notify/channel/config/getById',
  delConfigById = '/iot/notify/channel/config/delById',
  getMsgList = '/iot/notify/message/getList',
}
export interface IChannelConfigsVO {
  id?: number
  channelId: number
  title: string
  param: string
  createAt: number
}
export interface IChannelsVO {
  id?: number
  code: string
  title: string
  icon: string
  createAt: number
}
export interface INotifyMessagesVO {
  id?: number
  content: string
  messageType: string
  status: boolean
  createAt: number
  updateAt: number
}

interface IPage {
  pageNum?: number
  pageSize?: number
}

// 获取通道列表
export const getChannelsList = (): AxiosPromise<IChannelsVO[]> => {
  return request({
    url: Api.list,
    method: 'post',
  })
}

// 获取通道配置分页列表
export const getConfigList = (data?: IPage): AxiosPromise<AxiosResponse<IChannelConfigsVO[]>> => {
  return request({
    url: Api.getConfigList,
    method: 'post',
    data,
  })
}

// 获取通道配置列表
export const getConfigAll = (): AxiosPromise<AxiosResponse<IChannelConfigsVO[]>> => {
  return request({
    url: Api.getConfigAll,
    method: 'post',
  })
}

// 保存修改通道配置
export const addConfig = (data: IChannelConfigsVO) => {
  return request({
    url: Api.addConfig,
    method: 'post',
    data: data,
  })
}

// 根据ID获取通道配置
export const getConfigById = (data: string | number): AxiosPromise<AxiosResponse<IChannelConfigsVO>> => {
  return request({
    url: Api.getConfigById,
    method: 'post',
    data: data,
  })
}

// 删除通道配置
export const delConfigById = (data: string | number) => {
  return request({
    url: Api.delConfigById,
    method: 'post',
    data: data,
  })
}

// 获取消息分页列表
export const getMsgs = (data?: IPage): AxiosPromise<AxiosResponse<INotifyMessagesVO[]>> => {
  return request({
    url: Api.getMsgList,
    method: 'post',
    data: data,
  })
}
