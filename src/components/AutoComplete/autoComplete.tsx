import React, {FC, useState, ChangeEvent, KeyboardEvent, ReactElement, useEffect, useRef} from "react";
import classNames from "classnames";
import Icon from "../Icon/icon";
import Input, {InputProps} from "../Input/input";
import Transition from "../Transition/transition";
import useDebounce from "../../hooks/useDebounce";
import useClickOutside from "../../hooks/useClickOutside";
import { data } from "jquery";

interface DataSourceObject{
    value: string;
}
export type DataSourceType<T = {}> = T & DataSourceObject
export interface AutoCompleteProps extends Omit<InputProps, 'onSelect' | 'onChange'> {
    /**
   * 返回输入建议的方法，可以拿到当前的输入，然后返回同步的数组或者是异步的 Promise
   * type DataSourceType<T = {}> = T & DataSourceObject
   */
    fetchSuggestions: (str: string) => DataSourceType [] | Promise<DataSourceType[]>;
    /** 点击推荐项目后，触发回调 */
    onSelect?: (item:DataSourceType) => void;
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

export const AutoComplete: FC<AutoCompleteProps> = (props) => {
    const{
        fetchSuggestions,
        onSelect,
        onChange,
        value,
        renderOption,
        ...restProps
    } = props
    const [inputValue, setInputValue] = useState(value as string)
    const [suggestions, setSuggestions] = useState<DataSourceType[]>([])
    const [loading, setLoading] = useState(false)
    const [showDown, setShowDown] = useState(false)
    const [highlightIndex, setHighlightIndex] = useState(-1)
    const triggerSearch = useRef(false)
    const componentRef = useRef<HTMLDivElement>(null)
    const debouncedValue = useDebounce(inputValue, 500)
    useClickOutside(componentRef, () => {setSuggestions([])})
    useEffect(() => {
        if (debouncedValue && triggerSearch.current){
            setSuggestions([])
            const results = fetchSuggestions(debouncedValue)
            if (results instanceof Promise){
                setLoading(true)
                results.then(data => {
                    setLoading(false)
                    setSuggestions(data)
                    if (data.length > 0){
                        setShowDown(true)
                    }
                })
            }else{
                setSuggestions(results)
                // setShowDown(true)
                if (results.length > 0){
                    setShowDown(true)
                }
            }
        }else{
            setShowDown(false)
        }
        // 先初始化成，没有高亮
        setHighlightIndex(-1)
    }, [debouncedValue, fetchSuggestions])
    const highlight = (index: number) => {
        // 这种if后面，有没有花括号都行
        if (index < 0){index = 0}
        if (index >= suggestions.length) {index = suggestions.length - 1}
        setHighlightIndex(index)
    }
    const handleSelect = (item: DataSourceType) => {
        setInputValue(item.value)
        setShowDown(false)
        if (onSelect){
            onSelect(item)
        }
        // 不要再触发推荐值的检索了
        triggerSearch.current = false
    }
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        // keyCode弃用了，所以用key来返回按键值，用code返回键位值，具体的看这里：https://developer.mozilla.org/zh-CN/docs/Web/API/KeyboardEvent/code
        // 写key能少打几个字，我就key了
        switch (e.key){
            case 'Enter':
                if (suggestions[highlightIndex]){
                    handleSelect(suggestions[highlightIndex])
                }
                break
            case 'ArrowUp':
                highlight(highlightIndex - 1)
                break
            case 'ArrowDown':
                highlight(highlightIndex + 1)
                break
            case 'Escape':
                setShowDown(false)
                break
            default:
                break
        }
    }
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        // 去空格
        const value = e.target.value.trim()
        setInputValue(value)
        if (onChange){
            onChange(value)
        }
        // 发起检索的flag，用ref而非State，就是防止请求在线库的异步情况
        // 不行你试试在这里拿到的State是什么
        triggerSearch.current = true
    }
    // 自定义提示框的样式
    const renderTemplate = (item: DataSourceType) => {
        return renderOption ? renderOption(item) : item.value
    }
    const generateDropdown = () => {
        return (
            <Transition
            in={showDown || loading}
            animation='zoom-in-top'
            timeout={300}
            onExited={() => {setSuggestions([])}}
            >
                <ul className="rf-suggestion-list">
                    {loading && 
                        <div className="suggestion-loading-icon">
                            <Icon icon="spinner" spin/>
                        </div>
                    }
                    {suggestions.map((item, index) => {
                        // cnames写到外面也一样
                        const cnames = classNames('suggestion-item', {
                            'is-active': index === highlightIndex
                        })
                        return (
                            <li key={index} className={cnames} onClick={() => handleSelect(item)}>
                                {renderTemplate(item)}
                            </li>
                        )
                    })}
                </ul>
            </Transition>
        )
    }
    return (
        <div className="rf-auto-complete" ref={componentRef}>
            <Input
            {...restProps}
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            />
            {generateDropdown()}
        </div>
    )
}

export default AutoComplete