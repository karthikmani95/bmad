"use client";

import React, { useState, useRef } from 'react';
import { Upload, X, FileText, CheckCircle, Loader2 } from 'lucide-react';
import { uploadClaimAttachmentAction } from '@/features/claims/actions';

export interface UploadedFile {
    id: string;
    name: string;
    size: number;
    type: string;
    uploadedAt: Date;
}

interface EvidenceUploadProps {
    claimId?: string;
    files: UploadedFile[];
    onFilesChange: (files: UploadedFile[]) => void;
}

const ACCEPTED_TYPES = '.pdf,.png,.jpg,.jpeg';
const MAX_SIZE_MB = 5;

export const EvidenceUpload: React.FC<EvidenceUploadProps> = ({ claimId, files, onFilesChange }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            doUpload(Array.from(e.target.files));
        }
    };

    const doUpload = async (newFiles: File[]) => {
        setUploadError(null);
        setIsUploading(true);
        const uploaded: UploadedFile[] = [];

        if (claimId) {
            for (const file of newFiles) {
                if (file.size > MAX_SIZE_MB * 1024 * 1024) {
                    setUploadError(`File ${file.name} exceeds ${MAX_SIZE_MB}MB limit`);
                    continue;
                }
                const formData = new FormData();
                formData.append('claimId', claimId);
                formData.append('file', file);
                const result = await uploadClaimAttachmentAction(formData);
                if (result.success && result.attachment) {
                    uploaded.push({
                        id: result.attachment.id,
                        name: result.attachment.file_name,
                        size: result.attachment.file_size,
                        type: result.attachment.file_type,
                        uploadedAt: new Date(result.attachment.uploaded_at)
                    });
                } else {
                    setUploadError(result.error ?? 'Upload failed');
                }
            }
        } else {
            // Creation wizard: no claimId yet, simulate local upload
            await new Promise(resolve => setTimeout(resolve, 800));
            newFiles.forEach(f => {
                uploaded.push({
                    id: Math.random().toString(36).substring(7),
                    name: f.name,
                    size: f.size,
                    type: f.type,
                    uploadedAt: new Date()
                });
            });
        }

        if (uploaded.length > 0) {
            onFilesChange([...files, ...uploaded]);
        }
        setIsUploading(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeFile = (id: string) => {
        onFilesChange(files.filter(f => f.id !== id));
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <Upload className="w-4 h-4 text-notdfc-navy-light" />
                Evidence Upload
            </h3>

            {/* Drop Zone / Upload Button */}
            <div
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${isDragging ? 'border-notdfc-navy-light bg-notdfc-navy-light/5' : 'border-gray-200 hover:border-notdfc-navy-light/50 hover:bg-gray-50'
                    }`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files.length > 0) {
                        doUpload(Array.from(e.dataTransfer.files));
                    }
                }}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    multiple
                    accept={ACCEPTED_TYPES}
                />

                {isUploading ? (
                    <div className="flex flex-col items-center gap-2 py-2">
                        <Loader2 className="w-8 h-8 text-notdfc-navy-light animate-spin" />
                        <p className="text-sm font-bold text-notdfc-navy-deep">Uploading documents...</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                            <Upload className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="space-y-1">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="text-sm font-bold text-blue-600 hover:underline"
                            >
                                Click to upload
                            </button>
                            <span className="text-sm text-gray-500"> or drag and drop</span>
                        </div>
                        <p className="text-[10px] text-gray-400 font-medium">PDF, PNG, JPG (Max {MAX_SIZE_MB}MB)</p>
                        {uploadError && <p className="text-xs text-red-600">{uploadError}</p>}
                    </div>
                )}
            </div>

            {/* File List */}
            {files.length > 0 && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    {files.map(file => (
                        <div key={file.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg shadow-sm group">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-50 rounded-lg">
                                    <FileText className="w-4 h-4 text-gray-500" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-700 truncate max-w-[150px] sm:max-w-xs">{file.name}</p>
                                    <p className="text-[10px] text-gray-400">{formatSize(file.size)} • {file.uploadedAt.toLocaleTimeString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                                <button
                                    onClick={() => removeFile(file.id)}
                                    className="p-1 hover:bg-red-50 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
