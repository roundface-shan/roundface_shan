import React, { useRef, useState } from "react";
import axios from "axios";
import UploadList from "./uploadList";
import Dragger from './dragger';
/**
 * 通过点击或者拖拽上传文件
 * ### 引用方法
 *
 * ~~~js
 * import { Upload } from 'vikingship'
 * ~~~
 */
export const Upload = (props) => {
    const { action, defaultFileList, beforeUpload, onProgress, onSuccess, onError, onChange, onRemove, name, headers, data, withCredentials, accept, multiple, children, drag, } = props;
    const fileInput = useRef(null);
    const [fileList, setFileList] = useState(defaultFileList || []);
    // 这里是更新等待上传文件列表中的文件状态，不要误解成上传
    const updateFileList = (updateFile, updateObj) => {
        setFileList(prevList => {
            return prevList.map(file => {
                if (file.uid === updateFile.uid) {
                    return Object.assign(Object.assign({}, file), updateObj);
                }
                else {
                    return file;
                }
            });
        });
    };
    const handleClick = () => {
        if (fileInput.current) {
            fileInput.current.click();
        }
    };
    const handleFileChange = (e) => {
        const files = e.target.files;
        if (!files) {
            return;
        }
        uploadFiles(files);
        if (fileInput.current) {
            fileInput.current.value = '';
        }
    };
    const handleRemove = (file) => {
        setFileList((prevList) => {
            return prevList.filter(item => item.uid !== file.uid);
        });
        if (onRemove) {
            onRemove(file);
        }
    };
    const uploadFiles = (files, test) => {
        // 先把fileList从对象转成数组
        let postFiles = Array.from(files);
        // 这个旗子留给拖拽功能来看
        if (test) {
            console.log('drag', postFiles[0]);
        }
        postFiles.forEach(file => {
            if (!beforeUpload) {
                post(file);
            }
            else {
                const result = beforeUpload(file);
                if (result && result instanceof Promise) {
                    result.then(processedFile => {
                        post(processedFile);
                    });
                }
                else if (result !== false) {
                    post(file);
                }
            }
        });
    };
    const post = (file) => {
        let _file = {
            uid: Date.now() + 'upload-file',
            status: 'ready',
            name: file.name,
            size: file.size,
            percent: 0,
            raw: file
        };
        setFileList(prevList => {
            return [_file, ...prevList];
        });
        const formData = new FormData();
        formData.append(name || 'file', file);
        // data是组件参数中可选的附带数据，这个写法是固定写法，别想太多
        if (data) {
            Object.keys(data).forEach(key => {
                formData.append(key, data[key]);
            });
        }
        axios.post(action, formData, {
            headers: Object.assign(Object.assign({}, headers), { 
                // 这个config也可以不加，但会慢
                'Content-Type': 'multipart/form-data' }),
            withCredentials,
            // axios内置属性
            onUploadProgress: (e) => {
                // 文档里没加非空判定，但我不加就报错
                if (e.total) {
                    let percentage = Math.round((e.loaded * 100) / e.total) || 0;
                    if (percentage < 100) {
                        updateFileList(_file, { percent: percentage, status: 'uploading' });
                        _file.status = 'uploading';
                        _file.percent = percentage;
                        // 这个属性我觉得有点多余，需要留意下是否有实际场景
                        if (onProgress) {
                            onProgress(percentage, _file);
                        }
                    }
                }
            }
            // 把axios的返回值拿出来
        }).then(resp => {
            updateFileList(_file, { status: 'success', response: resp.data });
            _file.status = 'success';
            _file.response = resp.data;
            if (onSuccess) {
                onSuccess(resp.data, _file);
            }
            if (onChange) {
                onChange(_file);
            }
            // promise返回一个reject对象
        }).catch(err => {
            updateFileList(_file, { status: 'error', error: err });
            _file.status = 'error';
            _file.error = err;
            if (onError) {
                onError(err, _file);
            }
            if (onChange) {
                onChange(_file);
            }
        });
    };
    return (React.createElement("div", { className: "rf-upload-component" },
        React.createElement("div", { className: "rf-upload-input", style: { display: 'inline-block' }, onClick: handleClick },
            drag ?
                React.createElement(Dragger, { onFile: (files) => { uploadFiles(files, true); } }, children) :
                children,
            React.createElement("input", { className: "rf-file-input", style: { display: 'none' }, ref: fileInput, onChange: handleFileChange, type: "file", accept: accept, multiple: multiple })),
        React.createElement(UploadList, { fileList: fileList, onRemove: handleRemove })));
};
export default Upload;
