import * as React from 'react';

interface ReportIconProps {
    className?: string; 
}

export const ReportIcon: React.FC<ReportIconProps> = (props: ReportIconProps) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" className={props.className} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 21h22L12 2zm12-3h-2v-2h2zm0-4h-2v-4h2z"/>
        </svg>
    );
};
