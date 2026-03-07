import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { uploadGemImage } from '../../../lib/jewelry-designer/api';

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
    value,
    onChange,
}) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string>('');
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateFile = (file: File): string | null => {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            return 'Invalid file type. Please use JPG, PNG, or WebP';
        }
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            return 'File size must be under 5MB';
        }
        return null;
    };

    const handleUpload = async (file: File) => {
        setError('');
        setUploading(true);
        try {
            const validationError = validateFile(file);
            if (validationError) {
                setError(validationError);
                setUploading(false);
                return;
            }
            const result = await uploadGemImage(file);
            onChange(result.imageUrl);
        } catch (err: any) {
            setError(err.message || 'Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleUpload(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleUpload(e.target.files[0]);
        }
    };

    const handleRemove = () => {
        onChange('');
        setError('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-3" style={{ fontFamily: "'Market Sans', sans-serif" }}>
            <label className="block text-sm font-semibold text-gray-800">
                Upload a photo of your gem <span className="text-gray-400">(optional but recommended)</span>
            </label>

            {!value ? (
                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`
            border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
            ${dragActive
                            ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                        }
            ${error ? 'border-red-400' : ''}
          `}
                >
                    {uploading ? (
                        <div className="space-y-3">
                            <div className="w-10 h-10 mx-auto border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                            <p className="text-sm text-gray-500">Uploading...</p>
                        </div>
                    ) : (
                        <>
                            <Upload className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                            <p className="text-sm text-gray-800 font-medium mb-1">
                                Drag and drop your image here
                            </p>
                            <p className="text-xs text-gray-400 mb-3">
                                or click to browse files
                            </p>
                            <p className="text-xs text-gray-400">
                                JPG, PNG, or WebP • Max 5 MB
                            </p>
                        </>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                </div>
            ) : (
                <div className="relative rounded-xl overflow-hidden border-2 border-gray-200">
                    <img
                        src={value}
                        alt="Uploaded gem"
                        className="w-full h-48 object-cover"
                    />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-3 py-2">
                        <p className="text-sm text-white flex items-center">
                            <ImageIcon className="w-4 h-4 mr-2" />
                            Image uploaded successfully
                        </p>
                    </div>
                </div>
            )}

            <p className="text-xs text-gray-400">
                This helps our AI create more accurate designs
            </p>

            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}
        </div>
    );
};
