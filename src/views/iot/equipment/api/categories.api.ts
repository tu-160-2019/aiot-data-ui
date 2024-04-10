import request from '@/utils/iot/request'
import { AxiosPromise } from 'axios'

enum Api {
  list = '/iot/product/category/list',
  del = '/iot/product/category/delete',
  save = '/iot/product/category/edit',
  all = '/iot/product/category/getAll',
}
export interface ICategoriesVO {
  createAt: number
  createBy: number
  createDept: number
  createTime: string
  id?: string
  name: string
  updateBy: number
  updateTime: string
}

interface IPage {
  pageSize: number
  pageNum: number
}
// 获取列表
export const getCategoriesList = (data?: IPage): AxiosPromise<any> => {
  return request({
    url: Api.list,
    method: 'post',
    data,
  })
}

// 获取所有
export const getCategoriesAll = (): AxiosPromise<ICategoriesVO[]> => {
  return request({
    url: Api.all,
    method: 'post',
  })
}

// 删除
export const deleteCategories = (data: (string | number)[]) => {
  return request({
    url: Api.del,
    method: 'post',
    data,
  })
}

// 编辑、保存
export const saveCategories = (data: ICategoriesVO) => {
  return request({
    url: Api.save,
    method: 'post',
    data,
  })
}
