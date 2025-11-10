'use client';

import { Portfolio, usePortfolioStore } from '@/store/portfolioStore';
import { X, Palette, Type, Layout, Eye, Lock } from 'lucide-react';

interface CustomizationPanelProps {
  portfolio: Portfolio;
  onClose: () => void;
}

export function CustomizationPanel({ portfolio, onClose }: CustomizationPanelProps) {
  const { updatePortfolio } = usePortfolioStore();

  const handleUpdate = (updates: Partial<Portfolio>) => {
    updatePortfolio(portfolio.id, updates);
  };

  return (
    <div className="fixed right-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 shadow-2xl overflow-y-auto z-50">
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
        <h3 className="font-bold">Customization</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* Theme */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Palette className="w-4 h-4" />
            <label className="font-medium text-sm">Theme</label>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {['light', 'dark', 'minimal', 'bold'].map((theme) => (
              <button
                key={theme}
                onClick={() => handleUpdate({ theme: theme as any })}
                className={`px-4 py-2 rounded-lg border-2 capitalize text-sm font-medium transition-colors ${
                  portfolio.theme === theme
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
                }`}
              >
                {theme}
              </button>
            ))}
          </div>
        </div>

        {/* Layout */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Layout className="w-4 h-4" />
            <label className="font-medium text-sm">Layout</label>
          </div>
          <div className="space-y-2">
            {['grid', 'masonry', 'carousel', 'split'].map((layout) => (
              <button
                key={layout}
                onClick={() => handleUpdate({ layout: layout as any })}
                className={`w-full px-4 py-2 rounded-lg border-2 capitalize text-sm font-medium transition-colors text-left ${
                  portfolio.layout === layout
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
                }`}
              >
                {layout}
              </button>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Palette className="w-4 h-4" />
            <label className="font-medium text-sm">Colors</label>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">
                Primary Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={portfolio.customization.primaryColor}
                  onChange={(e) =>
                    handleUpdate({
                      customization: {
                        ...portfolio.customization,
                        primaryColor: e.target.value,
                      },
                    })
                  }
                  className="w-12 h-10 rounded border border-gray-300 dark:border-gray-600"
                />
                <input
                  type="text"
                  value={portfolio.customization.primaryColor}
                  onChange={(e) =>
                    handleUpdate({
                      customization: {
                        ...portfolio.customization,
                        primaryColor: e.target.value,
                      },
                    })
                  }
                  className="flex-1 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">
                Secondary Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={portfolio.customization.secondaryColor}
                  onChange={(e) =>
                    handleUpdate({
                      customization: {
                        ...portfolio.customization,
                        secondaryColor: e.target.value,
                      },
                    })
                  }
                  className="w-12 h-10 rounded border border-gray-300 dark:border-gray-600"
                />
                <input
                  type="text"
                  value={portfolio.customization.secondaryColor}
                  onChange={(e) =>
                    handleUpdate({
                      customization: {
                        ...portfolio.customization,
                        secondaryColor: e.target.value,
                      },
                    })
                  }
                  className="flex-1 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Font */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Type className="w-4 h-4" />
            <label className="font-medium text-sm">Font Family</label>
          </div>
          <select
            value={portfolio.customization.fontFamily}
            onChange={(e) =>
              handleUpdate({
                customization: {
                  ...portfolio.customization,
                  fontFamily: e.target.value,
                },
              })
            }
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
          >
            <option value="Inter">Inter</option>
            <option value="Playfair Display">Playfair Display</option>
            <option value="Montserrat">Montserrat</option>
            <option value="Roboto">Roboto</option>
            <option value="Open Sans">Open Sans</option>
          </select>
        </div>

        {/* Visibility */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Lock className="w-4 h-4" />
            <label className="font-medium text-sm">Visibility</label>
          </div>
          <select
            value={portfolio.settings.visibility}
            onChange={(e) =>
              handleUpdate({
                settings: {
                  ...portfolio.settings,
                  visibility: e.target.value as any,
                },
              })
            }
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="password-protected">Password Protected</option>
          </select>
        </div>

        {/* SEO */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Eye className="w-4 h-4" />
            <label className="font-medium text-sm">SEO</label>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">
                Page Title
              </label>
              <input
                type="text"
                value={portfolio.seo.title}
                onChange={(e) =>
                  handleUpdate({
                    seo: { ...portfolio.seo, title: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                placeholder="Your Portfolio Title"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">
                Description
              </label>
              <textarea
                value={portfolio.seo.description}
                onChange={(e) =>
                  handleUpdate({
                    seo: { ...portfolio.seo, description: e.target.value },
                  })
                }
                rows={3}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                placeholder="Brief description for search engines"
              />
            </div>
          </div>
        </div>

        {/* Options */}
        <div>
          <label className="flex items-center gap-2 text-sm mb-2">
            <input
              type="checkbox"
              checked={portfolio.settings.allowDownload}
              onChange={(e) =>
                handleUpdate({
                  settings: {
                    ...portfolio.settings,
                    allowDownload: e.target.checked,
                  },
                })
              }
              className="rounded"
            />
            Allow media downloads
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={portfolio.customization.showBranding}
              onChange={(e) =>
                handleUpdate({
                  customization: {
                    ...portfolio.customization,
                    showBranding: e.target.checked,
                  },
                })
              }
              className="rounded"
            />
            Show StarBook branding
          </label>
        </div>
      </div>
    </div>
  );
}
