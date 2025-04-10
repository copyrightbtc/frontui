import * as React from 'react';

interface SendIconProps {
    className?: string;
    onClick?: (e?: any) => void;
}

export const SendIcon: React.FC<SendIconProps> = (props: SendIconProps) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 25" className={props.className} onClick={props.onClick} fill="none">
            <path d="M3.016 5.148L4.232 3.98l16.752 7.697v1.646L4.232 21.02l-1.216-1.168 2.608-6.332 7.353-1.021-7.335-.976v.002L3.016 5.148z"/>
        </svg>
    );
};

