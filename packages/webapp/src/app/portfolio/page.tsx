'use client';

import { Plus, Palette, Eye, Code, Share2 } from 'lucide-react';
import { usePortfolioStore } from '@/store/portfolioStore';
import { TemplateSelector } from '@/components/portfolio/TemplateSelector';
import { PortfolioList } from '@/components/portfolio/PortfolioList';
import { useState } from 'react';

export default function PortfolioPage() {
  const { portfolios } = usePortfolioStore();
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            StarBook
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Portfolio Manager</p>
        </div>

        <nav className="space-y-2">
          <NavItem icon={<Palette className="w-5 h-5" />} label="My Portfolios" active />
          <NavItem icon={<Eye className="w-5 h-5" />} label="Published" />
          <NavItem icon={<Share2 className="w-5 h-5" />} label="Shared Links" />
        </nav>
      </aside>

      {/* Main content */}
      <main className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">My Portfolios</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Create and manage your professional portfolios
              </p>
            </div>
            <button
              onClick={() => setShowTemplateSelector(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Create Portfolio
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="Total Portfolios"
              value={portfolios.length}
              icon={<Palette className="w-6 h-6" />}
              color="purple"
            />
            <StatCard
              label="Published"
              value={portfolios.filter((p) => p.settings.visibility === 'public').length}
              icon={<Eye className="w-6 h-6" />}
              color="blue"
            />
            <StatCard
              label="Total Views"
              value={portfolios.reduce((acc, p) => acc + p.metadata.views, 0)}
              icon={<Eye className="w-6 h-6" />}
              color="green"
            />
            <StatCard
              label="Shared Links"
              value={0}
              icon={<Share2 className="w-6 h-6" />}
              color="pink"
            />
          </div>

          {/* Portfolio List */}
          <PortfolioList />

          {/* Template Selector Modal */}
          {showTemplateSelector && (
            <TemplateSelector onClose={() => setShowTemplateSelector(false)} />
          )}
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        active
          ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
  const colorClasses = {
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400',
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400',
    pink: 'bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-400',
  }[color];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
        <div className={`p-2 rounded-lg ${colorClasses}`}>{icon}</div>
      </div>
      <div className="text-3xl font-bold">{value}</div>
    </div>
  );
}
