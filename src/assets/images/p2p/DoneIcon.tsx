import * as React from 'react';

interface DoneIconProps {
    className?: string;
    onClick?: () => void;
}

export const DoneIcon: React.FC<DoneIconProps> = (props: DoneIconProps) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" className={props.className} onClick={props.onClick} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"></path>
        </svg>
    );
};
 