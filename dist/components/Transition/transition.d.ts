import React from "react";
import { CSSTransitionProps } from "react-transition-group/CSSTransition";
type AnimationName = 'zoom-in-top' | 'zoom-in-bottom' | 'zoom-in-left' | 'zoom-in-right';
type TransitionProps = CSSTransitionProps & {
    animation?: AnimationName;
    children?: React.ReactNode;
    classNames?: React.ClassicComponentClass;
    wrapper?: boolean;
};
declare const Transition: React.FC<TransitionProps>;
export default Transition;
