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
import React, { forwardRef } from "react";
import classNames from "classnames";
import Icon from "../Icon/icon";
export const Input = forwardRef((props, ref) => {
    const { disabled, size, icon, prepend, append, style } = props, restProps = __rest(props, ["disabled", "size", "icon", "prepend", "append", "style"]);
    const cnames = classNames('rf-input-wrapper', {
        [`input-size-${size}`]: size,
        'is-disabled': disabled,
        'input-group': prepend || append,
        'input-group-append': !!append,
        'input-group-prepend': !!prepend
    });
    const fixControlledValue = (value) => {
        if (typeof value === 'undefined' || value === null) {
            return '';
        }
        return value;
    };
    if ('value' in props) {
        delete restProps.defaultValue;
        restProps.value = fixControlledValue(props.value);
    }
    return (React.createElement("div", { className: cnames, style: style },
        prepend && React.createElement("div", { className: "rf-input-group-prepend" }, prepend),
        icon && React.createElement("div", { className: "icon-wrapper" },
            React.createElement(Icon, { icon: icon, title: `title-${icon}` })),
        React.createElement("input", Object.assign({ ref: ref, className: "rf-input-inner", disabled: disabled }, restProps)),
        append && React.createElement("div", { className: "rf-input-group-append" }, append)));
});
export default Input;
