import * as React from 'react';

interface TipinfoIconProps {
    className?: string;
}

export const TipinfoIcon: React.FC<TipinfoIconProps> = (props: TipinfoIconProps) => (
    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className}>
        <path d="M17.2,2.4H3.8C2,2.4,0.5,3.9,0.5,5.7v13.4c0,1.8,1.5,3.3,3.3,3.3h13.4c1.8,0,3.3-1.5,3.3-3.3V5.7C20.5,3.9,19,2.4,17.2,2.4z
            M16.3,6.6v11.7H4.7V6.6H16.3z M17.2,27.6H3.8c-1.8,0-3.3,1.5-3.3,3.3v13.4c0,1.8,1.5,3.3,3.3,3.3h13.4c1.8,0,3.3-1.5,3.3-3.3V30.9
            C20.5,29.1,19,27.6,17.2,27.6z M16.3,31.8v11.7H4.7V31.8H16.3z M49.5,6v3.7H23.7V6H49.5z M41.8,18.8H23.7v-3.7h18.1V18.8z
            M23.7,31.2h25.8v3.7H23.7V31.2z M23.7,40.3h18.1V44H23.7V40.3z"/>
    </svg>
);
