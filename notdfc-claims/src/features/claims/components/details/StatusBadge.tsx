import React from 'react';
import { ClaimStatus } from '../../types';
import { CheckCircle, XCircle, Clock, AlertCircle, FileText, Ban } from 'lucide-react';

interface StatusBadgeProps {
    status: ClaimStatus;
    className?: string;
}

const statusConfig: Record<ClaimStatus, { color: string; bg: string; border: string; icon: React.ElementType }> = {
    'Open': {
        color: 'text-blue-700',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: FileText
    },
    'In Progress': {
        color: 'text-amber-700',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        icon: Clock
    },
    'Approved': {
        color: 'text-emerald-700',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        icon: CheckCircle
    },
    'Rejected': {
        color: 'text-red-700',
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: XCircle
    },
    'Cancelled': {
        color: 'text-gray-600',
        bg: 'bg-gray-100',
        border: 'border-gray-200',
        icon: Ban
    },
    'Closed': {
        color: 'text-gray-700',
        bg: 'bg-gray-100',
        border: 'border-gray-300',
        icon: CheckCircle
    }
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
    const config = statusConfig[status] || statusConfig['Open'];
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${config.bg} ${config.color} ${config.border} ${className}`}>
            <Icon className="w-3.5 h-3.5" />
            {status}
        </span>
    );
};
