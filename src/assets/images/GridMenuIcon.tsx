import * as React from 'react';

interface GridMenuIconProps {
    className?: string; 
}

export const GridMenuIcon: React.FC<GridMenuIconProps> = (props: GridMenuIconProps) => (
    <svg width="36" height="v" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className}>
        <path d="M18,35.5C8.4,35.5,0.6,27.6,0.6,18C0.6,8.4,8.4,0.5,18,0.5S35.5,8.4,35.5,18C35.5,27.6,27.7,35.5,18,35.5z M18,2.8
            C9.6,2.8,2.8,9.6,2.8,18S9.6,33.2,18,33.2c8.4,0,15.2-6.8,15.2-15.2S26.4,2.8,18,2.8z M9.6,20.6h5v-5.2h-5V20.6z M15.5,20.6h5v-5.2
            h-5V20.6z M21.5,15.4v5.2h5v-5.2H21.5z M9.6,26.7h5v-5.1h-5V26.7z M15.5,21.6v5.1h5v-5.1H15.5z M21.5,21.6v5.1h5v-5.1H21.5z
            M9.6,14.4h5V9.3h-5V14.4z M15.5,14.4h5V9.3h-5V14.4z M21.5,9.3v5.1h5V9.3H21.5z"/>
    </svg> 
);