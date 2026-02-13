import React from 'react';
import { ClaimStatus } from '@/features/claims/types';

interface StatusBadgeProps {
    status: ClaimStatus;
}

const statusStyles: Record<ClaimStatus, string> = {
    'Open': 'bg-blue-100 text-blue-700 border-blue-200',
    'In Progress': 'bg-amber-100 text-amber-700 border-amber-200',
    'Approved': 'bg-green-100 text-green-700 border-green-200',
    'Rejected': 'bg-red-100 text-red-700 border-red-200',
    'Cancelled': 'bg-gray-100 text-gray-700 border-gray-200',
    'Closed': 'bg-gray-100 text-gray-700 border-gray-200',
};

/**
 * Reusable Status Badge
 * Maps claim statuses to branded color palettes.
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusStyles[status]}`}>
            {status}
        </span>
    );
};
