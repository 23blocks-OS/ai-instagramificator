'use client';

import { useState } from 'react';
import { X, Sparkles, Camera, Music, Image as ImageIcon, Layout } from 'lucide-react';
import { usePortfolioStore, PortfolioTemplate } from '@/store/portfolioStore';
import { useRouter } from 'next/navigation';

interface TemplateSelectorProps {
  onClose: () => void;
}

const templates: Array<{
  id: PortfolioTemplate;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  features: string[];
}> = [
  {
    id: 'actor',
    name: 'Actor',
    description: 'Perfect for actors with headshots, showreel, and resume',
    icon: <Sparkles className="w-8 h-8" />,
    color: 'from-purple-500 to-pink-500',
    features: ['Hero Section', 'Showreel', 'Photo Gallery', 'Resume', 'Contact'],
  },
  {
    id: 'model',
    name: 'Model',
    description: 'Showcase your modeling portfolio with comp cards',
    icon: <Camera className="w-8 h-8" />,
    color: 'from-pink-500 to-rose-500',
    features: ['Hero Section', 'Comp Card', 'Gallery', 'Measurements', 'Contact'],
  },
  {
    id: 'dancer',
    name: 'Dancer',
    description: 'Highlight your dance performances and videos',
    icon: <Music className="w-8 h-8" />,
    color: 'from-blue-500 to-cyan-500',
    features: ['Hero Section', 'Performance Videos', 'Gallery', 'About', 'Contact'],
  },
  {
    id: 'photographer',
    name: 'Photographer',
    description: 'Display your photography work beautifully',
    icon: <ImageIcon className="w-8 h-8" />,
    color: 'from-green-500 to-emerald-500',
    features: ['Hero Section', 'Masonry Gallery', 'About', 'Services', 'Contact'],
  },
  {
    id: 'generic',
    name: 'Generic',
    description: 'Flexible template for any creative professional',
    icon: <Layout className="w-8 h-8" />,
    color: 'from-gray-500 to-slate-500',
    features: ['Hero Section', 'Gallery', 'About', 'Skills', 'Contact'],
  },
];

export function TemplateSelector({ onClose }: TemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<PortfolioTemplate | null>(null);
  const [portfolioName, setPortfolioName] = useState('');
  const { createPortfolio } = usePortfolioStore();
  const router = useRouter();

  const handleCreate = () => {
    if (!selectedTemplate || !portfolioName.trim()) return;

    const portfolio = createPortfolio(selectedTemplate, portfolioName);
    router.push(`/portfolio/builder/${portfolio.id}`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">Choose a Template</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Select a template that best fits your needs
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Templates Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(template.id)}
              className={`text-left p-6 rounded-xl border-2 transition-all duration-300 ${
                selectedTemplate === template.id
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
              }`}
            >
              <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${template.color} text-white mb-4`}>
                {template.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{template.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {template.description}
              </p>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Includes:
                </p>
                {template.features.map((feature, index) => (
                  <div key={index} className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-purple-500" />
                    {feature}
                  </div>
                ))}
              </div>
            </button>
          ))}
        </div>

        {/* Footer with Name Input */}
        {selectedTemplate && (
          <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-6">
            <div className="max-w-2xl mx-auto">
              <label className="block text-sm font-medium mb-2">
                Portfolio Name
              </label>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={portfolioName}
                  onChange={(e) => setPortfolioName(e.target.value)}
                  placeholder="e.g., My Acting Portfolio"
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  autoFocus
                  onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
                />
                <button
                  onClick={handleCreate}
                  disabled={!portfolioName.trim()}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  Create Portfolio
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
