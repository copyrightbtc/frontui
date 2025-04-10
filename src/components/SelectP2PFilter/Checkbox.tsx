import React, { ReactNode } from "react";
import { useUniqueId } from 'src/components/P2PTrading/useUniqueId';
interface CheckboxProps {
    id?: string;
    checked?: boolean
    label?: ReactNode;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
    name?: string
}

export default function Checkbox({ id: propId, label, ...rest }: CheckboxProps) {
    const id = useUniqueId("Checkbox", propId);
    return (
        <label htmlFor={id} className="checkbox-wrapper flex items-center">
            <input id={id} type="checkbox" {...rest} />
            <span className="checkmark"></span>
            {label && <span>{label}</span>}
        </label>
    );
}