import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import {
  IStorageService,
  IPortfolioService,
  IAuthService,
  StarBookConfig,
} from '../interfaces';
import { DefaultStorageService } from '../services/DefaultStorageService';
import { DefaultPortfolioService } from '../services/DefaultPortfolioService';

// Import the main app component from webapp package
// In the actual implementation, we would reference the webapp package
// For now, this is a placeholder

interface StarBookElementProps {
  storageService?: IStorageService;
  portfolioService?: IPortfolioService;
  authService?: IAuthService;
  config?: StarBookConfig;
}

/**
 * Main React component that wraps the StarBook application
 */
function StarBookApp({
  storageService,
  portfolioService,
  authService,
  config,
}: StarBookElementProps) {
  const [services] = useState({
    storage: storageService || new DefaultStorageService(),
    portfolio: portfolioService || new DefaultPortfolioService(),
    auth: authService,
  });

  // Provide services to the app via context
  return (
    <ServicesContext.Provider value={services}>
      <ConfigContext.Provider value={config || {}}>
        {/* Main app would be rendered here */}
        <div className="starbook-container">
          <h1>StarBook Portfolio Builder</h1>
          <p>Web Component Mode</p>
        </div>
      </ConfigContext.Provider>
    </ServicesContext.Provider>
  );
}

// Contexts for dependency injection
export const ServicesContext = React.createContext<{
  storage: IStorageService;
  portfolio: IPortfolioService;
  auth?: IAuthService;
}>({
  storage: new DefaultStorageService(),
  portfolio: new DefaultPortfolioService(),
});

export const ConfigContext = React.createContext<StarBookConfig>({});

/**
 * Custom element definition for StarBook
 */
export class StarBookElement extends HTMLElement {
  private root: ReactDOM.Root | null = null;
  private _storageService?: IStorageService;
  private _portfolioService?: IPortfolioService;
  private _authService?: IAuthService;
  private _config?: StarBookConfig;

  static get observedAttributes() {
    return ['config'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'config' && newValue !== oldValue) {
      try {
        this._config = JSON.parse(newValue);
        this.render();
      } catch (error) {
        console.error('Invalid config JSON:', error);
      }
    }
  }

  // Service setters (for programmatic injection)
  set storageService(service: IStorageService) {
    this._storageService = service;
    this.render();
  }

  get storageService(): IStorageService | undefined {
    return this._storageService;
  }

  set portfolioService(service: IPortfolioService) {
    this._portfolioService = service;
    this.render();
  }

  get portfolioService(): IPortfolioService | undefined {
    return this._portfolioService;
  }

  set authService(service: IAuthService) {
    this._authService = service;
    this.render();
  }

  get authService(): IAuthService | undefined {
    return this._authService;
  }

  set config(config: StarBookConfig) {
    this._config = config;
    this.render();
  }

  get config(): StarBookConfig | undefined {
    return this._config;
  }

  // Public methods
  async getPortfolio(): Promise<any> {
    // Implementation would get current portfolio from state
    this.dispatchEvent(
      new CustomEvent('method-called', {
        detail: { method: 'getPortfolio' },
      })
    );
    return null;
  }

  async exportPortfolio(): Promise<string> {
    // Implementation would export current portfolio as JSON
    this.dispatchEvent(
      new CustomEvent('method-called', {
        detail: { method: 'exportPortfolio' },
      })
    );
    return JSON.stringify({});
  }

  async importPortfolio(json: string): Promise<void> {
    // Implementation would import portfolio from JSON
    this.dispatchEvent(
      new CustomEvent('portfolio-imported', {
        detail: { json },
      })
    );
  }

  async clearData(): Promise<void> {
    // Implementation would clear all data
    this.dispatchEvent(new CustomEvent('data-cleared'));
  }

  async getStats(): Promise<any> {
    // Implementation would return statistics
    return {
      totalMedia: 0,
      totalPortfolios: 0,
      totalViews: 0,
    };
  }

  // Event dispatchers
  dispatchPortfolioEvent(action: string, portfolio: any) {
    this.dispatchEvent(
      new CustomEvent('portfolio-event', {
        detail: { action, portfolio },
        bubbles: true,
        composed: true,
      })
    );

    // Also dispatch specific events
    this.dispatchEvent(
      new CustomEvent(`portfolio-${action}`, {
        detail: { portfolio },
        bubbles: true,
        composed: true,
      })
    );
  }

  dispatchMediaEvent(action: string, media: any) {
    this.dispatchEvent(
      new CustomEvent('media-event', {
        detail: { action, media },
        bubbles: true,
        composed: true,
      })
    );

    this.dispatchEvent(
      new CustomEvent(`media-${action}`, {
        detail: { media },
        bubbles: true,
        composed: true,
      })
    );
  }

  dispatchErrorEvent(error: Error, context?: string) {
    this.dispatchEvent(
      new CustomEvent('error', {
        detail: { error, context },
        bubbles: true,
        composed: true,
      })
    );
  }

  private render() {
    if (!this.shadowRoot) return;

    // Create container
    const container = this.shadowRoot.querySelector('.starbook-root') as HTMLElement;
    const mountPoint = container || document.createElement('div');
    mountPoint.className = 'starbook-root';

    if (!container) {
      // Add styles
      const style = document.createElement('style');
      style.textContent = `
        .starbook-root {
          width: 100%;
          height: 100%;
          display: block;
        }
      `;
      this.shadowRoot.appendChild(style);
      this.shadowRoot.appendChild(mountPoint);
    }

    // Create or update React root
    if (!this.root) {
      this.root = ReactDOM.createRoot(mountPoint);
    }

    this.root.render(
      <StarBookApp
        storageService={this._storageService}
        portfolioService={this._portfolioService}
        authService={this._authService}
        config={this._config}
      />
    );
  }
}

// Register the custom element
if (typeof window !== 'undefined' && !customElements.get('starbook-app')) {
  customElements.define('starbook-app', StarBookElement);
}
