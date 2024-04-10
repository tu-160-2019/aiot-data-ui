import { searchProps } from './props/crudProps'
import { ElButton, ElForm, ElFormItem } from 'element-plus'
import { PropType } from 'vue'
import { IColumn } from '@/components/iot/common/types/tableCommon'
import { componentMap, renderOptions } from '@/components/iot/common/render/useRenderComponent'

export default defineComponent({
  name: 'YtTableSearch',
  props: {
    column: {
      type: Array as PropType<IColumn[]>,
      default: () => [],
    },
    ...searchProps,
  },
  emits: ['handleSearch', 'update:query'],
  setup(props, { slots, emit }) {
    // 表单数据
    const formModel = ref<Recordable>(props.query)
    const getAttr = (option: IColumn) => {
      return {
        clearable: props.clearable,
        placeholder: `${option.type === 'string' || !option.type ? '请输入' : '请选择'}${option.label}`,
        ...option.componentProps,
      }
    }
    const queryFormRef = ref()
    const handleQuery = () => {
      emit('handleSearch', formModel.value)
    }
    // watch(
    //   () => formModel,
    //   (newV) => {
    //     emit('update:query', newV.value || {})
    //   },
    //   {
    //     immediate: true,
    //     deep: true,
    //   }
    // )
    const resetQuery = () => {
      queryFormRef.value.resetFields()
      handleQuery()
    }
    const searchData = ref<IColumn[]>([])
    props.column.forEach((item: IColumn) => {
      if (item.search) {
        searchData.value.push(item)
      }
    })

    return () => {
      return (
        searchData.value?.length > 0 && (
          <div class="search">
            <ElForm ref={queryFormRef} inline={true} labelWidth={props.labelWidth} model={formModel}>
              {searchData.value.map((m: IColumn) => {
                const type = m?.type || 'string'
                const Com = componentMap.get(type) as ReturnType<typeof defineComponent>
                return (
                  <ElFormItem
                    label={m.label + ':'}
                    labelWidth="auto"
                    prop={m.key}
                    style={{
                      marginBottom: 0,
                    }}
                  >
                    {!m.searchSlot ? (
                      <Com v-model={formModel.value[m.key]} {...getAttr(m)}>
                        {renderOptions(m)}
                      </Com>
                    ) : (
                      slots[m.key + 'Search']?.({
                        column: m,
                        row: formModel.value,
                      })
                    )}
                  </ElFormItem>
                )
              })}
              <ElFormItem
                style={{
                  marginBottom: 0,
                }}
              >
                <ElButton
                  type="primary"
                  onClick={handleQuery}
                  icon="Search"
                  style={{
                    padding: '8px',
                  }}
                  loading={props.loading}
                />
                <ElButton
                  onClick={resetQuery}
                  style={{
                    padding: '8px',
                  }}
                  icon="Refresh"
                />
              </ElFormItem>
            </ElForm>
          </div>
        )
      )
    }
  },
})
