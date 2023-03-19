var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import Icon from "../Icon/icon";
import Input from "../Input/input";
import Transition from "../Transition/transition";
import useDebounce from "../../hooks/useDebounce";
import useClickOutside from "../../hooks/useClickOutside";
/**
 * 输入框自动填充。支持本地库的同步和线上库的异步
 * 支持 Input 组件的所有属性，支持键盘事件
 * ### 引用方法
 *
 * ~~~js
 * import {AutoCompelete} from 'roundface_shan'
 * ~~~
 */
export const AutoComplete = (props) => {
    const { fetchSuggestions, onSelect, onChange, value, renderOption } = props, restProps = __rest(props, ["fetchSuggestions", "onSelect", "onChange", "value", "renderOption"]);
    const [inputValue, setInputValue] = useState(value);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDown, setShowDown] = useState(false);
    const [highlightIndex, setHighlightIndex] = useState(-1);
    const triggerSearch = useRef(false);
    const componentRef = useRef(null);
    const debouncedValue = useDebounce(inputValue, 500);
    useClickOutside(componentRef, () => { setSuggestions([]); });
    useEffect(() => {
        if (debouncedValue && triggerSearch.current) {
            setSuggestions([]);
            const results = fetchSuggestions(debouncedValue);
            if (results instanceof Promise) {
                setLoading(true);
                results.then(data => {
                    setLoading(false);
                    setSuggestions(data);
                    if (data.length > 0) {
                        setShowDown(true);
                    }
                });
            }
            else {
                setSuggestions(results);
                // setShowDown(true)
                if (results.length > 0) {
                    setShowDown(true);
                }
            }
        }
        else {
            setShowDown(false);
        }
        // 先初始化成，没有高亮
        setHighlightIndex(-1);
    }, [debouncedValue, fetchSuggestions]);
    const highlight = (index) => {
        // 这种if后面，有没有花括号都行
        if (index < 0) {
            index = 0;
        }
        if (index >= suggestions.length) {
            index = suggestions.length - 1;
        }
        setHighlightIndex(index);
    };
    const handleSelect = (item) => {
        setInputValue(item.value);
        setShowDown(false);
        if (onSelect) {
            onSelect(item);
        }
        // 不要再触发推荐值的检索了
        triggerSearch.current = false;
    };
    const handleKeyDown = (e) => {
        // keyCode弃用了，所以用key来返回按键值，用code返回键位值，具体的看这里：https://developer.mozilla.org/zh-CN/docs/Web/API/KeyboardEvent/code
        // 写key能少打几个字，我就key了
        switch (e.key) {
            case 'Enter':
                if (suggestions[highlightIndex]) {
                    handleSelect(suggestions[highlightIndex]);
                }
                break;
            case 'ArrowUp':
                highlight(highlightIndex - 1);
                break;
            case 'ArrowDown':
                highlight(highlightIndex + 1);
                break;
            case 'Escape':
                setShowDown(false);
                break;
            default:
                break;
        }
    };
    const handleChange = (e) => {
        // 去空格
        const value = e.target.value.trim();
        setInputValue(value);
        if (onChange) {
            onChange(value);
        }
        // 发起检索的flag，用ref而非State，就是防止请求在线库的异步情况
        // 不行你试试在这里拿到的State是什么
        triggerSearch.current = true;
    };
    // 自定义提示框的样式
    const renderTemplate = (item) => {
        return renderOption ? renderOption(item) : item.value;
    };
    const generateDropdown = () => {
        return (React.createElement(Transition, { in: showDown || loading, animation: 'zoom-in-top', timeout: 300, onExited: () => { setSuggestions([]); } },
            React.createElement("ul", { className: "rf-suggestion-list" },
                loading &&
                    React.createElement("div", { className: "suggestion-loading-icon" },
                        React.createElement(Icon, { icon: "spinner", spin: true })),
                suggestions.map((item, index) => {
                    // cnames写到外面也一样
                    const cnames = classNames('suggestion-item', {
                        'is-active': index === highlightIndex
                    });
                    return (React.createElement("li", { key: index, className: cnames, onClick: () => handleSelect(item) }, renderTemplate(item)));
                }))));
    };
    return (React.createElement("div", { className: "rf-auto-complete", ref: componentRef },
        React.createElement(Input, Object.assign({}, restProps, { value: inputValue, onChange: handleChange, onKeyDown: handleKeyDown })),
        generateDropdown()));
};
export default AutoComplete;
