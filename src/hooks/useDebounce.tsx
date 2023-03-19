import { useState, useEffect } from "react";

function useDebounce(value: any, delay = 300){
    const [debouncedValue, setdebouncedValue] = useState(value)
    useEffect(() => {
        const handler = window.setTimeout(() => {
            setdebouncedValue(value)
        }, delay)
        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])
    return debouncedValue
}

export default useDebounce;