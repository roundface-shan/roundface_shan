import React, { useState, createContext } from "react";
import classNames from "classnames";
import MenuItem from "./menuItem";
// 向子组件传参
export const MenuContext = createContext({ index: '0' });
export const Menu = (props) => {
    const { className, defaultIndex, mode, style, children, onSelect, defaultOpenSubMenus } = props;
    const [currentActive, setActive] = useState(defaultIndex);
    const classes = classNames('rf-menu', className, {
        'menu-vertical': mode === 'vertical',
        'menu-horizontal': mode !== 'vertical'
    });
    const handleClick = (index) => {
        setActive(index);
        if (onSelect) {
            onSelect(index);
        }
    };
    const passedContext = {
        index: currentActive ? currentActive : '0',
        onSelect: handleClick,
        // 把写好的函数也传给子组件，这样就能修改父组件里的数据
        mode,
        defaultOpenSubMenus,
    };
    const renderChildren = () => {
        return React.Children.map(children, (child, index) => {
            const childrenElement = child;
            const { displayName } = childrenElement.type;
            if (displayName === 'MenuItem' || displayName === 'SubMenu') {
                return React.cloneElement(childrenElement, { index: index.toString() });
                // 这个不直接返回children，是为了让index自动添加
            }
            else {
                console.error('Warning: Menu has a child which is not a MenuItem component');
            }
        });
    };
    return (React.createElement("ul", { className: classes, style: style, "data-testid": 'test-menu' },
        React.createElement(MenuContext.Provider, { value: passedContext }, renderChildren())));
};
Menu.defaultProps = {
    defaultIndex: '0',
    mode: 'horizontal',
    defaultOpenSubMenus: [],
};
MenuItem.displayName = 'MenuItem';
export default Menu;
