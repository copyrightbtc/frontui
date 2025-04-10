import * as React from 'react';

interface OrdertypeIconProps {
    className?: string; 
}

export const OrdertypeIcon: React.FC<OrdertypeIconProps> = (props: OrdertypeIconProps) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className}>
    	<polygon points="0,10.5 2.1,8.3 7.8,13.9 5.6,16.1 4.8,16.1 0,11.3 " fill="#768398"/>
        <rect x="4.5" y="4.1" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -3.3312 8.0425)" width="7.2" height="7.9" fill="#768398"/>
        <path d="M10.5,12.4l2-2l11.2,11.2c0.5,0.5,0.5,1.3,0,1.8l-0.2,0.2c-0.5,0.5-1.3,0.5-1.8,0L10.5,12.4z" fill="#768398"/>
        <polygon points="11.3,0 16.1,4.8 16.1,5.6 13.9,7.8 8.3,2.1 10.5,0 " fill="#768398"/>
        <path d="M0,22.6L0,22.6c0-0.8,0.6-1.4,1.4-1.4h14.4c0.8,0,1.4,0.6,1.4,1.4v0c0,0.8-0.6,1.4-1.4,1.4H1.4 C0.6,24,0,23.4,0,22.6z" fill="#768398"/>
    </svg>
);
