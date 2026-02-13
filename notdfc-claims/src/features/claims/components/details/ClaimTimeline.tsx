import React from 'react';
import { ClaimHistoryEvent } from '../../types';
import { CheckCircle, Clock, FileText, User, Shield } from 'lucide-react';

interface ClaimTimelineProps {
    history: ClaimHistoryEvent[];
}

export const ClaimTimeline: React.FC<ClaimTimelineProps> = ({ history }) => {
    // Sort history by date (newest first)
    const sortedHistory = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="space-y-6">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Claim History</h3>
            <div className="relative border-l-2 border-gray-100 ml-3 space-y-8 pb-2">
                {sortedHistory.map((event, index) => {
                    const isLatest = index === 0;
                    return (
                        <div key={event.id} className="relative pl-8">
                            {/* Timeline Dot */}
                            <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 flex items-center justify-center bg-white ${isLatest ? 'border-notdfc-navy-light shadow-sm' : 'border-gray-300'}`}>
                                {isLatest && <div className="w-2 h-2 rounded-full bg-notdfc-navy-light" />}
                            </div>

                            {/* Event Content */}
                            <div className={`flex flex-col gap-1 ${isLatest ? 'opacity-100' : 'opacity-70'}`}>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-gray-500">
                                        {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${event.actor === 'Customer' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                            event.actor === 'Bank Staff' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                                'bg-gray-100 text-gray-600 border-gray-200'
                                        }`}>
                                        {event.actor}
                                    </span>
                                </div>
                                <p className="text-sm font-medium text-gray-900">{event.description}</p>
                                <p className="text-xs text-gray-500">Status: <span className="font-semibold">{event.status}</span></p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
