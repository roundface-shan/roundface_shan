import React, { useState } from "react";
import classNames from "classnames";
export const Dragger = (props) => {
    const { onFile, children } = props;
    const [dragOver, setDragOver] = useState(false);
    const klass = classNames('rf-uploader-dragger', {
        'is-dragover': dragOver
    });
    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        console.log('onFile拿到的参数:', e.dataTransfer.files);
        onFile(e.dataTransfer.files);
    };
    const handleDrag = (e, over) => {
        e.preventDefault();
        setDragOver(over);
    };
    return (React.createElement("div", { className: klass, onDragOver: e => { handleDrag(e, true); }, onDragLeave: e => { handleDrag(e, false); }, onDrop: handleDrop }, children));
};
export default Dragger;
