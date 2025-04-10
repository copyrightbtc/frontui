import React from "react";

interface Props {
    className?: string
    width?: number
    height?: number
}

export const AdsIcon: React.FC<Props> = ({ className, width = 20, height = 20 }: Props) => (
    <svg className={className} width={width} height={height} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M5 3h14v18l-3.5-3-3.5 3-3.5-3L5 21V3zm3 4h4v2.5H8V7zm4 5H8v2.5h4V12zm2-5h2.5v2.5H14V7zm2.5 5H14v2.5h2.5V12z" fill="currentColor"></path>
    </svg>
)