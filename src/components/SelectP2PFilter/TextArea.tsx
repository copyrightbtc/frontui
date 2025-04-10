import React, { useState, ReactNode } from "react";

export interface TextAreaProps {
    id?: string;
    value: string;
    name?: string;
    disabled?: boolean;
    placeholder?: string;
    onChange: (value: string) => void;
    minLength?: number;
    maxLength?: number;
    error?: boolean;
    rows?: number;
    suffix?: ReactNode,
}

const TextArea = (props: TextAreaProps) => {
    const { suffix, id, error, value, name, disabled, placeholder, onChange, rows = 3, ...rest } = props;
    const [focused, setFocused] = useState(false);

    return (
        <div className={`text-area-wrapper${focused ? " focused" : ""}${error ? " error" : ""}`}>
            <textarea
                {...rest}
                id={id}
                name={name}
                value={value}
                rows={rows}
                disabled={disabled}
                placeholder={placeholder}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onChange={(e) => onChange(e.target.value ?? "")}
            />
            {suffix}
        </div>
    );
};

export default TextArea;