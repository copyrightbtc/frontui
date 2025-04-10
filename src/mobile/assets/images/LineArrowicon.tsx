import * as React from 'react';

interface LineArrowiconProps {
    className?: string; 
}

export const LineArrowicon: React.FC<LineArrowiconProps> = (props: LineArrowiconProps) => (
    <svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className}>
        <polygon points="12,6 10.7,7.3 6.9,3.5 6.9,16 5.1,16 5.1,3.5 1.3,7.3 0,6 6,0 "/>
    </svg>
);
