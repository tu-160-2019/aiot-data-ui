import { ElRadio, ElRadioButton, RadioProps } from 'element-plus'
import { defineComponent } from 'vue'
import { IColumn } from '../types/tableCommon'

export const useRenderRadio = () => {
  const renderRadioOptions = (item: IColumn) => {
    // 如果有别名，就取别名
    const labelAlias = item?.componentProps?.optionsAlias?.labelField
    const valueAlias = item?.componentProps?.optionsAlias?.valueField
    const Com = (item.type === 'radio' ? ElRadio : ElRadioButton) as ReturnType<typeof defineComponent>
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
    renderRadioOptions,
  }
}
