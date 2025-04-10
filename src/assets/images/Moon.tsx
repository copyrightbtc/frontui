import * as React from 'react';

export const Moon = ({fillColor}) => {
    return (
        <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.9,11.2c0-3.5,0.5-7.1,1.8-10.2C7,4.8,1,13.8,1,24.1C1,37.8,12.2,49,25.9,49c10.2,0,19.2-6,23.1-14.8
	            c-3,1.3-6.6,1.8-10.2,1.8C25.1,36.1,13.9,24.9,13.9,11.2z" fill={fillColor}/>
        </svg>
    );
};
