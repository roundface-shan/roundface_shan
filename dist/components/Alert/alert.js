import React, { useState } from 'react';
import classNames from 'classnames';
import Icon from '../Icon/icon';
import Transition from '../Transition/transition';
/**
 * 用于页面中展示重要的提示信息。 点击右侧的叉提示自动消失
 * ### 引用方法
 *
 * ~~~js
 * import { Alert } from 'rfship'
 * ~~~
*/
export const Alert = (props) => {
    const [hide, setHide] = useState(false);
    const { title, description, type, onClose, closable } = props;
    const classes = classNames('rf-alert', {
        [`rf-alert-${type}`]: type,
    });
    const titleClass = classNames('rf-alert-title', {
        'bold-title': description
    });
    const handleClose = (e) => {
        if (onClose) {
            onClose();
        }
        setHide(true);
    };
    return (React.createElement(Transition, { in: !hide, timeout: 300, animation: "zoom-in-top" },
        React.createElement("div", { className: classes },
            React.createElement("span", { className: titleClass }, title),
            description && React.createElement("p", { className: "rf-alert-desc" }, description),
            closable && React.createElement("span", { className: "rf-alert-close", onClick: handleClose },
                React.createElement(Icon, { icon: "times" })))));
};
Alert.defaultProps = {
    type: 'default',
    closable: true,
};
export default Alert;
