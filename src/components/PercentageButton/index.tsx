import React from 'react';

export interface PercentageButtonProps {
    value: number;
    className?: string;
    onClick: (index: number) => void;
}

export const PercentageButtonComponent: React.FC<PercentageButtonProps> = ({ onClick, value }) => {
    return (
        <button className="max-amount" onClick={() => onClick(value)}>Max.</button>
    );
};

export const PercentageButton = React.memo(PercentageButtonComponent);