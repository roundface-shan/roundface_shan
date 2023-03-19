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
import React from 'react';
import classNames from 'classnames';
/**
 * 页面中最常用的的按钮元素，适合于完成特定的交互，支持 HTML button 和 a 链接 的所有属性
 * ### 引用方法
 *
 * ```javascript
 * import { Button } from 'vikingship'
 * ```
 */
export const Button = (props) => {
    const { btnType, className, disabled, size, children, href } = props, restProps = __rest(props
    // btn, btn-lg, btn-primary
    , ["btnType", "className", "disabled", "size", "children", "href"]);
    // btn, btn-lg, btn-primary
    const classes = classNames('btn', className, {
        [`btn-${btnType}`]: btnType,
        [`btn-${size}`]: size,
        'disabled': (btnType === 'link') && disabled
    });
    if (btnType === 'link' && href) {
        return (React.createElement("a", Object.assign({ className: classes, href: href }, restProps), children));
    }
    else {
        return (React.createElement("button", Object.assign({ className: classes, disabled: disabled }, restProps), children));
    }
};
Button.defaultProps = {
    disabled: false,
    btnType: 'default'
};
export default Button;
