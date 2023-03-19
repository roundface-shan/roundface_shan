import { FC, ReactElement } from "react";
import { InputProps } from "../Input/input";
interface DataSourceObject {
    value: string;
}
export type DataSourceType<T = {}> = T & DataSourceObject;
export interface AutoCompleteProps extends Omit<InputProps, 'onSelect' | 'onChange'> {
    /**
   * 返回输入建议的方法，可以拿到当前的输入，然后返回同步的数组或者是异步的 Promise
   * type DataSourceType<T = {}> = T & DataSourceObject
   */
    fetchSuggestions: (str: string) => DataSourceType[] | Promise<DataSourceType[]>;
    /** 点击推荐项目后，触发回调 */
    onSelect?: (item: DataSourceType) => void;
    /** 控制输入框，同步输入内容 */
    onChange?: (value: string) => void;
    /** 支持自定义下拉框的样式，返回ReactElement */
    renderOption?: (item: DataSourceType) => ReactElement;
}
/**
 * 输入框自动填充。支持本地库的同步和线上库的异步
 * 支持 Input 组件的所有属性，支持键盘事件
 * ### 引用方法
 *
 * ~~~js
 * import {AutoCompelete} from 'roundface_shan'
 * ~~~
 */
export declare const AutoComplete: FC<AutoCompleteProps>;
export default AutoComplete;
