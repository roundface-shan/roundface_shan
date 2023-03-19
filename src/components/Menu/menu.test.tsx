import React from "react";
import { cleanup, fireEvent, render, RenderResult, waitFor } from "@testing-library/react";

import Menu, {MenuProps} from "./menu";
import MenuItem from "./menuItem";
import SubMenu from "./subMenu";


jest.mock('react-transition-group', () => {
    return {
      CSSTransition: (props: any) => {
        return props.children
      }
    }
  })
const testProps: MenuProps = {
    defaultIndex: '0',
    onSelect: jest.fn(),
    className: 'test',
    children: '666'
}
const testVerProps: MenuProps ={
    defaultIndex: '0',
    mode: 'vertical',
    children: '888',
    defaultOpenSubMenus: ['3'],
}
const GoodOne = (props: MenuProps) => {
    return(
        <Menu { ...props }>
          <MenuItem>
            active
          </MenuItem>
          <MenuItem disabled>
            disabled
          </MenuItem>
          <MenuItem>
            xyz
          </MenuItem>
          <SubMenu title="loveYou">
            <MenuItem>
            Menu_one
            </MenuItem>
          </SubMenu>
        </Menu>
    )
}

const createStyleFile = () => {
    const cssFile: string =` 
    .rf-submenu{
        display: none;
    }
    .rf-submenu.menu-opened{
        display: block;
    }
    `
    const style = document.createElement('style')
    style.innerHTML = cssFile
    return style
}
// 写一小段css到测试环境里 style.type = 'text/css' 这个已经不用加了

let wrapper: RenderResult, menuElement: HTMLElement, activeElement: HTMLElement, disabledElement: HTMLElement
describe('test Menu and  MenuItem component', () => {
    beforeEach(() => {
        wrapper = render(GoodOne(testProps))
        wrapper.container.append(createStyleFile())
        menuElement = wrapper.getByTestId('test-menu')
        // 这里用wrapper.container.xxx 也可以，这个方法可以使用HTML元素的其它方法，getbyclassname什么的
        activeElement = wrapper.getByText('active')
        disabledElement = wrapper.getByText('disabled')
    })
    it('should render correct Menu and MenuItem based on default props', () => {
        expect(menuElement).toBeInTheDocument()
        expect (menuElement).toHaveClass('rf-menu test')
        // expect(menuElement.getElementsByTagName('li').length).toEqual(5)
        expect(menuElement.querySelectorAll(':scope > li').length).toEqual(4)
        expect(disabledElement).toHaveClass('menu-item is-disabled')
        expect(activeElement).toHaveClass('menu-item is-active')
    })
    it('click should work out and get purper callback', () => {
        const thirdItem = wrapper.getByText('xyz')
        fireEvent.click(thirdItem)
        expect(thirdItem).toHaveClass('is-active')
        expect(activeElement).not.toHaveClass('is-active')
        expect(testProps.onSelect).toHaveBeenCalledWith('2')
        fireEvent.click(disabledElement)
        expect(disabledElement).not.toHaveClass('is-active')
        expect(testProps.onSelect).not.toHaveBeenCalledWith('1')
    })
    it('should render vertical mode when props match', () => {
        cleanup()
        // 正常来讲不需要写cleanup函数，因为每个case结束前应该自动清除
        const wrapper = render(GoodOne(testVerProps))
        const menuElement = wrapper.getByTestId('test-menu')
        expect(menuElement).toHaveClass('menu-vertical')
    })
    it('display menus on horizontal mode of submenu by hover', async () => {
        expect(wrapper.queryByText('Menu_one')).not.toBeVisible()
        const loveElement = wrapper.getByText('loveYou')
        fireEvent.mouseEnter(loveElement)
        await waitFor(() => {
            expect(wrapper.queryByText('Menu_one')).toBeVisible()
        })
        fireEvent.click(wrapper.getByText('Menu_one'))
        expect(testProps.onSelect).toHaveBeenCalledWith('3-0')
        fireEvent.mouseLeave(loveElement)
        await waitFor(() => {
            expect(wrapper.queryByText('Menu_one')).not.toBeVisible() 
        })
    })
    it('things should work out under vertical mode', () => {
        cleanup()
        const wrapper = render(GoodOne(testVerProps))
        wrapper.container.append(createStyleFile())
        // 这段css cleanup之后必须要加上
        const testElement = wrapper.queryByText('Menu_one')
        expect(testElement).toBeVisible()
        const loveElement = wrapper.getByText('loveYou')
        fireEvent.click(loveElement)
        // get 和 query 的区别在于前者不会返回null值
        expect(testElement).not.toBeVisible()
    })
})