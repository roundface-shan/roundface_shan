import React, {FC, useState, DragEvent, ReactNode} from "react";
import classNames from "classnames";
import { booleanLiteral } from "@babel/types";

interface DraggerProps {
    // 我也可以让父组件把上传方法context过来，但没必要
    onFile: (files: FileList) => void;
    children?: ReactNode;
}

export const Dragger: FC<DraggerProps> = (props) => {
    const {onFile, children} = props
    const [dragOver, setDragOver] = useState(false)
    const klass = classNames('rf-uploader-dragger', {
        'is-dragover': dragOver
    })
    const handleDrop = (e: DragEvent<HTMLElement>) => {
        e.preventDefault()
        setDragOver(false)
        console.log('onFile拿到的参数:', e.dataTransfer.files)
        onFile(e.dataTransfer.files)
    }
    const handleDrag = (e: DragEvent<HTMLElement>, over: boolean) => {
        e.preventDefault()
        setDragOver(over)
    }
    return (
        <div
            className={klass}
            onDragOver={e => {handleDrag(e, true)}}
            onDragLeave={e => {handleDrag(e, false)}}
            onDrop={handleDrop}
        >
            {children}
        </div>
    )
}

export default Dragger;