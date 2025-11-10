'use client';

import { usePortfolioStore } from '@/store/portfolioStore';
import { Eye, Edit2, Trash2, Copy, ExternalLink, MoreVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function PortfolioList() {
  const { portfolios, deletePortfolio, duplicatePortfolio } = usePortfolioStore();
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  if (portfolios.length === 0) {
    return (
      <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
        <div className="text-6xl mb-4">🎨</div>
        <h3 className="text-xl font-bold mb-2">No Portfolios Yet</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Create your first portfolio to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {portfolios.map((portfolio) => (
        <div
          key={portfolio.id}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 group"
        >
          {/* Preview Image */}
          <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 flex items-center justify-center relative">
            <div className="text-6xl">
              {portfolio.template === 'actor' && '🎭'}
              {portfolio.template === 'model' && '📸'}
              {portfolio.template === 'dancer' && '💃'}
              {portfolio.template === 'photographer' && '📷'}
              {portfolio.template === 'generic' && '🎨'}
            </div>

            {/* Visibility Badge */}
            <div className="absolute top-3 left-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                portfolio.settings.visibility === 'public'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}>
                {portfolio.settings.visibility === 'public' ? 'Public' : 'Private'}
              </span>
            </div>

            {/* Menu */}
            <div className="absolute top-3 right-3">
              <button
                onClick={() => setActiveMenu(activeMenu === portfolio.id ? null : portfolio.id)}
                className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {activeMenu === portfolio.id && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-10">
                  <button
                    onClick={() => {
                      router.push(`/portfolio/builder/${portfolio.id}`);
                      setActiveMenu(null);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      window.open(`/p/${portfolio.slug}`, '_blank');
                      setActiveMenu(null);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Live
                  </button>
                  <button
                    onClick={() => {
                      duplicatePortfolio(portfolio.id);
                      setActiveMenu(null);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Duplicate
                  </button>
                  <hr className="my-2 border-gray-200 dark:border-gray-700" />
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this portfolio?')) {
                        deletePortfolio(portfolio.id);
                      }
                      setActiveMenu(null);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="text-lg font-bold mb-1">{portfolio.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 capitalize">
              {portfolio.template} Template • {portfolio.theme} Theme
            </p>

            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {portfolio.metadata.views} views
              </div>
              <div>
                {portfolio.sections.length} sections
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => router.push(`/portfolio/builder/${portfolio.id}`)}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => window.open(`/p/${portfolio.slug}`, '_blank')}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
