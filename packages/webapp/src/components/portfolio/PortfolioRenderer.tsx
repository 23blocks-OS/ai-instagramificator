'use client';

import { Portfolio, PortfolioSection } from '@/store/portfolioStore';
import { useMediaStore } from '@/store/mediaStore';
import Image from 'next/image';
import { Download, Mail, Phone, MapPin } from 'lucide-react';

interface PortfolioRendererProps {
  portfolio: Portfolio;
}

export function PortfolioRenderer({ portfolio }: PortfolioRendererProps) {
  const { files } = useMediaStore();

  const getMediaFiles = (mediaIds: string[]) => {
    return files.filter((file) => mediaIds.includes(file.id));
  };

  const renderSection = (section: PortfolioSection) => {
    const media = getMediaFiles(section.mediaIds);

    switch (section.type) {
      case 'hero':
        return <HeroSection section={section} media={media} portfolio={portfolio} />;
      case 'about':
        return <AboutSection section={section} portfolio={portfolio} />;
      case 'gallery':
        return <GallerySection section={section} media={media} portfolio={portfolio} />;
      case 'video-reel':
        return <VideoReelSection section={section} media={media} portfolio={portfolio} />;
      case 'resume':
        return <ResumeSection section={section} portfolio={portfolio} />;
      case 'contact':
        return <ContactSection section={section} portfolio={portfolio} />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`${portfolio.theme === 'dark' ? 'dark' : ''}`}
      style={{
        fontFamily: portfolio.customization.fontFamily,
        '--primary-color': portfolio.customization.primaryColor,
        '--secondary-color': portfolio.customization.secondaryColor,
      } as any}
    >
      {portfolio.sections
        .sort((a, b) => a.order - b.order)
        .map((section) => (
          <div key={section.id}>{renderSection(section)}</div>
        ))}

      {/* Footer */}
      {portfolio.customization.showBranding && (
        <footer className="py-6 text-center bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Made with{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-semibold">
              StarBook
            </span>
          </p>
        </footer>
      )}
    </div>
  );
}

// Section Components
function HeroSection({ section, media, portfolio }: any) {
  const heroImage = media[0];

  return (
    <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
      {heroImage && (
        <div className="absolute inset-0">
          {heroImage.type === 'image' ? (
            <Image
              src={heroImage.url}
              alt={section.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <video
              src={heroImage.url}
              autoPlay
              muted
              loop
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-6xl md:text-8xl font-bold mb-4">{section.title}</h1>
        {section.content && (
          <p className="text-xl md:text-2xl max-w-2xl mx-auto">{section.content}</p>
        )}
      </div>
    </section>
  );
}

function AboutSection({ section, portfolio }: any) {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h2
          className="text-4xl font-bold mb-8 text-center"
          style={{ color: portfolio.customization.primaryColor }}
        >
          {section.title}
        </h2>
        <div className="prose prose-lg dark:prose-invert mx-auto">
          <p className="text-lg leading-relaxed whitespace-pre-wrap">{section.content}</p>
        </div>
      </div>
    </section>
  );
}

function GallerySection({ section, media, portfolio }: any) {
  const columns = section.settings.columns || 3;

  return (
    <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <h2
          className="text-4xl font-bold mb-12 text-center"
          style={{ color: portfolio.customization.primaryColor }}
        >
          {section.title}
        </h2>
        <div
          className={`grid gap-4`}
          style={{
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          }}
        >
          {media.map((file: any) => (
            <div
              key={file.id}
              className="relative aspect-square rounded-lg overflow-hidden group"
            >
              {file.type === 'image' ? (
                <Image
                  src={file.url}
                  alt={file.metadata.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <video src={file.url} className="w-full h-full object-cover" controls />
              )}
              {section.settings.showCaptions && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                  <p className="text-white text-sm">{file.metadata.name}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function VideoReelSection({ section, media, portfolio }: any) {
  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <h2
          className="text-4xl font-bold mb-12 text-center"
          style={{ color: portfolio.customization.primaryColor }}
        >
          {section.title}
        </h2>
        <div className="space-y-8">
          {media.map((file: any) => (
            <div key={file.id} className="aspect-video rounded-xl overflow-hidden">
              <video src={file.url} controls className="w-full h-full">
                Your browser does not support the video tag.
              </video>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ResumeSection({ section, portfolio }: any) {
  return (
    <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <h2
          className="text-4xl font-bold mb-12 text-center"
          style={{ color: portfolio.customization.primaryColor }}
        >
          {section.title}
        </h2>
        <div className="prose prose-lg dark:prose-invert mx-auto">
          <p className="whitespace-pre-wrap">{section.content}</p>
        </div>
      </div>
    </section>
  );
}

function ContactSection({ section, portfolio }: any) {
  return (
    <section className="py-20 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h2
          className="text-4xl font-bold mb-8"
          style={{ color: portfolio.customization.primaryColor }}
        >
          {section.title}
        </h2>
        <div className="prose prose-lg dark:prose-invert mx-auto mb-8">
          <p className="whitespace-pre-wrap">{section.content}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="mailto:contact@example.com"
            className="flex items-center gap-2 px-6 py-3 rounded-lg border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            style={{ borderColor: portfolio.customization.primaryColor }}
          >
            <Mail className="w-5 h-5" />
            Email Me
          </a>
        </div>
      </div>
    </section>
  );
}
