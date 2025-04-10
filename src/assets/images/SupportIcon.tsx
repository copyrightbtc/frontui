import * as React from 'react';

interface SupportIconProps {
    className?: string; 
}

export const SupportIcon: React.FC<SupportIconProps> = (props: SupportIconProps) => {
    return (
        <svg width="36" height="36" viewBox="0 0 36 36" className={props.className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18,0.6c9.2,0,16.8,7.2,17.4,16.2c0.1,0.6,0.2,1.2,0.1,1.8l-0.4,2.3c-0.4,2.5-2.8,4.3-5.3,3.9l-2.3-0.4l1.8-11.5l2.3,0.4
            c0.3,0,0.6,0.1,0.8,0.2C30.5,7.3,24.7,2.9,18,2.9c-6.9,0-12.7,4.6-14.5,10.8c0.4-0.2,0.9-0.4,1.4-0.5l0,0l2.3-0.4L9,24.4l-2.3,0.4
            c-0.8,0.1-1.7,0-2.4-0.3c2.3,4.8,7,8.2,12.5,8.6l0,2.3C7.7,34.8,0.5,27.3,0.5,18C0.5,8.4,8.3,0.6,18,0.6z M5.2,15.6
            c-1.3,0.2-2.1,1.4-1.9,2.7l0,0l0.4,2.3c0.2,1.3,1.4,2.1,2.7,1.9l0,0L5.2,15.6z M31.2,15.6l-1.1,6.9c1.3,0.2,2.5-0.7,2.7-1.9
            l0.4-2.3C33.3,16.9,32.5,15.8,31.2,15.6z"/> 
        </svg>
    );
};
