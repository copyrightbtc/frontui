import * as React from 'react';

interface CheckIconProps {
    className?: string;
}

export const CheckIcon: React.FC<CheckIconProps> = (props: CheckIconProps) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className}>
        <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path>
    </svg>
);
