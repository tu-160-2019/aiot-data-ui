import { FormItemRule } from 'element-plus'
import { Arrayable } from 'element-plus/es/utils'

export type TFormType =
  | 'string'
  | 'select'
  | 'date'
  | 'switch'
  | 'number'
  | 'color'
  | 'rate'
  | 'slider'
  | 'selectV2'
  | 'checkbox'
  | 'cascader'
  | 'radio'
  | 'radioButton'
  | 'checkbox'
  | 'checkboxButton'
  | 'treeSelect'
  | 'upload'
  | 'image'
  | 'cron'

export interface IColumn {
  label: string // 搜索名称
  key: string // 搜索key
  type?: TFormType // 数据类型
  align?: 'left' | 'center' | 'right' // 表格对齐
  slot?: boolean // 是否用插槽
  componentProps?: any // 组件props
  search?: boolean // 是否搜索
  searchLabelWidth?: number // 搜索label宽度
  rules?: Arrayable<FormItemRule> // form表单校验
  hide?: boolean // 表格隐藏项
  formHide?: boolean // 表单隐藏项
  tableWidth?: number | string // 表格宽度
  sortable?: boolean // 表格列排序
  editDisabled?: boolean // 编辑禁用
  addDisabled?: boolean // 添加禁用
  editHide?: boolean // 编辑隐藏
  addHide?: boolean // 添加隐藏
  searchSlot?: boolean // 搜索插槽
  formSlot?: boolean // form插槽
  colSpan?: number // form span 默认24
  formItemSlot?: boolean // formItem替换插槽
  formWatch?: (scope: any) => void // form监听
}
