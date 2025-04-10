import * as React from 'react';

interface LogoutIconProps {
    className?: string;
}

export const LogoutIcon: React.FC<LogoutIconProps> = (props: LogoutIconProps) => {
    return (
        <svg width="55" height="55" viewBox="0 0 55 55" className={props.className} fill="none">
        <path d="M35.4,4v2.8c8.9,3.2,15.3,11.8,15.3,21.9c0,12.8-10.4,23.2-23.2,23.2S4.3,41.5,4.3,28.6c0-10,6.4-18.6,15.3-21.9V4
            C9.2,7.4,1.6,17.1,1.6,28.6c0,14.3,11.6,25.9,25.9,25.9s25.9-11.6,25.9-25.9C53.4,17.1,45.8,7.4,35.4,4z"/>
        <path d="M27.5,29.3c1.7,0,3.1-1.4,3.1-3.1V3.6c0-1.7-1.4-3.1-3.1-3.1s-3.1,1.4-3.1,3.1v22.5C24.4,27.9,25.8,29.3,27.5,29.3z"/>
                
        </svg>
    );
};
