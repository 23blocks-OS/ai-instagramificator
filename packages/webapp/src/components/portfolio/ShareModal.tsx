'use client';

import { Portfolio } from '@/store/portfolioStore';
import { X, Copy, Check, Code, Link2, Mail, Facebook, Twitter, Linkedin } from 'lucide-react';
import { useState } from 'react';

interface ShareModalProps {
  portfolio: Portfolio;
  onClose: () => void;
}

export function ShareModal({ portfolio, onClose }: ShareModalProps) {
  const [activeTab, setActiveTab] = useState<'link' | 'embed' | 'social'>('link');
  const [copied, setCopied] = useState(false);

  const portfolioUrl = `${window.location.origin}/p/${portfolio.slug}`;
  const embedCode = `<iframe src="${portfolioUrl}" width="100%" height="800" frameborder="0" allowfullscreen></iframe>`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">Share Portfolio</h2>
            <p className="text-gray-600 dark:text-gray-400">{portfolio.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 px-6">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('link')}
              className={`pb-3 px-2 border-b-2 transition-colors ${
                activeTab === 'link'
                  ? 'border-purple-600 text-purple-600 font-medium'
                  : 'border-transparent text-gray-600 dark:text-gray-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <Link2 className="w-4 h-4" />
                Direct Link
              </div>
            </button>
            <button
              onClick={() => setActiveTab('embed')}
              className={`pb-3 px-2 border-b-2 transition-colors ${
                activeTab === 'embed'
                  ? 'border-purple-600 text-purple-600 font-medium'
                  : 'border-transparent text-gray-600 dark:text-gray-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4" />
                Embed Code
              </div>
            </button>
            <button
              onClick={() => setActiveTab('social')}
              className={`pb-3 px-2 border-b-2 transition-colors ${
                activeTab === 'social'
                  ? 'border-purple-600 text-purple-600 font-medium'
                  : 'border-transparent text-gray-600 dark:text-gray-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <Facebook className="w-4 h-4" />
                Social Media
              </div>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'link' && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Share this link with anyone to give them access to your portfolio
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={portfolioUrl}
                  readOnly
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm"
                />
                <button
                  onClick={() => handleCopy(portfolioUrl)}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      Copy
                    </>
                  )}
                </button>
              </div>

              {/* QR Code placeholder */}
              <div className="mt-6 p-8 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                <div className="w-48 h-48 mx-auto bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                  <p className="text-sm text-gray-500 dark:text-gray-400">QR Code</p>
                </div>
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  Scan to view portfolio on mobile
                </p>
              </div>
            </div>
          )}

          {activeTab === 'embed' && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Copy this code and paste it into your website's HTML
              </p>
              <div className="relative">
                <pre className="p-4 bg-gray-900 text-gray-100 rounded-lg text-sm overflow-x-auto">
                  <code>{embedCode}</code>
                </pre>
                <button
                  onClick={() => handleCopy(embedCode)}
                  className="absolute top-3 right-3 px-3 py-1.5 bg-white text-gray-900 rounded text-xs font-medium hover:bg-gray-100 transition-colors flex items-center gap-1"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy
                    </>
                  )}
                </button>
              </div>

              {/* Embed Options */}
              <div className="mt-6 space-y-4">
                <h3 className="font-semibold">Customization Options</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2">Width</label>
                    <input
                      type="text"
                      defaultValue="100%"
                      className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Height</label>
                    <input
                      type="text"
                      defaultValue="800"
                      className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Share your portfolio on social media platforms
              </p>
              <div className="space-y-3">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(portfolioUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    <Facebook className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">Facebook</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Share on Facebook
                    </p>
                  </div>
                </a>

                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(portfolioUrl)}&text=Check out my portfolio!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center text-white">
                    <Twitter className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">Twitter</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Share on Twitter
                    </p>
                  </div>
                </a>

                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(portfolioUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center text-white">
                    <Linkedin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">LinkedIn</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Share on LinkedIn
                    </p>
                  </div>
                </a>

                <button
                  onClick={() => handleCopy(`mailto:?subject=Check out my portfolio&body=${portfolioUrl}`)}
                  className="w-full flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Share via email
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
