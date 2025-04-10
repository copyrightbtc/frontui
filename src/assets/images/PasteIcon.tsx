import * as React from 'react';

interface PasteIconProps {
    className?: string;
}

export const PasteIcon: React.FC<PasteIconProps> = (props: PasteIconProps) => {
    return (
        <svg width="21" height="21" viewBox="0 0 21 21" className={props.className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3,4.5h2v3h10v-3h2v6h2v-6c0-1.1-0.9-2-2-2h-4.2c-0.4-1.2-1.5-2-2.8-2s-2.4,0.8-2.8,2H3c-1.1,0-2,0.9-2,2v14
            c0,1.1,0.9,2,2,2h5v-2H3V4.5z M10,2.5c0.6,0,1,0.5,1,1s-0.4,1-1,1s-1-0.4-1-1S9.4,2.5,10,2.5 M16,12.5l-1.4,1.4l1.6,1.6H10v2h6.2
            l-1.6,1.6l1.4,1.4l4-4L16,12.5z"/>
        </svg>
    );
};
