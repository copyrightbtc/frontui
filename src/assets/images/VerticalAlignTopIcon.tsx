import * as React from 'react';

interface VerticalAlignTopIconProps {
    className?: string; 
}

export const VerticalAlignTopIcon: React.FC<VerticalAlignTopIconProps> = (props: VerticalAlignTopIconProps) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" className={props.className} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 11h3v10h2V11h3l-4-4zM4 3v2h16V3z"/>
        </svg>
    );
};
