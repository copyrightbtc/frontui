import cx from 'classnames';
import React from 'react';

export interface CryptoIconProps {
    code: string;
    className?: string;
    children?: React.ReactNode;
}

const findIcon = (code: string): string => {
    try {
        return require(`src/assets/cryptocurrency-icons/svg/color/${code.toLowerCase()}.svg`).default as string;
    } catch (err) {
        return null;
    }
};

export const CryptoIcon: React.FunctionComponent<CryptoIconProps> = (props) => {
    const { code, className = '', children } = props;

    const icon = findIcon(code);

    return (
        <div className={cx('currency-icon', className)}>
            <img src={icon} alt={code} /> {children}
        </div>
    );
};
