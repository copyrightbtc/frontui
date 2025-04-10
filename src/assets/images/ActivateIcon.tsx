import * as React from 'react';

interface ActivateIconProps {
    className?: string; 
}

export const ActivateIcon: React.FC<ActivateIconProps> = (props: ActivateIconProps) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" className={props.className} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
        </svg>
    );
};
