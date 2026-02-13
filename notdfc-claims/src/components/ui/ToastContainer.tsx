"use client";

import React, { useState, useEffect } from 'react';
import { emailService, EmailRequest } from '@/lib/mock-email-service';
import { Mail, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
    const [toasts, setToasts] = useState<(EmailRequest & { id: string })[]>([]);

    useEffect(() => {
        const unsubscribe = emailService.subscribe((email) => {
            const id = Math.random().toString(36).substring(7);
            setToasts(prev => [...prev, { ...email, id }]);

            // Auto-dismiss after 5 seconds
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, 5000);
        });

        return () => unsubscribe();
    }, []);

    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    className="bg-white border border-gray-200 shadow-xl rounded-xl p-4 w-80 pointer-events-auto animate-in slide-in-from-right-full fade-in duration-300 flex items-start gap-3"
                >
                    <div className="p-2 bg-blue-50 rounded-full shrink-0">
                        <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-gray-900">Email Notification Sent</h4>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">To: {toast.to}</p>
                        <p className="text-xs font-medium text-gray-700 mt-1">{toast.subject}</p>
                    </div>
                    <button
                        onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>
    );
};
