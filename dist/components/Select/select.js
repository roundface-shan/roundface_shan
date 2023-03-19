import React, { useState, createContext, useRef, useEffect } from 'react';
import classNames from 'classnames';
import Input from '../Input';
import Icon from '../Icon';
import useClickOutside from '../../hooks/useClickOutside';
import Transition from '../Transition/transition';
export const SelectContext = createContext({ selectedValues: [] });
/**
 * 下拉选择器。
 * 弹出一个下拉菜单给用户选择操作，用于代替原生的选择器，或者需要一个更优雅的多选器时。
 * ### 引用方法
 *
 * ~~~js
 * import { Select } from 'rfship'
 * // 然后可以使用 <Select> 和 <Select.Option>
 * ~~~
 */
export const Select = (props) => {
    const { defaultValue, placeholder, children, multiple, name, disabled, onChange, onVisibleChange, } = props;
    const input = useRef(null);
    const containerRef = useRef(null);
    const containerWidth = useRef(0);
    const [selectedValues, setSelectedValues] = useState(Array.isArray(defaultValue) ? defaultValue : []);
    const [menuOpen, setOpen] = useState(false);
    const [value, setValue] = useState(typeof defaultValue === 'string' ? defaultValue : '');
    const handleOptionClick = (value, isSelected) => {
        // update value
        if (!multiple) {
            setOpen(false);
            setValue(value);
            if (onVisibleChange) {
                onVisibleChange(false);
            }
        }
        else {
            setValue('');
        }
        let updatedValues = [value];
        // click again to remove selected when is multiple mode
        if (multiple) {
            updatedValues = isSelected ? selectedValues.filter((v) => v !== value) : [...selectedValues, value];
            setSelectedValues(updatedValues);
        }
        if (onChange) {
            onChange(value, updatedValues);
        }
    };
    useEffect(() => {
        // focus input
        if (input.current) {
            input.current.focus();
            if (multiple && selectedValues.length > 0) {
                // 消除默认
                input.current.placeholder = '';
            }
            else {
                if (placeholder)
                    input.current.placeholder = placeholder;
            }
        }
    }, [selectedValues, multiple, placeholder]);
    useEffect(() => {
        if (containerRef.current) {
            // 制造调整复选框宽度的缩写变量
            containerWidth.current = containerRef.current.getBoundingClientRect().width;
        }
    });
    // autocomopelet里面的自定义hook
    useClickOutside(containerRef, () => {
        setOpen(false);
        if (onVisibleChange && menuOpen) {
            onVisibleChange(false);
        }
    });
    const passedContext = {
        onSelect: handleOptionClick,
        selectedValues: selectedValues,
        multiple: multiple,
    };
    const handleClick = (e) => {
        e.preventDefault();
        if (!disabled) {
            setOpen(!menuOpen);
            if (onVisibleChange) {
                onVisibleChange(!menuOpen);
            }
        }
    };
    const generateOptions = () => {
        return React.Children.map(children, (child, i) => {
            const childElement = child;
            if (childElement.type.displayName === 'Option') {
                return React.cloneElement(childElement, {
                    index: `select-${i}`
                });
            }
            else {
                console.error("Warning: Select has a child which is not a Option component");
            }
        });
    };
    const containerClass = classNames('rf-select', {
        'menu-is-open': menuOpen,
        'is-disabled': disabled,
        'is-multiple': multiple,
    });
    return (React.createElement("div", { className: containerClass, ref: containerRef },
        React.createElement("div", { className: "rf-select-input", onClick: handleClick },
            React.createElement(Input, { ref: input, placeholder: placeholder, value: value, readOnly: true, icon: "angle-down", disabled: disabled, name: name })),
        React.createElement(SelectContext.Provider, { value: passedContext },
            React.createElement(Transition, { in: menuOpen, animation: "zoom-in-top", timeout: 300 },
                React.createElement("ul", { className: "rf-select-dropdown" }, generateOptions()))),
        multiple &&
            React.createElement("div", { className: "rf-selected-tags", style: { maxWidth: containerWidth.current - 32 } }, selectedValues.map((value, index) => {
                return (React.createElement("span", { className: "rf-tag", key: `tag-${index}` },
                    value,
                    React.createElement(Icon, { icon: "times", onClick: () => { handleOptionClick(value, true); } })));
            }))));
};
Select.defaultProps = {
    name: 'rf-select',
    placeholder: '请选择'
};
export default Select;
