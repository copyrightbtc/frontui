import * as React from 'react';

interface ArrowDownwardProps {
    className?: string;
}

export const ArrowDownward: React.FC<ArrowDownwardProps> = (props: ArrowDownwardProps) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" className={props.className} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="m20 12-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8z"/>
        </svg>
    );
};
