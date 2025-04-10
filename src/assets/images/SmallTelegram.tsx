import * as React from 'react';

interface SmallTelegramProps {
    className?: string; 
}

export const SmallTelegram: React.FC<SmallTelegramProps> = (props: SmallTelegramProps) => {
    return (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M35.5,3.2c-0.3-0.3-0.7-0.4-1-0.2L0.9,13.9c-0.4,0.1-0.6,0.4-0.7,0.8c-0.1,0.4,0.1,0.8,0.4,1L8.4,21L10,31.4
            c0,0,0,0.1,0,0.1l0,0.1l0.7,0.7h0.1l0,0l0.5,0l0.1,0l0,0l0.1-0.1c0,0,0.1,0,0.1-0.1l5.2-5.5l9.1,6.2c0.2,0.1,0.4,0.2,0.6,0.2
            c0.1,0,0.2,0,0.3-0.1c0.3-0.1,0.6-0.4,0.6-0.7l8.5-28.1C35.9,3.9,35.8,3.5,35.5,3.2z M32.6,7.5l-6.9,22.9L16,23.7L32.6,7.5z
            M14.9,25.5l-0.4,0.4l0.2-0.5L14.9,25.5z M13.5,23.3l-0.1,0.1l-1.9,4.3l-1.1-6.8l16.1-10.3L13.6,23.1L13.5,23.3
            C13.5,23.2,13.5,23.3,13.5,23.3C13.5,23.3,13.5,23.3,13.5,23.3z M27.7,7.3L9.3,19.1l-5.8-4L27.7,7.3z"/>
        </svg>
    );
};

 
 
