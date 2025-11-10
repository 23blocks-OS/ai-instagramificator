'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePortfolioStore } from '@/store/portfolioStore';
import { useMediaStore } from '@/store/mediaStore';
import { PortfolioEditor } from '@/components/portfolio/PortfolioEditor';
import { PortfolioPreview } from '@/components/portfolio/PortfolioPreview';
import { CustomizationPanel } from '@/components/portfolio/CustomizationPanel';
import { ShareModal } from '@/components/portfolio/ShareModal';
import { ArrowLeft, Eye, Settings, Save, Share2 } from 'lucide-react';

export default function PortfolioBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const portfolioId = params.id as string;

  const { portfolios, setCurrentPortfolio, currentPortfolio } = usePortfolioStore();
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [showCustomization, setShowCustomization] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    const portfolio = portfolios.find((p) => p.id === portfolioId);
    if (portfolio) {
      setCurrentPortfolio(portfolio);
    } else {
      router.push('/portfolio');
    }
  }, [portfolioId, portfolios, setCurrentPortfolio, router]);

  if (!currentPortfolio) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-gray-600 dark:text-gray-400">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/portfolio')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold">{currentPortfolio.name}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                {currentPortfolio.template} Template
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-1 flex">
              <button
                onClick={() => setActiveTab('edit')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'edit'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Edit
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'preview'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Preview
              </button>
            </div>

            {/* Action Buttons */}
            <button
              onClick={() => setShowCustomization(!showCustomization)}
              className="p-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              title="Customization"
            >
              <Settings className="w-5 h-5" />
            </button>

            <button
              className="p-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              title="Save"
            >
              <Save className="w-5 h-5" />
            </button>

            <button
              onClick={() => window.open(`/p/${currentPortfolio.slug}`, '_blank')}
              className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              <Eye className="w-5 h-5" />
              View Live
            </button>

            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
            >
              <Share2 className="w-5 h-5" />
              Share
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex">
        {/* Editor/Preview Area */}
        <div className={`flex-1 transition-all duration-300 ${showCustomization ? 'mr-80' : ''}`}>
          {activeTab === 'edit' ? (
            <PortfolioEditor portfolio={currentPortfolio} />
          ) : (
            <PortfolioPreview portfolio={currentPortfolio} />
          )}
        </div>

        {/* Customization Panel */}
        {showCustomization && (
          <CustomizationPanel
            portfolio={currentPortfolio}
            onClose={() => setShowCustomization(false)}
          />
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal
          portfolio={currentPortfolio}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
}
