"use client";

import React from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { AlertTriangle, X } from 'lucide-react';

interface CancellationModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
}

export const CancellationModal: React.FC<CancellationModalProps> = ({ open, onOpenChange, onConfirm }) => {
    return (
        <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
            <AlertDialog.Portal>
                <AlertDialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-in fade-in duration-200" />
                <AlertDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-xl shadow-xl w-[90vw] max-w-md p-6 outline-none animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <AlertDialog.Title className="text-lg font-bold text-gray-900">
                                    Cancel Dispute?
                                </AlertDialog.Title>
                                <AlertDialog.Description className="text-sm text-gray-500">
                                    Are you sure you want to withdraw this claim? This action cannot be undone.
                                </AlertDialog.Description>
                            </div>
                        </div>

                        <div className="bg-red-50/50 border border-red-100 rounded-lg p-3">
                            <p className="text-xs text-red-800 leading-relaxed font-medium">
                                <strong>Warning:</strong> The bank will stop investigating this transaction. You may not be able to reopen this dispute later.
                            </p>
                        </div>

                        <div className="flex justify-end gap-3 mt-2">
                            <AlertDialog.Cancel asChild>
                                <button className="px-4 py-2 text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                                    Keep Dispute Open
                                </button>
                            </AlertDialog.Cancel>
                            <AlertDialog.Action asChild>
                                <button
                                    onClick={onConfirm}
                                    className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm"
                                >
                                    Yes, Cancel Claim
                                </button>
                            </AlertDialog.Action>
                        </div>
                    </div>
                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    );
};
