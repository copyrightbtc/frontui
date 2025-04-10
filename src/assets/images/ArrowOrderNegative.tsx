import * as React from 'react';

interface ArrowOrderNegativeProps {
    className?: string; 
}

export const ArrowOrderNegative: React.FC<ArrowOrderNegativeProps> = (props: ArrowOrderNegativeProps) => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className}>
        <path d="M17,16.8c0,0.5-0.4,0.9-0.9,0.9H1.9c-0.5,0-0.9-0.4-0.9-0.9c0-0.5,0.4-0.9,0.9-0.9h14.2C16.6,15.9,17,16.3,17,16.8z
            M3.8,0.6L14,10.9V4.4c0-0.5,0.4-0.9,0.9-0.9c0.5,0,0.9,0.4,0.9,0.9V13c0,0.1,0,0.2-0.1,0.3c0,0.1-0.1,0.1-0.1,0.2c0,0,0,0.1,0,0.1
            c0,0,0,0,0,0c0,0,0,0-0.1,0c-0.1,0.1-0.1,0.1-0.2,0.1c-0.1,0-0.2,0.1-0.3,0.1H6.3c-0.5,0-0.9-0.4-0.9-0.9c0-0.5,0.4-0.9,0.9-0.9h6.5
            L2.5,1.9C2.2,1.5,2.2,1,2.5,0.6C2.9,0.3,3.4,0.3,3.8,0.6z" fill="var(--color-sell)"/>
    </svg>
);
