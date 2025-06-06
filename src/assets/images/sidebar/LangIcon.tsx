import * as React from 'react';

interface LangIconProps {
    className?: string;
}

export const LangIcon: React.FC<LangIconProps> = (props: LangIconProps) => {
    return (
        <svg width="50" height="50" viewBox="0 0 50 50" className={props.className} fill="none">
		<path d="M25,0.5C11.5,0.5,0.5,11.5,0.5,25c0,13.5,11,24.5,24.5,24.5s24.5-11,24.5-24.5C49.5,11.5,38.5,0.5,25,0.5z M25,47
			c-1.9,0-4.4-3.6-6-9.8H31C29.4,43.4,26.9,47,25,47z M18.5,34.8c-0.5-2.5-0.8-5.4-0.8-8.6h14.7c-0.1,3.2-0.4,6-0.8,8.6H18.5z
			 M3,26.2h12.2c0.1,3,0.3,5.9,0.8,8.6H5.3C4,32.2,3.2,29.3,3,26.2z M25,3c1.9,0,4.4,3.6,6,9.8H19C20.6,6.6,23.1,3,25,3z M31.5,15.2
			c0.5,2.5,0.8,5.4,0.8,8.6H17.7c0.1-3.2,0.4-6,0.8-8.6H31.5z M15.2,23.8H3c0.2-3.1,1-6,2.3-8.6H16C15.6,17.8,15.3,20.7,15.2,23.8z
			 M34.8,26.2H47c-0.2,3.1-1,6-2.3,8.6H34C34.4,32.2,34.7,29.3,34.8,26.2z M34.8,23.8c-0.1-3-0.3-5.9-0.8-8.6h10.7
			c1.3,2.6,2.1,5.5,2.3,8.6H34.8z M43.3,12.8h-9.8c-0.9-3.9-2.2-7.1-3.8-9.3C35.3,4.7,40.2,8.1,43.3,12.8z M20.3,3.5
			c-1.6,2.2-2.9,5.4-3.8,9.3H6.7C9.8,8.1,14.7,4.7,20.3,3.5z M6.7,37.3h9.8c0.9,3.9,2.2,7.1,3.8,9.3C14.7,45.3,9.8,41.9,6.7,37.3z
			 M29.7,46.5c1.6-2.2,2.9-5.4,3.8-9.3h9.8C40.2,41.9,35.3,45.3,29.7,46.5z" fill="var(--icons)"/>
        </svg>
    );
};
