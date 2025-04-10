import * as React from 'react';

interface LogoIconProps {
    className?: string;
}

export const LogoIcon: React.FC<LogoIconProps> = (props: LogoIconProps) => (
    <svg fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className}>
 
		<path fill="#FFCE00" d="M55.5,19.6v7.2l6.2-3.6v-7.2L55.5,19.6z M61.5,23l-5.7,3.3v-6.6l5.7-3.3V23z"/>
		<path fill="#FFCE00" d="M49.3,16v7.2l6.2,3.6v-7.2L49.3,16z M55.3,26.3L49.6,23v-6.6l5.7,3.3V26.3z"/>
		<path fill="#FFCE00" d="M36.9,23.2l6.2,3.6l6.2-3.6V16L36.9,23.2z M49.1,23l-6.3,3.6l-5.7-3.3l12-6.9V23z"/>
 
		<path fill="#FFCE00" d="M61.7,37.5v7.2l6.2,3.6V33.8L61.7,37.5z M67.7,47.9L62,44.6v-7.3l5.7-3.3V47.9z"/>
		<path fill="#FFCE00" d="M30.7,41v7.2l6.2-3.6v-7.2L30.7,41z M36.6,44.5l-5.7,3.3v-6.6l5.7-3.3V44.5z"/>
		<path fill="#FFCE00" d="M36.9,44.7l-6.2,3.6L49.3,59v-7.2L36.9,44.7z M49.1,58.7L31.2,48.3l5.7-3.3l12.3,7L49.1,58.7z"/>
		<path fill="#FFCE00" d="M61.7,44.7l-12.4,7.2v7.2L68,48.3L61.7,44.7z M49.5,52l12.2-7l5.7,3.3L49.5,58.7V52z"/>
		<path fill="#FFCE00" d="M30.7,34l-6.3,3.5l6.3,3.6l6.2-3.6L30.7,34z M24.9,37.5l5.8-3.3l5.6,3.3l-5.7,3.3L24.9,37.5z"/>
 
		<polygon fill="#B7991A" points="74.2,23.2 49.3,37.5 36.9,30.4 24.4,23.2 49.3,8.8 61.7,16 55.5,19.6 49.3,16 36.9,23.2 43.1,26.8 
			49.3,30.4 55.5,26.8 61.7,23.2 68,19.6 		"/>
		<path fill="#FFCE00" d="M49.3,37.5v7.2l6.2-3.6l12.4-7.2v14.4l-12.4,7.2L49.3,59v7.2l24.9-14.4V23.2L49.3,37.5z"/>
		 
		<polygon fill="#7F6700" points="49.3,37.5 49.3,44.7 43.1,41 36.9,37.5 30.7,34 24.4,30.4 24.4,23.2 36.9,30.4"/>
		<polygon fill="#7F6700" points="49.3,59 49.3,66.3 24.4,51.9 24.4,37.5 30.7,41 30.7,48.3 43.1,55.5"/>
 
        </svg>
); 
 