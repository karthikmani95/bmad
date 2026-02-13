import React from 'react';

interface SkeletonProps {
    className?: string;
}

/**
 * Reusable Shimmer/Skeleton component to fulfill NFR4 (Performance/User Perception).
 * Uses the .animate-shimmer class defined in globals.css.
 */
export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
    return (
        <div
            className={`bg-gray-200 rounded relative overflow-hidden ${className}`}
        >
            <div className="absolute inset-0 animate-shimmer" />
        </div>
    );
};
