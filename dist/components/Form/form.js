var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React, { createContext, forwardRef, useImperativeHandle } from 'react';
import useStore from './useStore';
// context默认值只要有占位符就行
export const FormContext = createContext({});
export const Form = forwardRef((props, ref) => {
    const { name, children, initialValues, onFinish, onFinishFailed } = props;
    const _a = useStore(initialValues), { form, fields, dispatch } = _a, restProps = __rest(_a, ["form", "fields", "dispatch"]);
    const { validateField, validateAllFields } = restProps;
    // 配合forwardRef，把验证方法暴露到form组件
    useImperativeHandle(ref, () => {
        return Object.assign({}, restProps);
    });
    // 从useStore中把参数拿过来，再传给item
    const passedContext = {
        dispatch,
        fields,
        initialValues,
        validateField
    };
    const submitForm = (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        e.stopPropagation();
        const { isValid, errors, values } = yield validateAllFields();
        if (isValid && onFinish) {
            onFinish(values);
        }
        else if (!isValid && onFinishFailed) {
            onFinishFailed(values, errors);
        }
    });
    let childrenNode;
    if (typeof children === 'function') {
        childrenNode = children(form);
    }
    else {
        childrenNode = children;
    }
    return (React.createElement("form", { name: name, className: "rf-form", onSubmit: submitForm },
        React.createElement(FormContext.Provider, { value: passedContext }, childrenNode)));
});
Form.defaultProps = {
    name: 'rf_form'
};
export default Form;
