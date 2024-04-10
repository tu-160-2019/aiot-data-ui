import { propTypes } from '@/utils/iot/propTypes'
import { PropType } from 'vue'
import { IColumn } from '../types/tableCommon'
import { AxiosPromise } from 'axios'

// 搜索组件参数
export const searchProps = {
  slot: propTypes.bool.def(false), // 搜索插槽
  loading: propTypes.bool.def(false), // 搜索loading
  labelWidth: propTypes.number.def(80), // 搜索label宽度
  clearable: propTypes.bool.def(true), // 搜索是否有控件取消
  query: propTypes.object.def({}), // 搜索参数
}

// 功能区组件参数
export const funProps = {
  // 布局
  gutter: propTypes.number.def(10),
  span: propTypes.number.def(1.5),
  // 按钮权限
  addPermi: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  delPermi: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  exportPermi: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  // 按钮显示
  addBtn: propTypes.bool.def(true),
  // 批量删除
  limit: propTypes.number.def(10),
  multipleSelection: propTypes.array.def([]),
  delBtn: propTypes.bool.def(false),
  // 导出
  exportBtn: propTypes.bool.def(false),
  // 按钮文字
  addBtnText: propTypes.string.def('新增'),
  delBtnText: propTypes.string.def('批量删除'),
  exportBtnText: propTypes.string.def('导出'),
  hide: propTypes.bool.def(false),
}

// 表格组件参数
export const tableProps = {
  width: propTypes.number || propTypes.string,
  size: propTypes.string.def('default '),
  align: propTypes.string.def('left'),
  columnKey: propTypes.string.def('id'),
  menuWidth: propTypes.number.def(220) || propTypes.string,
  // 自定义表格
  customTable: propTypes.bool.def(false),
  // 序号
  index: propTypes.bool.def(true),
  loading: propTypes.bool.def(false),
  // 多选
  selection: propTypes.bool.def(true),
  multipleSelection: propTypes.array.def([]),
  // 菜单
  menu: propTypes.bool.def(true),
  // 按钮权限
  viewPermi: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  delPermi: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  editPermi: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  // 按钮显示
  viewBtn: propTypes.bool.def(true),
  delBtn: propTypes.bool.def(true),
  editBtn: propTypes.bool.def(true),
  // 菜单插槽
  menuSlot: propTypes.bool.def(false),
  // 隐藏分页
  pageHide: propTypes.bool.def(false),
}

// 表单组件参数
export const formProps = {
  labelWidth: propTypes.string.def('120px'),
  clearable: propTypes.bool.def(true),
  width: propTypes.number.def(600) || propTypes.string,
  gutter: propTypes.number.def(0),
  colSpan: propTypes.number.def(24),
  loading: propTypes.bool.def(false),
}

export const crudProps = {
  data: {
    type: Object as PropType<Record<string, any>[]>,
    default: () => [],
  },
  column: {
    type: Array as PropType<IColumn[]>,
    default: () => [],
  },
  page: propTypes.object.def({
    pageNum: 1,
    pageSize: 10,
  }),
  total: propTypes.number.def(0),
  query: {
    type: Object,
    default: () => {},
  },
  loading: propTypes.bool.def(false),
  searchProps: Object,
  funProps: Object,
  tableProps: Object,
  formProps: Object,
}
