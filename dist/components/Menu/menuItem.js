import React, { useContext } from "react";
import classNames from "classnames";
import { MenuContext } from "./menu";
export const MenuItem = (props) => {
    const { index, disabled, className, style, children } = props;
    const context = useContext(MenuContext);
    const classes = classNames('menu-item', className, {
        'is-disabled': disabled,
        'is-active': context.index === index
    });
    const handleClick = () => {
        if (context.onSelect && !disabled && (typeof index === 'string')) {
            context.onSelect(index);
        }
    };
    return (React.createElement("li", { className: classes, style: style, onClick: handleClick }, children));
};
export default MenuItem;
