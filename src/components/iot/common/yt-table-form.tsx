import { IColumn } from '@/components/iot/common/types/tableCommon'
import { PropType } from 'vue'
import { formProps } from './props/crudProps'
import { componentMap, renderOptions } from '@/components/iot/common/render/useRenderComponent'

import { ElDialog, ElButton, ElForm, ElFormItem, FormRules, ElRow, ElCol } from 'element-plus'
import { deepClone } from '@/utils/iot'

type TDialogType = 'add' | 'view' | 'update'

export default defineComponent({
  name: 'YtTableForm',
  props: {
    // 标题
    column: {
      type: Array as PropType<IColumn[]>,
      default: () => [],
    },
    ...formProps,
  },
  emtis: ['openDialog', 'onSuccess', 'openBeforeFun'],
  setup(props, { emit, slots, expose }) {
    const columns = ref<IColumn[]>([])
    watch(
      () => props.column,
      (newV) => {
        columns.value = toRaw(newV)
      },
      {
        immediate: true,
        deep: true,
      }
    )
    // 定义钩子
    const diglogRef = ref()
    const formRef = ref()
    // 组件内容数据
    const dialogObj = reactive({
      visible: false,
      title: '详情',
      type: 'view',
    })
    const formObj = reactive<{
      data: Recordable<string, any>
    }>({
      data: {},
    })
    const submitForm = () => {
      formRef.value.validate(async (valid: boolean) => {
        if (valid) {
          emit('onSuccess', {
            type: dialogObj.type,
            data: formObj.data,
            cancel,
          })
        }
      })
    }
    const cancel = () => {
      reset()
      dialogObj.visible = false
    }
    // 表单重置
    const reset = () => {
      formObj.data = {}
      formRef.value.resetFields()
    }
    // 弹窗关闭前
    const beforeClose = (done: () => void) => {
      reset()
      done()
    }
    // 获取是否禁用
    const getDisabled = (option: IColumn) => {
      let disabled = false
      if (dialogObj.type === 'update') disabled = !!option?.editDisabled
      if (dialogObj.type === 'add') disabled = !!option?.addDisabled
      if (option.componentProps?.disabled) disabled = !!option?.componentProps.disabled
      if (disabled) return { disabled: true }
      return {}
    }
    const getAttr = (option: IColumn) => {
      return {
        clearable: props.clearable,
        placeholder: `${option.type === 'string' || !option.type ? '请输入' : '请选择'}${option.label}`,
        ...option.componentProps,
        ...getDisabled(option),
      }
    }
    // 打开弹窗
    const openDialog = (type: TDialogType, data?: Recordable<string, any>) => {
      dialogObj.type = type
      formObj.data = deepClone(toRaw(data || {}))
      emit('openBeforeFun', {
        type: dialogObj.type,
        data: formObj.data,
        columns: props.column,
      })
      const judgmentObj = {
        view: () => {
          dialogObj.title = '详情'
        },
        update: () => {
          dialogObj.title = '编辑'
        },
        add: () => {
          columns.value.forEach((item: IColumn) => {
            // 判断默认值
            const defaultValue = item?.componentProps?.defaultValue
            if (defaultValue !== null && defaultValue !== undefined) {
              formObj.data[item.key] = defaultValue
            }
          })
          dialogObj.title = '新增'
        },
      }
      judgmentObj[type]()
      dialogObj.visible = true
    }
    expose({
      openDialog,
      cancel,
    })

    const formData = ref<IColumn[]>(toRaw(props.column))
    const rules: FormRules = {}
    formData.value.forEach((item: IColumn) => {
      if (item.rules) {
        rules[item.key] = item.rules
      }
    })
    return () => (
      <ElDialog
        ref={diglogRef}
        title={dialogObj.title}
        v-model={dialogObj.visible}
        width={props.width}
        close-on-press-escape={false}
        close-on-click-modal={false}
        append-to-body={true}
        beforeClose={beforeClose}
        destroy-on-close
      >
        {{
          default: () => (
            <ElForm ref={formRef} model={formObj.data} rules={rules} labelWidth={props.labelWidth} disabled={dialogObj.type === 'view'}>
              <div>
                <ElRow gutter={props.gutter}>
                  {columns.value.map((m: IColumn) => {
                    const type = m?.type || 'string'
                    const Com = componentMap.get(type) as ReturnType<typeof defineComponent>
                    if (dialogObj.type === 'add' && m.addHide) return
                    if (dialogObj.type === 'edit' && m.editHide) return
                    if (!m.formHide) {
                      if (m.formWatch) {
                        watch(
                          () => formObj.data[m.key],
                          (newV) => {
                            m.formWatch?.({
                              col: m,
                              column: columns.value,
                              data: formObj.data,
                              value: newV,
                            })
                          },
                          {
                            immediate: true,
                            deep: true,
                          }
                        )
                      }
                      return (
                        <ElCol span={m.colSpan || props.colSpan || 24}>
                          {!m.formItemSlot ? (
                            <ElFormItem label={m.label + ':'} prop={typeof m.key === 'string' ? m.key : ''} key={m.key}>
                              {!m.formSlot ? (
                                <Com v-model={formObj.data[m.key]} {...getAttr(m)}>
                                  {renderOptions(m)}
                                </Com>
                              ) : (
                                slots[m.key + 'Form']?.({
                                  type: dialogObj.type,
                                  column: m,
                                  row: formObj.data,
                                })
                              )}
                            </ElFormItem>
                          ) : (
                            slots[m.key + 'FormItem']?.({
                              type: dialogObj.type,
                              column: m,
                              row: formObj.data,
                            })
                          )}
                        </ElCol>
                      )
                    }
                  })}
                </ElRow>
              </div>
            </ElForm>
          ),
          footer: () => (
            <div class="dialog-footer">
              <ElButton loading={props.loading} onClick={cancel}>
                取 消
              </ElButton>
              {dialogObj.type !== 'view' && (
                <ElButton loading={props.loading} type="primary" onClick={submitForm}>
                  保 存
                </ElButton>
              )}
            </div>
          ),
        }}
      </ElDialog>
    )
  },
})
