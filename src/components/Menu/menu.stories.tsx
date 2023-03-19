import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Menu from './menu'
import SubMenu from './subMenu'
import MenuItem from './menuItem'

const menuMeta: ComponentMeta<typeof Menu> = {
  title: 'Menu',
  id: 'Menu',
  component: Menu,
  subcomponents: {'SubMenu': SubMenu, 'MenuItem': MenuItem},
  args: {
    defaultIndex: '1',
  }
}

export default menuMeta

const Template: ComponentStory<typeof Menu> = (args) => (
    <Menu {...args}>
        <MenuItem>
        nice 1
        </MenuItem>
        <MenuItem>
        nice 2
        </MenuItem>
        <MenuItem disabled>
        disabled
        </MenuItem>
        <SubMenu title='下拉菜单'>
            <MenuItem>
            good 1
            </MenuItem>
            <MenuItem>
            good 2
            </MenuItem>
        </SubMenu>
    </Menu>
)

export const DefaultMenu = Template.bind({})
DefaultMenu.storyName = '默认的Menu'

export const ClickMenu = Template.bind({})
ClickMenu.args = {
    defaultIndex: '0',
    mode: 'vertical'
}
// ClickMenu.argTypes = {
//     defaultIndex:{
//         control: 'color',
//         description: '666'
//     }
// }
ClickMenu.storyName = '纵向的Menu'