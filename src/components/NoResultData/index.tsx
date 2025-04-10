import React, { ReactNode } from 'react';
import { useIntl } from 'react-intl';

export interface CustomResultProps {
    suffix?: ReactNode,
}

export const NoResultData = props => {
    const { formatMessage } = useIntl();
    return (
        <div className={`${props.class} no-data-empty`|| 'no-data-empty'}>
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                viewBox="0 0 130 130">
            <path className="st0" d="M78.5,26l-13.4-7.7v-0.1l-0.1,0l0,0v0.1L38.1,33.8l0.5,0.3l25.9-15v14.4L51,41.3l0.6,0.3L65,33.9v0l13.5,7.8
                L92,33.9V18.2L78.5,26z M78,40.7l-12.4-7.2V19.1L78,26.3V40.7z M91.5,33.5l-12.4,7.2V26.3l12.4-7.2V33.5z"/>
            <path className="st0" d="M105.5,57.1l-0.6,0.3v30l-12.4-7.2V64.6L92,64.9v15.6L65,96.2L38.1,80.5V64.9l-13.5-7.6l-13.7,7.6l13.7,7.8
                v15.7l0.1,0L65,111.8v0.1l40.5-23.5l-5-2.9l5,2.9V57.1z M12,64.9l12.6-7l12.4,7l-12.4,7.2L12,64.9z M25.1,87.4V73l12.4-7.2v14.4
                L25.1,87.4z M25.6,88.4L38,81.2l26.4,15.3c0.1,0,0.1,14.4,0.1,14.4L25.6,88.4z M104.4,88.4L65.5,111V96.5l26.4-15.3L104.4,88.4z"/>
            <polygon className="st0" points="119.1,33.8 65,64.9 38.1,49.5 10.9,33.8 65,2.5 92,18.2 78.5,26 65,18.2 38.1,33.8 51.5,41.6 65,49.5 
                78.5,41.6 92,33.8 105.7,26 "/>
            <path className="st1" d="M65,64.9v15.6l13.5-7.7l27-15.7v31.3l-27,15.7L65,111.8l0,15.7l54.1-31.2V33.8L65,64.9z"/>
            <polygon className="st2" points="65,64.9 65,80.5 51.5,72.7 38.1,64.9 24.6,57.3 10.9,49.5 10.9,33.8 38.1,49.5 "/>
            <polygon className="st2" points="65,111.8 65,127.5 10.9,96.2 10.9,64.9 24.6,72.7 24.6,88.4 51.5,104 "/>
            </svg>

            <span>
                {props.title || formatMessage({ id: 'page.noDataToShow' })}
            </span>
            {props.suffix}
        </div>
        
    )
};
 