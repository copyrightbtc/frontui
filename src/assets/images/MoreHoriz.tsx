import * as React from 'react';

interface MoreHorizProps {
    className?: string;
}

export const MoreHoriz: React.FC<MoreHorizProps> = (props: MoreHorizProps) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" className={props.className} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2m12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2m-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2"/>
        </svg>
    );
};
