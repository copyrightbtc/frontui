import React from "react";

interface Props {
    width?: number;
    height?: number;
    className?: string;
}

const OrderIcon = ({ width = 20, height = 20, className }: Props) => {
    return (
        <svg width={width} height={height} className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5 3v18h14V7l-4-4H5zm3 6.5h8V12H8V9.5zm0 5h8V17H8v-2.5z" fill="currentColor"></path>
        </svg>
    );
};

export default OrderIcon;