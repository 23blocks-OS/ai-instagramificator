'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image, Video } from 'lucide-react';
import { useMediaStore } from '@/store/mediaStore';
import { cn } from '@/lib/utils';

export function FileUploader() {
  const addFiles = useMediaStore((state) => state.addFiles);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    addFiles(acceptedFiles);
  }, [addFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'video/*': ['.mp4', '.mov', '.avi', '.webm'],
    },
    multiple: true,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300',
        isDragActive
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-950'
          : 'border-gray-300 dark:border-gray-700 hover:border-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800'
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-4">
          <Upload className="w-12 h-12 text-primary-500" />
          <Image className="w-12 h-12 text-primary-400" />
          <Video className="w-12 h-12 text-primary-300" />
        </div>
        {isDragActive ? (
          <p className="text-lg font-medium text-primary-600 dark:text-primary-400">
            Drop your files here...
          </p>
        ) : (
          <div>
            <p className="text-lg font-medium mb-2">
              Drag & drop your photos and videos here
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              or click to browse files
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              Supports: JPG, PNG, GIF, WebP, MP4, MOV, AVI, WebM
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
