import * as React from 'react';

interface ArrowRightsProps {
    className?: string; 
}

export const ArrowRights: React.FC<ArrowRightsProps> = (props: ArrowRightsProps) => (
    <svg width="16" height="28" viewBox="0 0 16 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className}>
    	<polygon points="16,14 1.2,28 0,28 0,25.4 12.2,14 0,2.6 0,0 1.2,0 " fill="var(--accent)"/> 
    </svg>
);
