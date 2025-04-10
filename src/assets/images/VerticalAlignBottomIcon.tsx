import * as React from 'react';

interface VerticalAlignBottomIconProps {
    className?: string; 
}

export const VerticalAlignBottomIcon: React.FC<VerticalAlignBottomIconProps> = (props: VerticalAlignBottomIconProps) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" className={props.className} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 13h-3V3h-2v10H8l4 4zM4 19v2h16v-2z"/>
        </svg>
    );
};
