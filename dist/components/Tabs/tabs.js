import React, { useState } from 'react';
import classNames from 'classnames';
/**
 * 选项卡切换组件。
 * 提供平级的区域将大块内容进行收纳和展现，保持界面整洁。
 * ### 引用方法
 *
 * ~~~js
 * import { Tabs } from 'vikingship'
 * ~~~
 */
export const Tabs = (props) => {
    const { defaultIndex, className, onSelect, children, type } = props;
    const [activeIndex, setActiveIndex] = useState(defaultIndex);
    const handleClick = (e, index, disabled) => {
        if (!disabled) {
            setActiveIndex(index);
            if (onSelect) {
                onSelect(index);
            }
        }
    };
    const navClass = classNames('viking-tabs-nav', {
        'nav-line': type === 'line',
        'nav-card': type === 'card',
    });
    const renderNavLinks = () => {
        return React.Children.map(children, (child, index) => {
            const childElement = child;
            const { label, disabled } = childElement.props;
            const classes = classNames('viking-tabs-nav-item', {
                'is-active': activeIndex === index,
                'disabled': disabled,
            });
            return (React.createElement("li", { className: classes, key: `nav-item-${index}`, onClick: (e) => { handleClick(e, index, disabled); } }, label));
        });
    };
    const renderContent = () => {
        return React.Children.map(children, (child, index) => {
            if (index === activeIndex) {
                return child;
            }
        });
    };
    return (React.createElement("div", { className: `viking-tabs ${className}` },
        React.createElement("ul", { className: navClass }, renderNavLinks()),
        React.createElement("div", { className: "viking-tabs-content" }, renderContent())));
};
Tabs.defaultProps = {
    defaultIndex: 0,
    type: 'line'
};
export default Tabs;
