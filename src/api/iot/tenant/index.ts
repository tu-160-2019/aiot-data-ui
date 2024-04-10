import request from '@/utils/iot/request'
import { TenantForm, TenantQuery, TenantVO } from './types'
import { AxiosPromise } from 'axios'

// 查询租户列表
export function listTenant(query: TenantQuery): AxiosPromise<TenantVO[]> {
  return request({
    url: '/system/tenant/list',
    method: 'post',
    data: query,
  })
}

// 查询租户详细
export function getTenant(id: string | number): AxiosPromise<TenantVO> {
  return request({
    url: '/system/tenant',
    method: 'post',
    data: {
      id,
    },
  })
}

// 新增租户
export function addTenant(data: TenantForm) {
  return request({
    url: '/system/tenant',
    method: 'post',
    data,
  })
}

// 修改租户
export function updateTenant(data: TenantForm) {
  return request({
    url: '/system/tenant',
    method: 'post',
    data,
  })
}

// 租户状态修改
export function changeTenantStatus(id: string | number, tenantId: string | number, status: string) {
  const data = {
    id,
    tenantId,
    status,
  }
  return request({
    url: '/system/tenant/changeStatus',
    method: 'post',
    data,
  })
}

// 删除租户
export function delTenant(id: string | number | Array<string | number>) {
  return request({
    url: '/system/tenant/delete',
    method: 'post',
    data: [id],
  })
}

// 动态切换租户
export function dynamicTenant(tenantId: string | number) {
  return request({
    url: '/system/tenant/dynamic',
    method: 'post',
    data: tenantId,
  })
}

// 清除动态租户
export function dynamicClear() {
  return request({
    url: '/system/tenant/dynamic/clear',
    method: 'post',
  })
}

// 同步租户套餐
export function syncTenantPackage(tenantId: string | number, packageId: string | number) {
  const data = {
    tenantId,
    packageId,
  }
  return request({
    url: '/system/tenant/syncTenantPackage',
    method: 'post',
    data,
  })
}
