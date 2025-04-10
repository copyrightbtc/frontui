import * as React from 'react';

interface Props {
    className?: string;
}

export const HomeIcon: React.FC<Props> = (props: Props) => {
    return (
        <svg width="55" height="55" viewBox="0 0 55 55" className={props.className} fill="none">
            <path d="M46.9,50.9H31.8V35H23v15.9H8V27.6l19.4-17.5l19.5,17.5V50.9z M33.6,49.1h11.4V28.4L27.4,12.5L9.8,28.4v20.7h11.5V33.2h12.4
                V49.1z" fill="var(--icons)"/>
            <polygon points="53.3,29.6 42.4,19.8 42.6,8 37.9,8 37.9,15.8 27.4,6.3 1.6,29.6 0.3,28.1 27.4,3.6 35.9,11.3 35.9,6 44.6,6 
                44.5,18.9 54.6,28.1 " fill="var(--icons)"/>
        </svg>
    );
};
