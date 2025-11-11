export * from './IStorageService';
export * from './IPortfolioService';
export * from './IAuthService';

/**
 * Configuration for the StarBook web component
 */
export interface StarBookConfig {
  /** API base URL (if using default services) */
  apiUrl?: string;

  /** Feature flags */
  features?: {
    enableVideoEditing?: boolean;
    enableCollaboration?: boolean;
    enableAnalytics?: boolean;
    enableComments?: boolean;
  };

  /** Upload settings */
  upload?: {
    maxFileSize?: number;
    allowedTypes?: string[];
    maxFiles?: number;
  };

  /** Theme configuration */
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    mode?: 'light' | 'dark' | 'auto';
  };

  /** Localization */
  locale?: string;

  /** Debug mode */
  debug?: boolean;
}

/**
 * Event detail types
 */
export interface PortfolioEventDetail {
  portfolio: any;
  action: 'created' | 'updated' | 'deleted' | 'published';
}

export interface MediaEventDetail {
  media: any;
  action: 'uploaded' | 'edited' | 'deleted';
}

export interface ErrorEventDetail {
  error: Error;
  context?: string;
}
