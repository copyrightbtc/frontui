import * as React from 'react';

interface FilterIconProps {
    className?: string; 
}

export const FilterIcon: React.FC<FilterIconProps> = (props: FilterIconProps) => {
    return (
        <svg width="55" height="55" viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M54.3,2c0.4,1,0.3,1.9-0.5,2.7L34.9,23.6V52c0,1.1-0.5,1.8-1.5,2.3c-0.3,0.1-0.7,0.2-1,0.2c-0.7,0-1.3-0.2-1.7-0.7l-9.8-9.8
	            c-0.5-0.5-0.7-1.1-0.7-1.7V23.6L1.3,4.7C0.5,4,0.3,3.1,0.7,2C1.2,1,1.9,0.5,3,0.5h49C53.1,0.5,53.8,1,54.3,2z" fill="#fff"/>
        </svg>
    );
};