var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { useState, useReducer } from 'react';
import Schema from 'async-validator';
import { mapValues } from 'lodash';
import { each } from 'lodash';
function fieldsReducer(state, action) {
    switch (action.type) {
        case 'addField':
            return Object.assign(Object.assign({}, state), { [action.name]: Object.assign({}, action.value) });
        case 'updateValue':
            return Object.assign(Object.assign({}, state), { [action.name]: Object.assign(Object.assign({}, state[action.name]), { value: action.value }) });
        case 'updateValidateResult':
            const { isValid, errors } = action.value;
            return Object.assign(Object.assign({}, state), { [action.name]: Object.assign(Object.assign({}, state[action.name]), { isValid, errors }) });
        default:
            return state;
    }
}
// * react hooks
// * class - ant design
function useStore(initialValues) {
    // form state
    const [form, setForm] = useState({ isValid: true, isSubmitting: false, errors: {} });
    const [fields, dispatch] = useReducer(fieldsReducer, {});
    const getFieldValue = (key) => {
        return fields[key] && fields[key].value;
    };
    const getFieldsValue = () => {
        return mapValues(fields, item => item.value);
    };
    const setFieldValue = (name, value) => {
        if (fields[name]) {
            dispatch({ type: 'updateValue', name, value });
        }
    };
    const resetFields = () => {
        if (initialValues) {
            each(initialValues, (value, name) => {
                if (fields[name]) {
                    dispatch({ type: 'updateValue', name, value });
                }
            });
        }
    };
    const transfromRules = (rules) => {
        return rules.map(rule => {
            if (typeof rule === 'function') {
                const calledRule = rule({ getFieldValue });
                return calledRule;
            }
            else {
                return rule;
            }
        });
    };
    const validateField = (name) => __awaiter(this, void 0, void 0, function* () {
        const { value, rules } = fields[name];
        const afterRules = transfromRules(rules);
        const descriptor = {
            [name]: afterRules
        };
        const valueMap = {
            [name]: value
        };
        const validator = new Schema(descriptor);
        let isValid = true;
        let errors = [];
        try {
            yield validator.validate(valueMap);
        }
        catch (e) {
            isValid = false;
            const err = e;
            console.log('e', err.errors);
            console.log('fields', err.fields);
            errors = err.errors;
        }
        finally {
            console.log('errors', isValid);
            dispatch({ type: 'updateValidateResult', name, value: { isValid, errors } });
        }
    });
    const validateAllFields = () => __awaiter(this, void 0, void 0, function* () {
        let isValid = true;
        let errors = {};
        const valueMap = mapValues(fields, item => item.value);
        // {'username': 'abc'}
        const descriptor = mapValues(fields, item => transfromRules(item.rules));
        const validator = new Schema(descriptor);
        setForm(Object.assign(Object.assign({}, form), { isSubmitting: true }));
        try {
            yield validator.validate(valueMap);
        }
        catch (e) {
            isValid = false;
            const err = e;
            errors = err.fields;
            each(fields, (value, name) => {
                // errors 中有对应的 key
                if (errors[name]) {
                    const itemErrors = errors[name];
                    dispatch({ type: 'updateValidateResult', name, value: { isValid: false, errors: itemErrors } });
                }
                else if (value.rules.length > 0 && !errors[name]) {
                    dispatch({ type: 'updateValidateResult', name, value: { isValid: true, errors: [] } });
                }
                //  有对应的 rules，并且没有 errors
            });
        }
        finally {
            setForm(Object.assign(Object.assign({}, form), { isSubmitting: false, isValid, errors }));
            return {
                isValid,
                errors,
                values: valueMap
            };
        }
    });
    return {
        fields,
        dispatch,
        form,
        validateField,
        getFieldValue,
        validateAllFields,
        getFieldsValue,
        setFieldValue,
        resetFields,
    };
}
export default useStore;
