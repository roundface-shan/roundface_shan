import React, { useState } from 'react';
import Button, {ButtonType, ButtonSize} from './components/Button/button';
import Menu from './components/Menu/menu';
import MenuItem from './components/Menu/menuItem';
import SubMenu from './components/Menu/subMenu';
import Icon from './components/Icon/icon';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import Transition from './components/Transition/transition'


library.add(fas)
const App: React.FC = () => {
  const [ show, setShow ] = useState(false)
  return (
    <div className="App">
      <header className="App-header">
        <Icon icon='arrow-down' theme='danger' size='10x' />
        <Menu defaultIndex='0' onSelect={(index) => {alert(index)}} defaultOpenSubMenus={['2']} mode='horizontal'>
          <MenuItem>
            cool link
          </MenuItem>
          <MenuItem disabled>
            cool link 2
          </MenuItem>
          <SubMenu title='dropdown'>
            <MenuItem>
            dropdown1
            </MenuItem>
            <MenuItem>
            dropdown2
            </MenuItem>
          </SubMenu>
          <MenuItem>
            cool link 3
          </MenuItem>
        </Menu>
        <Button size={'lg'} onClick={() => {setShow(!show)}}> Toggle </Button>
        <Transition
          in={show}
          timeout={300}
          animation='zoom-in-left'
        >
          <div>
            <p>
              Edit <code>src/App.tsx</code> and save to reload.
            </p>
            <p>
              Edit <code>src/App.tsx</code> and save to reload.
            </p>
            <p>
              Edit <code>src/App.tsx</code> and save to reload.
            </p>
            <p>
              Edit <code>src/App.tsx</code> and save to reload.
            </p>
            <p>
              Edit <code>src/App.tsx</code> and save to reload.
            </p>
            <p>
              Edit <code>src/App.tsx</code> and save to reload.
            </p>
          </div>
        </Transition>
        <p>
        <Button className='custom'>Hello</Button>
        <Button btnType={'primary'} size={'lg'}>Hello</Button>
        <Button btnType={'link'} href='http://www.baidu.com' target="_blank">BaiDu</Button>
        </p>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
