import React, { ReactElement, InputHTMLAttributes, ChangeEvent } from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
type InputSize = 'lg' | 'sm';
export interface InputProps extends Omit<InputHTMLAttributes<HTMLElement>, 'size'> {
    disabled?: boolean;
    size?: InputSize;
    icon?: IconProp;
    prepend?: string | ReactElement;
    append?: string | ReactElement;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}
export declare const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>>;
export default Input;
