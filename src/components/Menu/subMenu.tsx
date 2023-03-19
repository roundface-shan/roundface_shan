import React, { useState, useContext, FunctionComponentElement } from "react";
import classNames from "classnames";
import { MenuContext } from "./menu";
import { MenuItemProps } from "./menuItem";
import Icon from "../Icon/icon";
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import Transition from "../Transition/transition";


library.add(fas)


export interface SubMenuProps{
    index?: string;
    title: string;
    className?: string;
    children: React.ReactNode
}

export const SubMenu: React.FC<SubMenuProps> = ({index, title, className, children}) => {
    const context = useContext(MenuContext)
    const openedSubMenu = context.defaultOpenSubMenus as Array<string>
    const isOpen = (index && context.mode === 'vertical')? openedSubMenu.includes(index) : false
    const [menuOpen, setOpen] = useState(isOpen)
    const classes = classNames('menu-item submenu-item', className, {
        'is-active': context.index === index,
        'vertical-open': context.mode === 'vertical' && menuOpen,
        'vertical-not-open': context.mode === 'vertical' && !menuOpen,
    })
    const handleClick = (e: React.MouseEvent) => {
        // js的mouseevent里面属性不全，记得一定要用React
        e.preventDefault()
        // 记得防止它自动刷新
        setOpen(!menuOpen)
    }
    let timer: any
    const handleMouse = (e: React.MouseEvent, toggle: boolean) => {
        clearTimeout(timer)
        e.preventDefault()
        timer = setTimeout(() => {
            setOpen(toggle)
        }, 300)
    }
    const clickEvent = context.mode === 'vertical'? {
        onClick: handleClick
    } : {}
    const hoverEvent = context.mode !== 'vertical'? {
        onMouseEnter: (e: React.MouseEvent) => {handleMouse(e, true)},
        onMouseLeave: (e: React.MouseEvent) => {handleMouse(e, false)}
    } : {}
    const renderChildren = () => {
        const subMenuClasses = classNames('rf-submenu', {
            'menu-opened': menuOpen
        })
        const childrenComponent = React.Children.map(children, (child, i) => {
            const childElement = child as FunctionComponentElement<MenuItemProps>
            if (childElement.type.displayName === 'MenuItem'){
                return React.cloneElement(childElement, {index: `${index}-${i}`})
            }else{
                console.error('Warning: Menu has a child which is not a MenuItem component')
            }
        })
        return (
            <Transition
            in={menuOpen}
            timeout={300}
            animation='zoom-in-top'
            >
            <ul className={subMenuClasses}>
                {childrenComponent}
            </ul>
            </Transition>
        )
    }
    return(
        <li key={index} className={classes} {...hoverEvent}>
            <div className='submenu-title' {...clickEvent}>
                {title}
                <Icon icon="angle-down" className='icon' />
            </div>
            {renderChildren()}
        </li>
    )
}

SubMenu.displayName = 'SubMenu'
export default SubMenu