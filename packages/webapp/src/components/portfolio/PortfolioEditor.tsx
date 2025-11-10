'use client';

import { Portfolio, usePortfolioStore } from '@/store/portfolioStore';
import { useMediaStore } from '@/store/mediaStore';
import { SectionEditor } from './SectionEditor';
import { Plus, GripVertical } from 'lucide-react';
import { useState } from 'react';

interface PortfolioEditorProps {
  portfolio: Portfolio;
}

export function PortfolioEditor({ portfolio }: PortfolioEditorProps) {
  const { updateSection, removeSection, addSection, reorderSections } = usePortfolioStore();
  const [showAddSection, setShowAddSection] = useState(false);

  const handleAddSection = (type: any) => {
    addSection(portfolio.id, {
      type,
      title: type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' '),
      mediaIds: [],
      settings: {},
    });
    setShowAddSection(false);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Page Info */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Build Your Portfolio</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Add sections, customize content, and create your perfect portfolio
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {portfolio.sections
          .sort((a, b) => a.order - b.order)
          .map((section) => (
            <div
              key={section.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              {/* Section Header */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                <button className="cursor-grab hover:bg-gray-200 dark:hover:bg-gray-600 p-1 rounded">
                  <GripVertical className="w-5 h-5 text-gray-400" />
                </button>
                <div className="flex-1">
                  <span className="font-medium">{section.title}</span>
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 capitalize">
                    ({section.type})
                  </span>
                </div>
                <button
                  onClick={() => removeSection(portfolio.id, section.id)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Remove
                </button>
              </div>

              {/* Section Content */}
              <div className="p-6">
                <SectionEditor
                  portfolio={portfolio}
                  section={section}
                  onUpdate={(updates) => updateSection(portfolio.id, section.id, updates)}
                />
              </div>
            </div>
          ))}
      </div>

      {/* Add Section Button */}
      <div className="mt-6">
        {!showAddSection ? (
          <button
            onClick={() => setShowAddSection(true)}
            className="w-full py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-purple-500 dark:hover:border-purple-500 transition-colors flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
          >
            <Plus className="w-5 h-5" />
            Add Section
          </button>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-semibold mb-4">Choose Section Type</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {['hero', 'gallery', 'about', 'video-reel', 'contact', 'resume'].map((type) => (
                <button
                  key={type}
                  onClick={() => handleAddSection(type)}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-500 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all capitalize"
                >
                  {type.replace('-', ' ')}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowAddSection(false)}
              className="mt-4 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
