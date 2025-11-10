'use client';

import { Portfolio, PortfolioSection, usePortfolioStore } from '@/store/portfolioStore';
import { useMediaStore } from '@/store/mediaStore';
import { Plus, X, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

interface SectionEditorProps {
  portfolio: Portfolio;
  section: PortfolioSection;
  onUpdate: (updates: Partial<PortfolioSection>) => void;
}

export function SectionEditor({ portfolio, section, onUpdate }: SectionEditorProps) {
  const { files } = useMediaStore();
  const { addMediaToSection, removeMediaFromSection } = usePortfolioStore();
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  const sectionMedia = files.filter((file) => section.mediaIds.includes(file.id));

  const handleAddMedia = (mediaId: string) => {
    addMediaToSection(portfolio.id, section.id, [mediaId]);
  };

  const handleRemoveMedia = (mediaId: string) => {
    removeMediaFromSection(portfolio.id, section.id, mediaId);
  };

  return (
    <div className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium mb-2">Section Title</label>
        <input
          type="text"
          value={section.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Section title"
        />
      </div>

      {/* Content (for text-based sections) */}
      {(section.type === 'about' || section.type === 'resume' || section.type === 'contact') && (
        <div>
          <label className="block text-sm font-medium mb-2">Content</label>
          <textarea
            value={section.content || ''}
            onChange={(e) => onUpdate({ content: e.target.value })}
            rows={6}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder={
              section.type === 'about'
                ? 'Tell your story...'
                : section.type === 'resume'
                ? 'List your experience, training, and skills...'
                : 'Your contact information...'
            }
          />
        </div>
      )}

      {/* Media Section */}
      {(section.type === 'hero' || section.type === 'gallery' || section.type === 'video-reel') && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium">
              {section.type === 'video-reel' ? 'Videos' : 'Images'}
            </label>
            <button
              onClick={() => setShowMediaPicker(!showMediaPicker)}
              className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add Media
            </button>
          </div>

          {/* Media Grid */}
          {sectionMedia.length > 0 ? (
            <div className="grid grid-cols-4 gap-3">
              {sectionMedia.map((media) => (
                <div
                  key={media.id}
                  className="relative aspect-square rounded-lg overflow-hidden group bg-gray-100 dark:bg-gray-700"
                >
                  {media.type === 'image' ? (
                    <Image
                      src={media.url}
                      alt={media.metadata.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <video src={media.url} className="w-full h-full object-cover" />
                  )}
                  <button
                    onClick={() => handleRemoveMedia(media.id)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
              <ImageIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No media added yet
              </p>
            </div>
          )}

          {/* Media Picker */}
          {showMediaPicker && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-sm">Select Media from Library</h4>
                <button
                  onClick={() => setShowMediaPicker(false)}
                  className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Close
                </button>
              </div>
              {files.length > 0 ? (
                <div className="grid grid-cols-6 gap-2 max-h-64 overflow-y-auto">
                  {files
                    .filter((file) =>
                      section.type === 'video-reel'
                        ? file.type === 'video'
                        : file.type === 'image'
                    )
                    .map((file) => (
                      <button
                        key={file.id}
                        onClick={() => handleAddMedia(file.id)}
                        disabled={section.mediaIds.includes(file.id)}
                        className={`relative aspect-square rounded-lg overflow-hidden ${
                          section.mediaIds.includes(file.id)
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:ring-2 hover:ring-purple-500'
                        }`}
                      >
                        {file.type === 'image' ? (
                          <Image
                            src={file.url}
                            alt={file.metadata.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <video src={file.url} className="w-full h-full object-cover" />
                        )}
                      </button>
                    ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  No media in library. Upload some files first!
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Section Settings */}
      {section.type === 'gallery' && (
        <div>
          <label className="block text-sm font-medium mb-2">Gallery Settings</label>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <label className="text-sm">Columns:</label>
              <select
                value={section.settings.columns || 3}
                onChange={(e) =>
                  onUpdate({
                    settings: { ...section.settings, columns: parseInt(e.target.value) },
                  })
                }
                className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              >
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={section.settings.showCaptions || false}
                onChange={(e) =>
                  onUpdate({
                    settings: { ...section.settings, showCaptions: e.target.checked },
                  })
                }
                className="rounded"
              />
              Show captions
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
