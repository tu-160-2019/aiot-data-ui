import { ElCheckbox, ElCheckboxButton } from 'element-plus'
import { defineComponent } from 'vue'
import { IColumn } from '../types/tableCommon'

export const useRenderCheckbox = () => {
  const renderCheckboxOptions = (item: IColumn) => {
    // 如果有别名，就取别名
    const labelAlias = item?.componentProps?.labelAlias
    const valueAlias = item?.componentProps?.valueAlias
    const Com = (item.type === 'checkbox' ? ElCheckbox : ElCheckboxButton) as ReturnType<typeof defineComponent>
    return item?.componentProps?.options?.map((option: any) => {
      const { ...other } = option
      return (
        <Com {...other} label={option[valueAlias || 'value']}>
          {option[labelAlias || 'label']}
        </Com>
      )
    })
  }

  return {
    renderCheckboxOptions,
  }
}
