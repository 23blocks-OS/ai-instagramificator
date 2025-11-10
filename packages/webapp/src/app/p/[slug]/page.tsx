'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { usePortfolioStore, Portfolio } from '@/store/portfolioStore';
import { PortfolioRenderer } from '@/components/portfolio/PortfolioRenderer';
import { Eye } from 'lucide-react';

export default function PublicPortfolioPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { portfolios, updatePortfolio } = usePortfolioStore();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const found = portfolios.find((p) => p.slug === slug);
    if (found) {
      setPortfolio(found);
      // Increment view count
      updatePortfolio(found.id, {
        metadata: {
          ...found.metadata,
          views: found.metadata.views + 1,
        },
      });
    }
    setLoading(false);
  }, [slug, portfolios, updatePortfolio]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-gray-600 dark:text-gray-400">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="text-6xl mb-4">😢</div>
          <h1 className="text-3xl font-bold mb-2">Portfolio Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400">
            The portfolio you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  // Check visibility
  if (portfolio.settings.visibility === 'private') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-3xl font-bold mb-2">Private Portfolio</h1>
          <p className="text-gray-600 dark:text-gray-400">
            This portfolio is private and cannot be viewed.
          </p>
        </div>
      </div>
    );
  }

  if (portfolio.settings.visibility === 'password-protected') {
    // TODO: Implement password protection
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full mx-auto p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🔐</div>
            <h1 className="text-3xl font-bold mb-2">Password Protected</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Please enter the password to view this portfolio.
            </p>
          </div>
          <input
            type="password"
            placeholder="Enter password"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 mb-4"
          />
          <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold">
            Access Portfolio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PortfolioRenderer portfolio={portfolio} />
    </div>
  );
}
