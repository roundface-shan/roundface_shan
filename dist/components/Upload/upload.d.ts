import React, { FC } from "react";
export type UploadFileStatus = 'ready' | 'uploading' | 'success' | 'error';
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
    headers?: {
        [key: string]: any;
    };
    /** 上传文件的字段名 */
    name?: string;
    /** 附带上传的参数 */
    data?: {
        [key: string]: any;
    };
    /** 支持发送cookie信息 */
    withCredentials?: boolean;
    /** 允许上传的文件类型 */
    accept?: string;
    /** 是否支持文件多选 */
    multiple?: boolean;
    /** 是否支持拖拽上传 */
    drag?: boolean;
    children?: React.ReactNode;
}
/**
 * 通过点击或者拖拽上传文件
 * ### 引用方法
 *
 * ~~~js
 * import { Upload } from 'vikingship'
 * ~~~
 */
export declare const Upload: FC<UploadProps>;
export default Upload;
