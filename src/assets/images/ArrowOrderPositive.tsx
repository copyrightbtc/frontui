import * as React from 'react';

interface ArrowOrderPositiveProps {
    className?: string; 
}

export const ArrowOrderPositive: React.FC<ArrowOrderPositiveProps> = (props: ArrowOrderPositiveProps) => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className}>
        <path d="M17,16.8c0,0.5-0.4,0.9-0.9,0.9H1.9c-0.5,0-0.9-0.4-0.9-0.9c0-0.5,0.4-0.9,0.9-0.9h14.2C16.6,15.9,17,16.3,17,16.8z
            M2.5,13.6c-0.3-0.3-0.3-0.9,0-1.2L12.7,2.1H6.3c-0.5,0-0.9-0.4-0.9-0.9c0-0.5,0.4-0.9,0.9-0.9h8.6c0.1,0,0.2,0,0.3,0.1
            c0.1,0,0.2,0.1,0.2,0.1c0,0,0,0,0.1,0c0,0,0,0,0,0c0,0,0,0.1,0,0.1c0.1,0.1,0.1,0.1,0.1,0.2c0,0.1,0.1,0.2,0.1,0.3v8.6
            c0,0.5-0.4,0.9-0.9,0.9c-0.5,0-0.9-0.4-0.9-0.9V3.4L3.8,13.6C3.4,13.9,2.9,13.9,2.5,13.6z" fill="var(--color-buy)"/>
    </svg>
);
