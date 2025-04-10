import * as React from 'react';

interface ProfileMenuIconProps {
    className?: string; 
}

export const ProfileMenuIcon: React.FC<ProfileMenuIconProps> = (props: ProfileMenuIconProps) => (
    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className}>
    <path d="M50.9,52.5c0,1.3-1.1,2.4-2.4,2.4s-2.4-1.1-2.4-2.4c0-10.3-8.4-18.7-18.7-18.7c-10.3,0-18.7,8.4-18.7,18.7
        c0,1.3-1.1,2.4-2.4,2.4c-1.3,0-2.4-1.1-2.4-2.4c0-12.9,10.5-23.4,23.4-23.4S50.9,39.6,50.9,52.5z M13.3,14.3
        c0-7.8,6.4-14.2,14.2-14.2c7.8,0,14.2,6.4,14.2,14.2c0,7.8-6.4,14.2-14.2,14.2C19.7,28.5,13.3,22.2,13.3,14.3z M27.5,23.8
        c5.2,0,9.5-4.3,9.5-9.5s-4.3-9.5-9.5-9.5S18,9.1,18,14.3S22.3,23.8,27.5,23.8z"/>
    </svg> 
);