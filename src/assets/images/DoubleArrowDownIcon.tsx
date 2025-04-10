import * as React from 'react';

interface DoubleArrowDownIconProps {
    className?: string;
}

export const DoubleArrowDownIcon: React.FC<DoubleArrowDownIconProps> = (props: DoubleArrowDownIconProps) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" className={props.className} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.9,2.8l-2.3-2.3L12,8L4.5,0.5L2.1,2.8l9.9,9.9L21.9,2.8z M21.9,13.6l-2.3-2.3L12,18.9l-7.5-7.5l-2.3,2.3l9.9,9.9
                L21.9,13.6z"/>
        </svg>
    );
};
