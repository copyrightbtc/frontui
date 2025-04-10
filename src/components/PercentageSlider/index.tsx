import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import Decimal from 'decimal.js';

export interface PercentageSliderProps {
    values: number[];
    value: number;
    onChange: (value: number) => void;
    disabled?: boolean;
}

const PercentageSlider: React.FC<PercentageSliderProps> = ({ values, value, disabled, onChange }) => {
    const trackRef = useRef<HTMLDivElement>(null);
    const [dragging, setDragging] = useState(false);

    const min = useMemo(() => new Decimal(values[0]).times(100), [values]);
    const max = useMemo(() => new Decimal(values[values.length - 1]).times(100), [values]);

    // Convert a percentage value to a position on the track
    const getPositionFromValue = useCallback((val: number) => {
        const decimalVal = new Decimal(val).times(100);
        return decimalVal.minus(min).dividedBy(max.minus(min)).times(100).toNumber();
    }, [min, max]);

    const handleMouseDown = () => setDragging(true);

    const snapToClosestValue = (position: number) => {
        const trackRect = trackRef.current?.getBoundingClientRect();
        if (!trackRect) return;

        const posDecimal = new Decimal(position);
        const trackWidthDecimal = new Decimal(trackRect.width);

        const newValue = posDecimal.dividedBy(trackWidthDecimal).times(100).round();
        onChange(newValue.dividedBy(100).toNumber());
    };

    const handleMouseUp = () => {
        if (dragging) {
            setDragging(false);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (dragging && trackRef.current) {
            const trackRect = trackRef.current.getBoundingClientRect();
            const newPos = Math.min(
                Math.max(0, e.clientX - trackRect.left),
                trackRect.width
            );
            snapToClosestValue(newPos);
        }
    };

    const handleTrackClick = (e: React.MouseEvent) => {
        if (trackRef.current) {
            const trackRect = trackRef.current.getBoundingClientRect();
            const clickPosition = e.clientX - trackRect.left;
            snapToClosestValue(clickPosition);
        }
    };

    useEffect(() => {
        if (dragging && !disabled) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragging, disabled]);

    return (
        <div className={`percentage-slider${disabled ? " percentage-slider--disabled" : ""}`}>
            <div
                className="percentage-slider__track"
                ref={trackRef}
                onClick={disabled ? undefined : handleTrackClick}
            >
                <div 
                    className='percentage-slider__track__backs'
                    style={{ width: `${getPositionFromValue(value)}%` }}
                />
                <div className="start__end"/>
                {values.map((checkpoint, index) => {
                    if (checkpoint === values[0] || checkpoint === values[values.length - 1]) {
                        return null;
                    }
                    return (
                        <div
                            key={index}
                            className="percentage-slider__checkpoint"
                            style={{ left: `calc(${new Decimal(checkpoint).times(100)}% - 4px)` }}
                        />
                    )
                })}
                <div
                    className={`percentage-slider__handle${value === 0
                        ? " percentage-slider__handle--start"
                        : value === 1
                            ? " percentage-slider__handle--end"
                            : ""
                        }`}
                    style={{ left: `${getPositionFromValue(value)}%` }}
                    onMouseDown={disabled ? undefined : handleMouseDown}
                >
                    <div className="percentage-slider__tooltip">
                        {`${new Decimal(value).times(100).toFixed(0)}%`}
                    </div>
                </div>
            </div>
        </div>
    );
};

export { PercentageSlider };