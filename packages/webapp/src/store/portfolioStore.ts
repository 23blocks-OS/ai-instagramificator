import { create } from 'zustand';
import { MediaFile } from './mediaStore';

export type PortfolioTemplate = 'actor' | 'model' | 'dancer' | 'photographer' | 'generic';
export type PortfolioTheme = 'light' | 'dark' | 'minimal' | 'bold';
export type PortfolioLayout = 'grid' | 'masonry' | 'carousel' | 'split';

export interface PortfolioSection {
  id: string;
  type: 'hero' | 'gallery' | 'about' | 'video-reel' | 'contact' | 'resume';
  title: string;
  content?: string;
  mediaIds: string[];
  order: number;
  settings: {
    columns?: number;
    showCaptions?: boolean;
    autoplay?: boolean;
  };
}

export interface Portfolio {
  id: string;
  name: string;
  slug: string;
  template: PortfolioTemplate;
  theme: PortfolioTheme;
  layout: PortfolioLayout;
  sections: PortfolioSection[];
  customization: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    showBranding: boolean;
  };
  seo: {
    title: string;
    description: string;
    ogImage?: string;
  };
  settings: {
    visibility: 'public' | 'private' | 'password-protected';
    password?: string;
    allowDownload: boolean;
    customDomain?: string;
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    views: number;
  };
}

interface PortfolioStore {
  portfolios: Portfolio[];
  currentPortfolio: Portfolio | null;
  isEditing: boolean;

  // Actions
  createPortfolio: (template: PortfolioTemplate, name: string) => Portfolio;
  deletePortfolio: (id: string) => void;
  setCurrentPortfolio: (portfolio: Portfolio | null) => void;
  updatePortfolio: (id: string, updates: Partial<Portfolio>) => void;
  addSection: (portfolioId: string, section: Omit<PortfolioSection, 'id' | 'order'>) => void;
  updateSection: (portfolioId: string, sectionId: string, updates: Partial<PortfolioSection>) => void;
  removeSection: (portfolioId: string, sectionId: string) => void;
  reorderSections: (portfolioId: string, sectionIds: string[]) => void;
  addMediaToSection: (portfolioId: string, sectionId: string, mediaIds: string[]) => void;
  removeMediaFromSection: (portfolioId: string, sectionId: string, mediaId: string) => void;
  setEditing: (isEditing: boolean) => void;
  duplicatePortfolio: (id: string) => void;
}

const createDefaultSections = (template: PortfolioTemplate): PortfolioSection[] => {
  const baseSections: PortfolioSection[] = [
    {
      id: crypto.randomUUID(),
      type: 'hero',
      title: 'Welcome',
      mediaIds: [],
      order: 0,
      settings: {},
    },
    {
      id: crypto.randomUUID(),
      type: 'about',
      title: 'About Me',
      content: 'Tell your story here...',
      mediaIds: [],
      order: 1,
      settings: {},
    },
    {
      id: crypto.randomUUID(),
      type: 'gallery',
      title: 'Portfolio',
      mediaIds: [],
      order: 2,
      settings: {
        columns: 3,
        showCaptions: true,
      },
    },
    {
      id: crypto.randomUUID(),
      type: 'contact',
      title: 'Contact',
      content: '',
      mediaIds: [],
      order: 3,
      settings: {},
    },
  ];

  if (template === 'actor' || template === 'model') {
    baseSections.splice(2, 0, {
      id: crypto.randomUUID(),
      type: 'video-reel',
      title: 'Showreel',
      mediaIds: [],
      order: 2,
      settings: {
        autoplay: false,
      },
    });
  }

  if (template === 'actor') {
    baseSections.splice(3, 0, {
      id: crypto.randomUUID(),
      type: 'resume',
      title: 'Experience',
      content: '',
      mediaIds: [],
      order: 3,
      settings: {},
    });
  }

  return baseSections.map((section, index) => ({ ...section, order: index }));
};

export const usePortfolioStore = create<PortfolioStore>((set, get) => ({
  portfolios: [],
  currentPortfolio: null,
  isEditing: false,

  createPortfolio: (template: PortfolioTemplate, name: string) => {
    const newPortfolio: Portfolio = {
      id: crypto.randomUUID(),
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      template,
      theme: 'light',
      layout: 'grid',
      sections: createDefaultSections(template),
      customization: {
        primaryColor: '#6366f1',
        secondaryColor: '#ec4899',
        fontFamily: 'Inter',
        showBranding: true,
      },
      seo: {
        title: name,
        description: `${name}'s professional portfolio`,
      },
      settings: {
        visibility: 'public',
        allowDownload: false,
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        views: 0,
      },
    };

    set((state) => ({
      portfolios: [...state.portfolios, newPortfolio],
      currentPortfolio: newPortfolio,
    }));

    return newPortfolio;
  },

  deletePortfolio: (id: string) => {
    set((state) => ({
      portfolios: state.portfolios.filter((p) => p.id !== id),
      currentPortfolio: state.currentPortfolio?.id === id ? null : state.currentPortfolio,
    }));
  },

  setCurrentPortfolio: (portfolio: Portfolio | null) => {
    set({ currentPortfolio: portfolio });
  },

  updatePortfolio: (id: string, updates: Partial<Portfolio>) => {
    set((state) => ({
      portfolios: state.portfolios.map((p) =>
        p.id === id
          ? { ...p, ...updates, metadata: { ...p.metadata, updatedAt: new Date() } }
          : p
      ),
      currentPortfolio:
        state.currentPortfolio?.id === id
          ? { ...state.currentPortfolio, ...updates, metadata: { ...state.currentPortfolio.metadata, updatedAt: new Date() } }
          : state.currentPortfolio,
    }));
  },

  addSection: (portfolioId: string, section: Omit<PortfolioSection, 'id' | 'order'>) => {
    const portfolio = get().portfolios.find((p) => p.id === portfolioId);
    if (!portfolio) return;

    const newSection: PortfolioSection = {
      ...section,
      id: crypto.randomUUID(),
      order: portfolio.sections.length,
    };

    get().updatePortfolio(portfolioId, {
      sections: [...portfolio.sections, newSection],
    });
  },

  updateSection: (portfolioId: string, sectionId: string, updates: Partial<PortfolioSection>) => {
    const portfolio = get().portfolios.find((p) => p.id === portfolioId);
    if (!portfolio) return;

    get().updatePortfolio(portfolioId, {
      sections: portfolio.sections.map((s) =>
        s.id === sectionId ? { ...s, ...updates } : s
      ),
    });
  },

  removeSection: (portfolioId: string, sectionId: string) => {
    const portfolio = get().portfolios.find((p) => p.id === portfolioId);
    if (!portfolio) return;

    get().updatePortfolio(portfolioId, {
      sections: portfolio.sections.filter((s) => s.id !== sectionId),
    });
  },

  reorderSections: (portfolioId: string, sectionIds: string[]) => {
    const portfolio = get().portfolios.find((p) => p.id === portfolioId);
    if (!portfolio) return;

    const reorderedSections = sectionIds
      .map((id, index) => {
        const section = portfolio.sections.find((s) => s.id === id);
        return section ? { ...section, order: index } : null;
      })
      .filter((s): s is PortfolioSection => s !== null);

    get().updatePortfolio(portfolioId, {
      sections: reorderedSections,
    });
  },

  addMediaToSection: (portfolioId: string, sectionId: string, mediaIds: string[]) => {
    const portfolio = get().portfolios.find((p) => p.id === portfolioId);
    if (!portfolio) return;

    get().updatePortfolio(portfolioId, {
      sections: portfolio.sections.map((s) =>
        s.id === sectionId
          ? { ...s, mediaIds: [...s.mediaIds, ...mediaIds] }
          : s
      ),
    });
  },

  removeMediaFromSection: (portfolioId: string, sectionId: string, mediaId: string) => {
    const portfolio = get().portfolios.find((p) => p.id === portfolioId);
    if (!portfolio) return;

    get().updatePortfolio(portfolioId, {
      sections: portfolio.sections.map((s) =>
        s.id === sectionId
          ? { ...s, mediaIds: s.mediaIds.filter((id) => id !== mediaId) }
          : s
      ),
    });
  },

  setEditing: (isEditing: boolean) => {
    set({ isEditing });
  },

  duplicatePortfolio: (id: string) => {
    const portfolio = get().portfolios.find((p) => p.id === id);
    if (!portfolio) return;

    const duplicate: Portfolio = {
      ...portfolio,
      id: crypto.randomUUID(),
      name: `${portfolio.name} (Copy)`,
      slug: `${portfolio.slug}-copy`,
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        views: 0,
      },
    };

    set((state) => ({
      portfolios: [...state.portfolios, duplicate],
    }));
  },
}));
