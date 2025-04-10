import * as React from 'react';

interface ArrowBackIconProps {
    className?: string; 
}

export const ArrowBackIcon: React.FC<ArrowBackIconProps> = (props: ArrowBackIconProps) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" className={props.className} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z"/>
        </svg>
    );
};
