import React, { useContext } from 'react';
import classNames from 'classnames';
import Icon from '../Icon';
import { SelectContext } from './select';
export const Option = ({ value, label, disabled, children, index }) => {
    const { onSelect, selectedValues, multiple } = useContext(SelectContext);
    const isSelected = selectedValues.includes(value);
    const classes = classNames('rf-select-item', {
        'is-disabled': disabled,
        'is-selected': isSelected,
    });
    const handleClick = (e, value, isSelected) => {
        e.preventDefault();
        if (onSelect && !disabled) {
            onSelect(value, isSelected);
        }
    };
    return (React.createElement("li", { key: index, className: classes, onClick: (e) => { handleClick(e, value, isSelected); } },
        children || (label ? label : value),
        multiple && isSelected && React.createElement(Icon, { icon: "check" })));
};
Option.displayName = 'Option';
export default Option;
