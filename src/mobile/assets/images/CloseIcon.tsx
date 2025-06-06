import * as React from 'react';

interface CloseIconProps {
    className?: string; 
}

export const CloseIcon: React.FC<CloseIconProps> = (props: CloseIconProps) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.4 12l6.6 6.6-1.4 1.4-6.6-6.6L5.4 20 4 18.6l6.6-6.6L4 5.4 5.4 4l6.6 6.6L18.6 4 20 5.4 13.4 12z" fill="#737F92"/>
        </svg>
    );
};

 
 
