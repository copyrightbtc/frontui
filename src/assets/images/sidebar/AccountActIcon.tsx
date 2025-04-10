import * as React from 'react';

interface AccountActIconProps {
    className?: string;
}

export const AccountActIcon: React.FC<AccountActIconProps> = (props: AccountActIconProps) => {
    return (
        <svg width="50" height="50" viewBox="0 0 50 50" className={props.className} fill="none">
        <path d="M0.8,0.8V49h48.1V0.8H0.8z M46.9,2.8v25.5h-6.5l-3.2-6.9c-0.3-0.5-0.8-0.8-1.4-0.7c-0.6,0.1-1,0.5-1.1,1.1l-2.4,15.7
            L23.2,6.4c-0.2-0.6-0.7-0.9-1.3-0.9c-0.6,0-1.1,0.3-1.2,0.9l-5.4,21.9H2.8V2.8H46.9z M2.8,47V30.8h13.5c0.6,0,1.1-0.4,1.3-0.9
            l4.5-18.2l9.3,32c0.1,0.6,0.6,1,1.2,1h0c0.6,0,1.2-0.5,1.3-1.1l2.6-17.3l1.8,3.8c0.2,0.5,0.7,0.7,1.2,0.7h7.4V47H2.8z" fill="var(--icons)"/>
        </svg>
    );
};
