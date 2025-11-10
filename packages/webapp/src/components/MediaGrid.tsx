'use client';

import { useMediaStore } from '@/store/mediaStore';
import { Trash2, Edit2, Tag } from 'lucide-react';
import { formatFileSize } from '@/lib/utils';
import Image from 'next/image';

export function MediaGrid() {
  const { files, removeFile, setCurrentFile } = useMediaStore();

  if (files.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500 dark:text-gray-400">
        <p className="text-lg">No files uploaded yet</p>
        <p className="text-sm mt-2">Upload some photos or videos to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {files.map((file) => (
        <div
          key={file.id}
          className="group relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 hover:ring-2 hover:ring-primary-500 transition-all duration-300"
        >
          {file.type === 'image' ? (
            <Image
              src={file.url}
              alt={file.metadata.name}
              fill
              className="object-cover"
            />
          ) : (
            <video
              src={file.url}
              className="w-full h-full object-cover"
              muted
            />
          )}

          {/* Overlay with actions */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button
              onClick={() => setCurrentFile(file)}
              className="p-2 bg-white dark:bg-gray-800 rounded-full hover:bg-primary-500 hover:text-white transition-colors"
              title="Edit"
            >
              <Edit2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => removeFile(file.id)}
              className="p-2 bg-white dark:bg-gray-800 rounded-full hover:bg-red-500 hover:text-white transition-colors"
              title="Delete"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          {/* File info */}
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
            <p className="truncate font-medium">{file.metadata.name}</p>
            <p className="opacity-75">{formatFileSize(file.metadata.size)}</p>
          </div>

          {/* Type badge */}
          <div className="absolute top-2 right-2">
            <span className="px-2 py-1 text-xs font-medium bg-black bg-opacity-50 text-white rounded">
              {file.type}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
