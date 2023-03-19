import React from "react";
const Progress = (props) => {
    const { percent, strokeHeight, showText, styles, theme } = props;
    return (React.createElement("div", { className: "rf-progress-bar", style: styles },
        React.createElement("div", { className: "rf-progress-bar-outer", style: { height: `${strokeHeight}px` } },
            React.createElement("div", { className: `rf-progress-bar-inner color-${theme}`, style: { width: `${percent}%` } }, showText && React.createElement("span", { className: "inner-text" }, `${percent}%`)))));
};
Progress.defaultProps = {
    strokeHeight: 15,
    showText: true,
    theme: 'primary'
};
export default Progress;
