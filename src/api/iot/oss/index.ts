import request from '@/utils/request'
import { OssQuery, OssVO } from './types'
import { AxiosPromise } from 'axios'

// 查询OSS对象存储列表
export function listOss(query: OssQuery): AxiosPromise<OssVO[]> {
  return request({
    url: '/resource/oss/list',
    method: 'post',
    data: query,
  })
}

// 查询OSS对象基于id串
export function listByIds(ossId: string | number): AxiosPromise<OssVO[]> {
  return request({
    url: '/resource/oss/listByIds',
    method: 'post',
    data: [ossId],
  })
}

// 删除OSS对象存储
export function delOss(ossId: string | number | Array<string | number>) {
  return request({
    url: '/resource/oss/delete',
    method: 'post',
    data: ossId,
  })
}
