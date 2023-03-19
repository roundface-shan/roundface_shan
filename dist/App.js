import React, { useState } from 'react';
import Button from './components/Button/button';
import Menu from './components/Menu/menu';
import MenuItem from './components/Menu/menuItem';
import SubMenu from './components/Menu/subMenu';
import Icon from './components/Icon/icon';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import Transition from './components/Transition/transition';
library.add(fas);
const App = () => {
    const [show, setShow] = useState(false);
    return (React.createElement("div", { className: "App" },
        React.createElement("header", { className: "App-header" },
            React.createElement(Icon, { icon: 'arrow-down', theme: 'danger', size: '10x' }),
            React.createElement(Menu, { defaultIndex: '0', onSelect: (index) => { alert(index); }, defaultOpenSubMenus: ['2'], mode: 'horizontal' },
                React.createElement(MenuItem, null, "cool link"),
                React.createElement(MenuItem, { disabled: true }, "cool link 2"),
                React.createElement(SubMenu, { title: 'dropdown' },
                    React.createElement(MenuItem, null, "dropdown1"),
                    React.createElement(MenuItem, null, "dropdown2")),
                React.createElement(MenuItem, null, "cool link 3")),
            React.createElement(Button, { size: 'lg', onClick: () => { setShow(!show); } }, " Toggle "),
            React.createElement(Transition, { in: show, timeout: 300, animation: 'zoom-in-left' },
                React.createElement("div", null,
                    React.createElement("p", null,
                        "Edit ",
                        React.createElement("code", null, "src/App.tsx"),
                        " and save to reload."),
                    React.createElement("p", null,
                        "Edit ",
                        React.createElement("code", null, "src/App.tsx"),
                        " and save to reload."),
                    React.createElement("p", null,
                        "Edit ",
                        React.createElement("code", null, "src/App.tsx"),
                        " and save to reload."),
                    React.createElement("p", null,
                        "Edit ",
                        React.createElement("code", null, "src/App.tsx"),
                        " and save to reload."),
                    React.createElement("p", null,
                        "Edit ",
                        React.createElement("code", null, "src/App.tsx"),
                        " and save to reload."),
                    React.createElement("p", null,
                        "Edit ",
                        React.createElement("code", null, "src/App.tsx"),
                        " and save to reload."))),
            React.createElement("p", null,
                React.createElement(Button, { className: 'custom' }, "Hello"),
                React.createElement(Button, { btnType: 'primary', size: 'lg' }, "Hello"),
                React.createElement(Button, { btnType: 'link', href: 'http://www.baidu.com', target: "_blank" }, "BaiDu")),
            React.createElement("p", null,
                "Edit ",
                React.createElement("code", null, "src/App.tsx"),
                " and save to reload."),
            React.createElement("a", { className: "App-link", href: "https://reactjs.org", target: "_blank", rel: "noopener noreferrer" }, "Learn React"))));
};
export default App;
