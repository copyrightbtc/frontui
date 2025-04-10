import * as React from 'react';

interface WalletIconProps {
    className?: string; 
}

export const WalletIcon: React.FC<WalletIconProps> = (props: WalletIconProps) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className}>
        <path d="M23.1,11.6h-1.1V8.7H4.2c-1,0-1.8-0.8-1.8-1.7s0.8-1.7,1.8-1.7h15.2V3.9H4.2C2.4,3.9,0.9,5.3,0.9,7v10
	    c0,1.7,1.5,3.1,3.3,3.1h17.7v-3.3h1.1V11.6z M20.4,18.7H4.2c-1,0-1.8-0.8-1.8-1.7V9.7l0.6,0.2c0.4,0.1,0.7,0.2,1.1,0.2h16.2v1.5h-7
	    v5.1h7V18.7z M22.1,15.7h-0.1h-1.5h-6v-3.1h6h1.5h0.1V15.7z"/>
        <path d="M16.4,13.2c-0.6,0-1,0.5-1,1s0.5,1,1,1s1-0.5,1-1S17,13.2,16.4,13.2z"/>
    </svg> 
);