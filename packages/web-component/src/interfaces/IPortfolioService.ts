/**
 * Portfolio configuration structure
 */
export interface PortfolioConfig {
  id?: string;
  version: string;
  metadata: {
    name: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
    userId?: string;
  };
  template: 'actor' | 'model' | 'dancer' | 'photographer' | 'generic';
  theme: 'light' | 'dark' | 'minimal' | 'bold';
  layout: 'grid' | 'masonry' | 'carousel' | 'split';
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
  sections: PortfolioSection[];
  media: MediaItem[];
}

export interface PortfolioSection {
  id: string;
  type: 'hero' | 'gallery' | 'about' | 'video-reel' | 'contact' | 'resume';
  title: string;
  order: number;
  content?: string;
  mediaUrls: string[];
  settings: {
    columns?: number;
    showCaptions?: boolean;
    autoplay?: boolean;
    [key: string]: any;
  };
}

export interface MediaItem {
  id: string;
  url: string;
  thumbnailUrl?: string;
  type: 'image' | 'video';
  name: string;
  size: number;
  uploadedAt: string;
  tags: string[];
  category?: string;
}

/**
 * Result of saving a portfolio
 */
export interface SavePortfolioResult {
  id: string;
  slug?: string;
  version?: string;
}

/**
 * Result of publishing a portfolio
 */
export interface PublishPortfolioResult {
  url: string;
  slug: string;
  publishedAt: string;
}

/**
 * Interface for portfolio data persistence
 * Implement this interface to provide custom backend storage
 */
export interface IPortfolioService {
  /**
   * Save portfolio configuration
   * @param portfolio - Portfolio data to save
   * @returns Promise with save result containing portfolio ID
   */
  savePortfolio(portfolio: PortfolioConfig): Promise<SavePortfolioResult>;

  /**
   * Load a portfolio by ID
   * @param portfolioId - Portfolio ID
   * @returns Promise with portfolio data
   */
  loadPortfolio(portfolioId: string): Promise<PortfolioConfig>;

  /**
   * List all portfolios for the current user
   * @param options - Optional filtering/pagination
   * @returns Promise with array of portfolios
   */
  listPortfolios(options?: {
    limit?: number;
    offset?: number;
    filter?: Record<string, any>;
  }): Promise<PortfolioConfig[]>;

  /**
   * Delete a portfolio
   * @param portfolioId - Portfolio ID to delete
   */
  deletePortfolio(portfolioId: string): Promise<void>;

  /**
   * Publish a portfolio (make it publicly accessible)
   * @param portfolioId - Portfolio ID to publish
   * @returns Promise with public URL
   */
  publishPortfolio(portfolioId: string): Promise<PublishPortfolioResult>;

  /**
   * Unpublish a portfolio
   * @param portfolioId - Portfolio ID to unpublish
   */
  unpublishPortfolio?(portfolioId: string): Promise<void>;

  /**
   * Duplicate a portfolio
   * @param portfolioId - Portfolio ID to duplicate
   * @returns Promise with new portfolio ID
   */
  duplicatePortfolio?(portfolioId: string): Promise<SavePortfolioResult>;
}
