// 产品Api
import request from '@/utils/iot/request'
import { AxiosPromise, AxiosResponse } from 'axios'

enum Api {
  list = '/iot/product/list',
  add = '/iot/product/add',
  edit = '/iot/product/edit',
  delete = '/iot/product/deleteProduct',
  objectModelList = '/iot/product/getThingModelByProductKey',
  saveObjectModel = '/iot/product/thingModel/save',
  productModelList = '/iot/product/getModelsByProductKey',
  productModelSave = '/iot/product/productModel/edit',
  productModelDelete = '/iot/product/productModel/delete',
}
export interface IProductsVO {
  id?: number
  productKey: string
  category: string
  createAt: number
  img: string
  name: string
  nodeType: number
  transparent: string
  isOpenLocate: boolean
  locateUpdateType: string
  uid: string
}
interface IPage {
  pageNum?: number
  pageSize?: number
}
// 获取列表
export const getProductsList = (data?: IPage): AxiosPromise<AxiosResponse<IProductsVO[]>> => {
  return request({
    url: Api.list,
    method: 'post',
    data,
  })
}

// 编辑、保存
export const saveProducts = (data: IProductsVO) => {
  return request({
    url: !data.id ? Api.add : Api.edit,
    method: 'post',
    data,
  })
}
export const deleteProduct = (data) => {
  return request({
    url: Api.delete,
    method: 'post',
    data,
  })
}
// 获取物模型
export const getObjectModel = (data: string | number) => {
  return request({
    url: Api.objectModelList,
    method: 'post',
    data,
  })
}

// 保存物模型
export const saveObjectModel = (data) => {
  return request({
    url: Api.saveObjectModel,
    method: 'post',
    data,
  })
}

// 获取型号
export const getProductModelList = (data) => {
  return request({
    url: Api.productModelList,
    method: 'post',
    data,
  })
}
// 保存型号
export const saveProductModel = (data) => {
  return request({
    url: Api.productModelSave,
    method: 'post',
    data,
  })
}

// 删除型号
export const deleteProductModel = (data: string | number) => {
  return request({
    url: Api.productModelDelete,
    method: 'post',
    data,
  })
}
