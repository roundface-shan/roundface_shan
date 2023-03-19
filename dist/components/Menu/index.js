import Menu from './menu';
import SubMenu from './subMenu';
import MenuItem from './menuItem';
const TransMenu = Menu;
TransMenu.Item = MenuItem;
TransMenu.SubMenu = SubMenu;
export default TransMenu;
