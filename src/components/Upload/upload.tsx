import React, {FC, useRef, ChangeEvent, useState} from "react";
import axios from "axios";
import UploadList from "./uploadList";
import Dragger from './dragger';


export type UploadFileStatus = 'ready' | 'uploading' | 'success' | 'error'
export interface UploadFile {
    uid: string;
    size: number;
    name: string;
    status?: UploadFileStatus;
    percent: number;
    raw?: File;
    response?: any;
    error?: any;
}
export interface UploadProps {
    /** 必选参数，上传到哪个地址 */
    action: string;
    /** 上传的文件列表 */
    defaultFileList?: UploadFile[];
    /** 上传文件之前的钩子，参数为上传的文件，若返回false或者Promise，则停止上传 */
    beforeUpload?: (file: File) => boolean | Promise<File>;
    /** 文件上传时的钩子 */
    onProgress?: (percentage: number, file: UploadFile) => void;
    /** 文件上传成功时的钩子 */
    onSuccess?: (data: any, file: UploadFile) => void;
    /** 文件上传失败时的钩子 */
    onError?: (err: any, file: UploadFile) => void;
    /** 文件状态改变时的钩子 */
    onChange?: (file: UploadFile) => void;
    /** 文件列表移除文件时的钩子 */
    onRemove?: (file: UploadFile) => void;
    /** 上传，请求头 */
    headers?: {[key: string]: any};
    /** 上传文件的字段名 */
    name?: string;
    /** 附带上传的参数 */
    data?: {[key: string]: any};
    /** 支持发送cookie信息 */
    withCredentials?: boolean;
    /** 允许上传的文件类型 */
    accept?: string;
    /** 是否支持文件多选 */
    multiple?: boolean;
    /** 是否支持拖拽上传 */
    drag?: boolean;
    children?: React.ReactNode
}

/**
 * 通过点击或者拖拽上传文件
 * ### 引用方法
 * 
 * ~~~js
 * import { Upload } from 'vikingship'
 * ~~~
 */

export const Upload: FC<UploadProps> = (props) => {
    const{
        action, defaultFileList, beforeUpload, onProgress, onSuccess, 
        onError, onChange, onRemove, name, headers, data, withCredentials, 
        accept, multiple, children, drag,
    } = props
    const fileInput = useRef<HTMLInputElement>(null)
    const [fileList, setFileList] = useState<UploadFile[]>(defaultFileList || [])
    // 这里是更新等待上传文件列表中的文件状态，不要误解成上传
    const updateFileList = (updateFile: UploadFile, updateObj: Partial<UploadFile>) => {
        setFileList(prevList => {
            return prevList.map(file => {
                if (file.uid === updateFile.uid){
                    return {...file, ...updateObj}
                }else{
                    return file
                }
            })
        })
    }
    const handleClick = () => {
        if (fileInput.current){
            fileInput.current.click()
        }
    }
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files){
            return
        }
        uploadFiles(files)
        if (fileInput.current){
            fileInput.current.value = ''
        }
    }
    const handleRemove = (file: UploadFile) => {
        setFileList((prevList) => {
            return prevList.filter(item => item.uid !== file.uid)
        })
        if (onRemove){
            onRemove(file)
        }
    }
    const uploadFiles = (files: FileList, test?: boolean) => {
        // 先把fileList从对象转成数组
        let postFiles = Array.from(files)
        // 这个旗子留给拖拽功能来看
        if (test){
            console.log('drag', postFiles[0])
        }
        postFiles.forEach(file => {
            if (!beforeUpload){
                post(file)
            }else{
                const result = beforeUpload(file)
                if (result && result instanceof Promise){
                    result.then(processedFile => {
                        post(processedFile)
                    })
                }else if (result !== false){
                    post(file)
                }
            }
        })
    }
    const post = (file: File) => {
        let _file: UploadFile = {
            uid: Date.now() + 'upload-file',
            status: 'ready',
            name: file.name,
            size: file.size,
            percent: 0,
            raw: file
        }
        setFileList(prevList => {
            return [_file, ...prevList]
        })
        const formData = new FormData()
        formData.append(name || 'file', file)
        // data是组件参数中可选的附带数据，这个写法是固定写法，别想太多
        if (data){
            Object.keys(data).forEach(key => {
                formData.append(key, data[key])
            })
        }
        axios.post(action, formData, {
            headers: {
                ...headers, 
                // 这个config也可以不加，但会慢
                'Content-Type': 'multipart/form-data'
            },
            withCredentials,
            // axios内置属性
            onUploadProgress: (e) => {
                // 文档里没加非空判定，但我不加就报错
                if(e.total){
                    let percentage = Math.round((e.loaded * 100) / e.total) || 0;
                if (percentage < 100){
                    updateFileList(_file, {percent: percentage, status: 'uploading'})
                    _file.status = 'uploading'
                    _file.percent = percentage
                    // 这个属性我觉得有点多余，需要留意下是否有实际场景
                    if (onProgress){
                        onProgress(percentage, _file)
                    }
                }
                }
            }
            // 把axios的返回值拿出来
        }).then(resp => {
            updateFileList(_file, {status: 'success', response: resp.data})
            _file.status = 'success'
            _file.response = resp.data
            if (onSuccess){
                onSuccess(resp.data, _file)
            }
            if (onChange){
                onChange(_file)
            }
            // promise返回一个reject对象
        }).catch(err => {
            updateFileList(_file, {status: 'error', error: err})
            _file.status = 'error'
            _file.error = err
            if (onError){
                onError(err, _file)
            }
            if (onChange){
                onChange(_file)
            }
        })
    }
    return(
        <div
            className="rf-upload-component"
        >
            <div
                className="rf-upload-input"
                style={{display: 'inline-block'}}
                onClick={handleClick}
            >
                {drag ? 
                    <Dragger onFile={(files) => {uploadFiles(files, true)}}>
                        {children}
                    </Dragger>:
                    children
                }
                <input
                    className="rf-file-input"
                    style={{display: 'none'}}
                    ref={fileInput}
                    onChange={handleFileChange}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                />
            </div>
            <UploadList 
                fileList={fileList}
                onRemove={handleRemove}
            />
        </div>
    )
}

export default Upload