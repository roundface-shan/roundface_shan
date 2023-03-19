import React, { useState, useContext } from "react";
import classNames from "classnames";
import { MenuContext } from "./menu";
import Icon from "../Icon/icon";
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import Transition from "../Transition/transition";
library.add(fas);
export const SubMenu = ({ index, title, className, children }) => {
    const context = useContext(MenuContext);
    const openedSubMenu = context.defaultOpenSubMenus;
    const isOpen = (index && context.mode === 'vertical') ? openedSubMenu.includes(index) : false;
    const [menuOpen, setOpen] = useState(isOpen);
    const classes = classNames('menu-item submenu-item', className, {
        'is-active': context.index === index,
        'vertical-open': context.mode === 'vertical' && menuOpen,
        'vertical-not-open': context.mode === 'vertical' && !menuOpen,
    });
    const handleClick = (e) => {
        // js的mouseevent里面属性不全，记得一定要用React
        e.preventDefault();
        // 记得防止它自动刷新
        setOpen(!menuOpen);
    };
    let timer;
    const handleMouse = (e, toggle) => {
        clearTimeout(timer);
        e.preventDefault();
        timer = setTimeout(() => {
            setOpen(toggle);
        }, 300);
    };
    const clickEvent = context.mode === 'vertical' ? {
        onClick: handleClick
    } : {};
    const hoverEvent = context.mode !== 'vertical' ? {
        onMouseEnter: (e) => { handleMouse(e, true); },
        onMouseLeave: (e) => { handleMouse(e, false); }
    } : {};
    const renderChildren = () => {
        const subMenuClasses = classNames('rf-submenu', {
            'menu-opened': menuOpen
        });
        const childrenComponent = React.Children.map(children, (child, i) => {
            const childElement = child;
            if (childElement.type.displayName === 'MenuItem') {
                return React.cloneElement(childElement, { index: `${index}-${i}` });
            }
            else {
                console.error('Warning: Menu has a child which is not a MenuItem component');
            }
        });
        return (React.createElement(Transition, { in: menuOpen, timeout: 300, animation: 'zoom-in-top' },
            React.createElement("ul", { className: subMenuClasses }, childrenComponent)));
    };
    return (React.createElement("li", Object.assign({ key: index, className: classes }, hoverEvent),
        React.createElement("div", Object.assign({ className: 'submenu-title' }, clickEvent),
            title,
            React.createElement(Icon, { icon: "angle-down", className: 'icon' })),
        renderChildren()));
};
SubMenu.displayName = 'SubMenu';
export default SubMenu;
