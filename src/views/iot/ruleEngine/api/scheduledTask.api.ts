import request from '@/utils/iot/request'
import { AxiosPromise } from 'axios'

enum Api {
  list = '/iot/rule_engine/tasks/list',
  delete = '/iot/rule_engine/task/delete',
  save = '/iot/rule_engine/task/save',
  stop = '/iot/rule_engine/task/pause',
  resume = '/iot/rule_engine/task/resume',
  start = '/iot/rule_engine/task/renew',
  logList = '/iot/rule_engine/taskLogs/list',
  logClear = '/iot/rule_engine/taskLogs/clear',
}

export interface ITaskVO {
  actions: string
  config?: string | any[]
  createAt: number
  desc: string
  expression: string
  id: string
  name: string
  reason: string
  state: string
  type: string
  uid: string
}
// 获取列表
export const getTaskList = (data) => {
  return request({
    url: Api.list,
    method: 'POST',
    data,
  })
}

// 编辑、保存
export const saveTask = (data) => {
  return request({
    url: Api.save,
    method: 'POST',
    data,
  })
}
// 删除
export const deleteTask = (data) => {
  return request({
    url: Api.delete,
    method: 'POST',
    data,
  })
}
// 停止
export const stopTask = (data) => {
  return request({
    url: Api.stop,
    method: 'POST',
    data,
  })
}
// 恢复
export const reloadTask = (data) => {
  return request({
    url: Api.resume,
    method: 'POST',
    data,
  })
}
// 启动
export const startTask = (data) => {
  return request({
    url: Api.start,
    method: 'POST',
    data,
  })
}

// 获取日志
export const getTaskLog = (data) => {
  return request({
    url: Api.logList,
    method: 'post',
    data,
  })
}
// 清空日志
export const clearTaskLog = (data) => {
  return request({
    url: Api.logClear,
    method: 'post',
    data,
  })
}
