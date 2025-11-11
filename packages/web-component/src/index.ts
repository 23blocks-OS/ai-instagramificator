// Export interfaces
export * from './interfaces';

// Export services
export { DefaultStorageService } from './services/DefaultStorageService';
export { DefaultPortfolioService } from './services/DefaultPortfolioService';

// Export web component
export { StarBookElement, ServicesContext, ConfigContext } from './wrapper/StarBookElement';

// Auto-register the custom element
import './wrapper/StarBookElement';
