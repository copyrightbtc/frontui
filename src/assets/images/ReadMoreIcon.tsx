import * as React from 'react';

interface ReadMoreIconProps {
    className?: string; 
}

export const ReadMoreIcon: React.FC<ReadMoreIconProps> = (props: ReadMoreIconProps) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" className={props.className} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 7h9v2h-9zm0 8h9v2h-9zm3-4h6v2h-6zm-3 1L8 7v4H2v2h6v4z"/>
        </svg>
    );
};
