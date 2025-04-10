import * as React from 'react';

interface DeactivateIconProps {
    className?: string; 
}

export const DeactivateIcon: React.FC<DeactivateIconProps> = (props: DeactivateIconProps) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" className={props.className} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.27 3 2 4.27l5 5V13h3v9l3.58-6.14L17.73 20 19 18.73zM17 10h-4l4-8H7v2.18l8.46 8.46z"/>
        </svg>
    );
};
