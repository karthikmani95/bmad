"use client";

import React, { useState } from 'react';
import { Pencil, Save, X } from 'lucide-react';

interface ReasonEditorProps {
    initialReason: string;
    onSave: (newReason: string) => void;
}

export const ReasonEditor: React.FC<ReasonEditorProps> = ({ initialReason, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [reason, setReason] = useState(initialReason);
    const [tempReason, setTempReason] = useState(initialReason);

    const handleSave = () => {
        if (tempReason.trim() !== reason) {
            setReason(tempReason);
            onSave(tempReason);
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setTempReason(reason);
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
                <textarea
                    value={tempReason}
                    onChange={(e) => setTempReason(e.target.value)}
                    className="w-full text-sm p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-notdfc-navy-light/20 focus:border-notdfc-navy-light outline-none min-h-[100px] resize-none text-notdfc-navy-deep font-medium bg-blue-50/10"
                    placeholder="Describe the reason for your dispute..."
                    autoFocus
                />
                <div className="flex items-center gap-2 justify-end">
                    <button
                        onClick={handleCancel}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-3.5 h-3.5" /> Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-notdfc-navy-light hover:bg-notdfc-navy-deep rounded-lg transition-colors shadow-sm"
                    >
                        <Save className="w-3.5 h-3.5" /> Save Changes
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="group relative">
            <p className="text-sm text-notdfc-navy-deep font-medium break-words whitespace-pre-wrap pr-8">
                {reason}
            </p>
            <button
                onClick={() => setIsEditing(true)}
                className="absolute top-0 right-0 p-1.5 text-gray-400 hover:text-notdfc-navy-light hover:bg-blue-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                title="Edit Reason"
            >
                <Pencil className="w-3.5 h-3.5" />
            </button>
        </div>
    );
};
