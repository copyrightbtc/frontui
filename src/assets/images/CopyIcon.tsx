import * as React from 'react';

interface CopyIconProps {
    className?: string;
}

export const CopyIcon: React.FC<CopyIconProps> = (props: CopyIconProps) => {
    return (
        <svg width="21" height="21" viewBox="0 0 21 21" className={props.className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15,0.5H3c-1.1,0-2,0.8-2,1.8V15h2V2.3h12V0.5z M18,4.1H7C5.9,4.1,5,5,5,6v12.7c0,1,0.9,1.8,2,1.8h11c1.1,0,2-0.8,2-1.8V6
            C20,5,19.1,4.1,18,4.1 M18,18.7H7V6h11V18.7z"/>
        </svg>
    );
};
 