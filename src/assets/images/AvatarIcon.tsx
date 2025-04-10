import * as React from 'react';

interface AvatarIconProps {
    className?: string;
}

export const AvatarIcon: React.FC<AvatarIconProps> = (props: AvatarIconProps) => (
    <svg width="121" height="121" viewBox="0 0 121 121" className={props.className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M60.5,0.5c-33.1,0-60,26.9-60,60s26.9,60,60,60s60-26.9,60-60S93.6,0.5,60.5,0.5z M99.3,92c-1.3-2.9-3.9-5-9.4-6.2
            c-11.5-2.6-22.1-5-17-14.7c15.7-29.7,4.2-45.6-12.4-45.6c-16.9,0-28.2,16.5-12.4,45.6c5.3,9.8-5.7,12.1-17,14.7
            c-5.4,1.3-8,3.3-9.3,6.2c-7-8.6-11.3-19.6-11.3-31.5c0-27.6,22.4-50,50-50s50,22.4,50,50C110.5,72.4,106.3,83.4,99.3,92z"/>
    </svg>
);

