import React from "react";
type selectCallback = (selectedIndex: string) => void;
type MenuMode = 'horizontal' | 'vertical';
export interface MenuProps {
    defaultIndex?: string;
    className?: string;
    mode?: MenuMode;
    style?: React.CSSProperties;
    onSelect?: selectCallback;
    children: React.ReactNode;
    defaultOpenSubMenus?: string[];
}
interface IMenuContext {
    index: string;
    onSelect?: selectCallback;
    mode?: MenuMode;
    defaultOpenSubMenus?: string[];
}
export declare const MenuContext: React.Context<IMenuContext>;
export declare const Menu: React.FC<MenuProps>;
export default Menu;
