var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { useContext, useEffect } from 'react';
import classNames from 'classnames';
import { FormContext } from './form';
export const FormItem = (props) => {
    const { label, children, name, valuePropName, trigger, getValueFromEvent, rules, validateTrigger } = props;
    const { dispatch, fields, initialValues, validateField } = useContext(FormContext);
    const rowClass = classNames('rf-row', {
        'rf-row-no-label': !label
    });
    useEffect(() => {
        const value = (initialValues && initialValues[name]) || '';
        dispatch({ type: 'addField', name, value: { label, name, value, rules: rules || [], errors: [], isValid: true } });
    }, []);
    // 获取store 对应的 value
    const fieldState = fields[name];
    const value = fieldState && fieldState.value;
    const errors = fieldState && fieldState.errors;
    const isRequired = rules === null || rules === void 0 ? void 0 : rules.some(rule => (typeof rule !== 'function') && rule.required);
    const hasError = errors && errors.length > 0;
    const labelClass = classNames({
        'rf-form-item-required': isRequired
    });
    const itemClass = classNames('rf-form-item-control', {
        'rf-form-item-has-error': hasError
    });
    const onValueUpdate = (e) => {
        const value = getValueFromEvent(e);
        console.log('new value', value);
        dispatch({ type: 'updateValue', name, value });
    };
    const onValueValidate = () => __awaiter(void 0, void 0, void 0, function* () {
        yield validateField(name);
    });
    // 1 手动的创建一个属性列表，需要有 value 以及 onChange 属性
    const controlProps = {};
    controlProps[valuePropName] = value;
    controlProps[trigger] = onValueUpdate;
    if (rules) {
        controlProps[validateTrigger] = onValueValidate;
    }
    // 2 获取 children 数组的第一个元素
    const childList = React.Children.toArray(children);
    // 没有子组件
    if (childList.length === 0) {
        console.error('No child element found in Form.Item, please provide one form component');
    }
    // 子组件大于一个
    if (childList.length > 1) {
        console.warn('Only support one child element in Form.Item, others will be omitted');
    }
    // 不是 ReactElement 的子组件
    if (!React.isValidElement(childList[0])) {
        console.error('Child component is not a valid React Element');
    }
    const child = childList[0];
    // 3 cloneElement，混合这个child 以及 手动的属性列表
    const returnChildNode = React.cloneElement(child, Object.assign(Object.assign({}, child.props), controlProps));
    return (React.createElement("div", { className: rowClass },
        label &&
            React.createElement("div", { className: 'rf-form-item-label' },
                React.createElement("label", { title: label, className: labelClass }, label)),
        React.createElement("div", { className: 'rf-form-item' },
            React.createElement("div", { className: itemClass }, returnChildNode),
            hasError &&
                React.createElement("div", { className: 'rf-form-item-explain' },
                    React.createElement("span", null, errors[0].message)))));
};
FormItem.defaultProps = {
    valuePropName: 'value',
    trigger: 'onChange',
    validateTrigger: 'onBlur',
    getValueFromEvent: (e) => e.target.value
};
export default FormItem;
