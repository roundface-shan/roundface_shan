var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React from "react";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const Icon = (props) => {
    const { className, theme } = props, restProps = __rest(props, ["className", "theme"]);
    const classes = classNames('rf-icon', className, {
        [`icon-${theme}`]: theme
    });
    return (React.createElement(FontAwesomeIcon, Object.assign({ className: classes }, restProps)));
};
export default Icon;
