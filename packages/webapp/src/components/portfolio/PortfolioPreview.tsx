'use client';

import { Portfolio } from '@/store/portfolioStore';
import { useMediaStore } from '@/store/mediaStore';
import { PortfolioRenderer } from './PortfolioRenderer';

interface PortfolioPreviewProps {
  portfolio: Portfolio;
}

export function PortfolioPreview({ portfolio }: PortfolioPreviewProps) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Preview Notice */}
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
            📱 Preview Mode - This is how your portfolio will look to visitors
          </p>
        </div>

        {/* Portfolio */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden">
          <PortfolioRenderer portfolio={portfolio} />
        </div>
      </div>
    </div>
  );
}
