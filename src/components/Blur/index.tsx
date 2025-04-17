import * as React from 'react';
import { LockIcon } from '../../assets/images/LockIcon';

export interface Props {
    className?: string;
    text?: string;
}

export const Blur: React.FC<Props> = props => {
    const { text, className } = props;

    return (
        <div className={`blur ${className ? className : ''}`}>
            <div className="blur__content">
                <LockIcon className="blur__content__icon" />
                <span className="blur__content__text">{text}</span>
            </div>
        </div>
    );
};
