import * as React from 'react';

interface MenuIconProps {
    className?: string;
}

export const MenuIcon: React.FC<MenuIconProps> = (props: MenuIconProps) => (
    <svg version="1.1" viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg" className={props.className}>
        <path d="M3 18h18v-2H3zm0-5h18v-2H3zm0-7v2h18V6z"/>
    </svg>
);