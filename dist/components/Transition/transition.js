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
import { CSSTransition } from "react-transition-group";
const Transition = (props) => {
    const { children, classNames, animation, wrapper } = props, restProps = __rest(props, ["children", "classNames", "animation", "wrapper"]);
    const nodeRef = React.useRef(null);
    return (React.createElement(CSSTransition
    // nodeRef={nodeRef}
    // 加上就没动画，不加就有警告
    , Object.assign({ 
        // nodeRef={nodeRef}
        // 加上就没动画，不加就有警告
        classNames: classNames ? classNames : animation }, restProps), wrapper ? React.createElement("div", null, children) : children));
};
Transition.defaultProps = {
    unmountOnExit: true,
    appear: true,
};
export default Transition;
