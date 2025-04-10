import * as React from 'react';

interface CancelallIconProps {
    className?: string; 
}

export const CancelallIcon: React.FC<CancelallIconProps> = (props: CancelallIconProps) => {
    return (
        <svg width="55" height="55" viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg"> 
            <path d="M0.5,50.4l12-12l-6.9-6.9h18v18.1l-7-7l-12,12L0.5,50.4z M54.5,50.4l-12-12l6.9-6.9h-18v18.1l7-7l12,12
	            L54.5,50.4z M54.5,4.6l-12,12l6.9,6.9h-18V5.5l7,7l12-12L54.5,4.6z M0.5,4.6l12,12l-6.9,6.9h18V5.5l-7,7l-12-12L0.5,4.6z" fill="#fff"/>
        </svg>
    );
};