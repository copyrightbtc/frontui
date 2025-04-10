import * as React from 'react';

interface CloseIconProps {
    className?: string;
    onClick?: (e?: any) => void;
}

export const CloseIcon: React.FC<CloseIconProps> = (props: CloseIconProps) => {
    return (
        <svg width="21" height="21" viewBox="0 0 21 21" className={props.className} onClick={props.onClick} fill="none">
            <path d="M17.5,4.9l-1.4-1.4l-5.6,5.6L4.9,3.5L3.5,4.9l5.6,5.6l-5.6,5.6l1.4,1.4l5.6-5.6l5.6,5.6l1.4-1.4l-5.6-5.6L17.5,4.9z"/>
        </svg>
    );
};

export const HugeCloseIcon: React.FC<CloseIconProps> = (props: CloseIconProps) => {
    return (
        <svg width="26" height="25" viewBox="0 0 26 25" className={props.className} onClick={props.onClick} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.35978e-07 22.0625L9.54167 12.5L0 2.9375L2.9375 0L15.4375 12.5L2.9375 25L8.35978e-07 22.0625Z"/>
            <path d="M25.4375 22.0625L15.8958 12.5L25.4375 2.9375L22.5 0L10 12.5L22.5 25L25.4375 22.0625Z"/>
        </svg>
    );
};
