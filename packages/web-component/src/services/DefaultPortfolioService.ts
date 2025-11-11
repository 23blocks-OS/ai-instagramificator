import {
  IPortfolioService,
  PortfolioConfig,
  SavePortfolioResult,
  PublishPortfolioResult,
} from '../interfaces';

/**
 * Default portfolio service using localStorage for demo/standalone mode
 * In production, this would be replaced with actual API calls
 */
export class DefaultPortfolioService implements IPortfolioService {
  private storageKey = 'starbook_portfolios';

  async savePortfolio(portfolio: PortfolioConfig): Promise<SavePortfolioResult> {
    const portfolios = this.getStoredPortfolios();

    // Generate ID if new
    if (!portfolio.id) {
      portfolio.id = `portfolio_${Date.now()}`;
    }

    // Update timestamps
    portfolio.metadata.updatedAt = new Date().toISOString();
    if (!portfolio.metadata.createdAt) {
      portfolio.metadata.createdAt = new Date().toISOString();
    }

    // Update or insert
    const existingIndex = portfolios.findIndex(p => p.id === portfolio.id);
    if (existingIndex >= 0) {
      portfolios[existingIndex] = portfolio;
    } else {
      portfolios.push(portfolio);
    }

    localStorage.setItem(this.storageKey, JSON.stringify(portfolios));

    return {
      id: portfolio.id,
      slug: portfolio.metadata.slug,
      version: portfolio.version,
    };
  }

  async loadPortfolio(portfolioId: string): Promise<PortfolioConfig> {
    const portfolios = this.getStoredPortfolios();
    const portfolio = portfolios.find(p => p.id === portfolioId);

    if (!portfolio) {
      throw new Error(`Portfolio not found: ${portfolioId}`);
    }

    return portfolio;
  }

  async listPortfolios(options?: {
    limit?: number;
    offset?: number;
  }): Promise<PortfolioConfig[]> {
    const portfolios = this.getStoredPortfolios();
    const offset = options?.offset || 0;
    const limit = options?.limit || portfolios.length;

    return portfolios
      .sort((a, b) =>
        new Date(b.metadata.updatedAt).getTime() -
        new Date(a.metadata.updatedAt).getTime()
      )
      .slice(offset, offset + limit);
  }

  async deletePortfolio(portfolioId: string): Promise<void> {
    const portfolios = this.getStoredPortfolios();
    const filtered = portfolios.filter(p => p.id !== portfolioId);
    localStorage.setItem(this.storageKey, JSON.stringify(filtered));
  }

  async publishPortfolio(portfolioId: string): Promise<PublishPortfolioResult> {
    const portfolio = await this.loadPortfolio(portfolioId);

    // Update visibility
    portfolio.settings.visibility = 'public';
    await this.savePortfolio(portfolio);

    const baseUrl = window.location.origin;
    return {
      url: `${baseUrl}/p/${portfolio.metadata.slug}`,
      slug: portfolio.metadata.slug,
      publishedAt: new Date().toISOString(),
    };
  }

  async unpublishPortfolio(portfolioId: string): Promise<void> {
    const portfolio = await this.loadPortfolio(portfolioId);
    portfolio.settings.visibility = 'private';
    await this.savePortfolio(portfolio);
  }

  async duplicatePortfolio(portfolioId: string): Promise<SavePortfolioResult> {
    const original = await this.loadPortfolio(portfolioId);

    // Create a copy
    const copy: PortfolioConfig = {
      ...original,
      id: undefined,
      metadata: {
        ...original.metadata,
        name: `${original.metadata.name} (Copy)`,
        slug: `${original.metadata.slug}-copy`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };

    return this.savePortfolio(copy);
  }

  private getStoredPortfolios(): PortfolioConfig[] {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }
}
