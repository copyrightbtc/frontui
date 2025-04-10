import * as React from 'react';

interface DepositPlusIconProps {
    className?: string;
}

export const DepositPlusIcon: React.FC<DepositPlusIconProps> = (props: DepositPlusIconProps) => {
    return (
        <svg width={25} height={25} viewBox="0 0 25 25" className={props.className} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.5,8.5h-2v3h-3v2h3v3h2v-3h3v-2h-3V8.5z M2.5,12.5c0-2.8,1.6-5.2,4-6.3V4c-3.5,1.2-6,4.6-6,8.5s2.5,7.2,6,8.5v-2.2
                C4.1,17.7,2.5,15.3,2.5,12.5 M15.5,3.5c-5,0-9,4-9,9s4,9,9,9s9-4,9-9S20.5,3.5,15.5,3.5 M15.5,19.5c-3.9,0-7-3.1-7-7s3.1-7,7-7
                s7,3.1,7,7S19.4,19.5,15.5,19.5"/>
        </svg>
    );
};
