import * as React from 'react';

interface AddImageIconProps {
    className?: string;
    onClick?: (e?: any) => void;
}

export const AddImageIcon: React.FC<AddImageIconProps> = (props: AddImageIconProps) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" className={props.className} onClick={props.onClick} fill="none">
            <path d="M19 7v2.99s-1.99.01-2 0V7h-3s.01-1.99 0-2h3V2h2v3h3v2zm-3 4V8h-3V5H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8zM5 19l3-4 2 3 3-4 4 5z"/>
        </svg>
    );
};

