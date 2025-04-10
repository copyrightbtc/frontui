import * as React from 'react';

interface SearchIconProps {
    className?: string;
}

export const SearchIcon: React.FC<SearchIconProps> = (props: SearchIconProps) => (
    <svg version="1.1" viewBox="0 0 50 50" height="50" width="50" xmlns="http://www.w3.org/2000/svg" className={props.className}>
        <path d="M48.9,46.1L38.9,36c3.1-3.8,5-8.6,5-13.8c0-12-9.7-21.7-21.7-21.7S0.5,10.2,0.5,22.2c0,12,9.7,21.7,21.7,21.7
            c5.3,0,10.1-1.9,13.8-5l10.1,10c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6C49.7,48.1,49.7,46.9,48.9,46.1z M22.2,39.9
            c-9.8,0-17.7-7.9-17.7-17.7S12.4,4.5,22.2,4.5c9.8,0,17.7,7.9,17.7,17.7S31.9,39.9,22.2,39.9z"/>
    </svg>
);