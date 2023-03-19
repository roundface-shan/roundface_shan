import React from "react";
import { CSSTransition } from "react-transition-group";
import { CSSTransitionProps } from "react-transition-group/CSSTransition";

type AnimationName = 'zoom-in-top' | 'zoom-in-bottom' | 'zoom-in-left' | 'zoom-in-right'

type TransitionProps = CSSTransitionProps & {
    animation?: AnimationName,
    children?: React.ReactNode,
    classNames?: React.ClassicComponentClass,
    wrapper?: boolean,
}

const Transition: React.FC<TransitionProps> = (props) => {
    const{
        children, classNames, animation, wrapper, ...restProps
     } = props
     const nodeRef = React.useRef(null);
    return (
        <CSSTransition
        // nodeRef={nodeRef}
        // 加上就没动画，不加就有警告
        classNames={classNames ? classNames : animation}
        {...restProps}
        >
            {wrapper ? <div>{children}</div> : children}
        </CSSTransition>
    )
}
Transition.defaultProps = {
    unmountOnExit: true,
    appear: true,
}

export default Transition;