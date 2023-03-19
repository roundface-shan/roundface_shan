import React, { ReactNode, createContext, forwardRef, useImperativeHandle } from 'react'
import { ValidateError } from 'async-validator'
import useStore, { FormState }from './useStore';
export type RenderProps = (form: FormState) => ReactNode
export interface FormProps {
    /**表单名称，会作为表单字段 id 前缀使用 */
    name?: string;
    /**表单默认值，只有初始化以及重置时生效 */
    initialValues?: Record<string, any>;
    children?: ReactNode | RenderProps;
    /**提交表单且数据验证成功后回调事件 被submit调用*/
    onFinish?: (values: Record<string, any>) => void;
    /**提交表单且数据验证失败后回调事件 */
    onFinishFailed?: (values: Record<string, any>, errors: Record<string, ValidateError[]>) => void;
}
export type IFormContext = 
// ReturnType获取useStore内部函数的返回值类型，不要管为什么要写typeof，固定写法
    Pick<ReturnType<typeof useStore>, 'dispatch' | 'fields' | 'validateField'>
    & Pick<FormProps, 'initialValues'>
export type IFormRef = Omit<ReturnType<typeof useStore>, 'fields' | 'dispatch' | 'form'>
// context默认值只要有占位符就行
export const FormContext = createContext<IFormContext>({} as IFormContext)
export const Form = forwardRef<IFormRef, FormProps>((props, ref) => {
    const { name, children, initialValues, onFinish, onFinishFailed } = props
    const { form, fields, dispatch, ...restProps } = useStore(initialValues)
    const { validateField, validateAllFields } = restProps
    // 配合forwardRef，把验证方法暴露到form组件
    useImperativeHandle(ref, () => {
        return {
        ...restProps
        }
    })
    // 从useStore中把参数拿过来，再传给item
    const passedContext: IFormContext = {
        dispatch,
        fields,
        initialValues,
        validateField
    }
    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        e.stopPropagation()
        const { isValid, errors, values } = await validateAllFields()
        if (isValid && onFinish) {
        onFinish(values)
        } else if(!isValid && onFinishFailed) {
        onFinishFailed(values, errors)
        }
    }
    let childrenNode: ReactNode
    if (typeof children === 'function') {
        childrenNode = children(form)
    } else {
        childrenNode = children
    }
    return (
        <form name={name} className="rf-form" onSubmit={submitForm}>
        <FormContext.Provider value={passedContext}>
            {childrenNode}
        </FormContext.Provider>
        </form>
    )
})
Form.defaultProps = {
    name: 'rf_form'
}

export default Form
