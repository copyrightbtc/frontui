import * as React from 'react';

interface ChevronDoubleProps {
    className?: string;
}

export const ChevronDouble: React.FC<ChevronDoubleProps> = (props: ChevronDoubleProps) => (
    <svg width="16" height="28" viewBox="0 0 16 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className}> 
        <polygon points="8,24 1.8,17.8 0.1,19.6 8,27.5 15.9,19.6 14.2,17.8 	" fill="var(--white)"/>
	    <polygon points="8,4 14.2,10.2 15.9,8.4 8,0.5 0.1,8.4 1.8,10.2 	" fill="var(--white)"/>
    </svg>
);
