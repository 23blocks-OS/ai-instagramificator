# StarBook Web Component Architecture

## Overview

StarBook can be used in two modes:
1. **Standalone Mode**: Full application with default services
2. **Embedded Mode**: Web component with host-injected services

## Service Injection API

### IStorageService

Interface for file storage operations:

```typescript
interface IStorageService {
  /**
   * Upload a file to storage
   * @param file - The file to upload
   * @param options - Upload options (folder, metadata, etc.)
   * @returns Promise with the uploaded file URL
   */
  uploadFile(file: File, options?: UploadOptions): Promise<UploadResult>;

  /**
   * Delete a file from storage
   * @param fileUrl - URL of the file to delete
   */
  deleteFile(fileUrl: string): Promise<void>;

  /**
   * Get a signed URL for direct upload
   * @param fileName - Name of the file
   * @param contentType - MIME type
   */
  getSignedUrl(fileName: string, contentType: string): Promise<SignedUrlResult>;
}

interface UploadOptions {
  folder?: string;
  isPublic?: boolean;
  metadata?: Record<string, string>;
  onProgress?: (progress: number) => void;
}

interface UploadResult {
  url: string;
  key: string;
  thumbnailUrl?: string;
}

interface SignedUrlResult {
  uploadUrl: string;
  fileUrl: string;
  expiresIn: number;
}
```

### IPortfolioService

Interface for portfolio data persistence:

```typescript
interface IPortfolioService {
  /**
   * Save portfolio configuration
   * @param portfolio - Portfolio data
   */
  savePortfolio(portfolio: PortfolioConfig): Promise<{ id: string }>;

  /**
   * Load portfolio by ID
   * @param portfolioId - Portfolio ID
   */
  loadPortfolio(portfolioId: string): Promise<PortfolioConfig>;

  /**
   * List user's portfolios
   */
  listPortfolios(): Promise<PortfolioConfig[]>;

  /**
   * Delete a portfolio
   * @param portfolioId - Portfolio ID
   */
  deletePortfolio(portfolioId: string): Promise<void>;

  /**
   * Publish portfolio (make public)
   * @param portfolioId - Portfolio ID
   */
  publishPortfolio(portfolioId: string): Promise<{ url: string }>;
}
```

### IAuthService (Optional)

Interface for authentication:

```typescript
interface IAuthService {
  /**
   * Get current user
   */
  getCurrentUser(): Promise<User | null>;

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean;

  /**
   * Login
   */
  login(credentials: LoginCredentials): Promise<User>;

  /**
   * Logout
   */
  logout(): Promise<void>;
}

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}
```

## Portfolio JSON Schema

```json
{
  "id": "uuid",
  "version": "1.0",
  "metadata": {
    "name": "My Portfolio",
    "slug": "my-portfolio",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z",
    "userId": "user-id"
  },
  "template": "actor",
  "theme": "light",
  "layout": "grid",
  "customization": {
    "primaryColor": "#6366f1",
    "secondaryColor": "#ec4899",
    "fontFamily": "Inter",
    "showBranding": true
  },
  "seo": {
    "title": "Portfolio Title",
    "description": "Portfolio description",
    "ogImage": "https://..."
  },
  "settings": {
    "visibility": "public",
    "password": null,
    "allowDownload": false,
    "customDomain": null
  },
  "sections": [
    {
      "id": "section-1",
      "type": "hero",
      "title": "Welcome",
      "order": 0,
      "content": "Text content",
      "mediaUrls": ["https://..."],
      "settings": {
        "columns": 3,
        "showCaptions": true
      }
    }
  ],
  "media": [
    {
      "id": "media-1",
      "url": "https://...",
      "thumbnailUrl": "https://...",
      "type": "image",
      "name": "photo.jpg",
      "size": 1024000,
      "uploadedAt": "2024-01-01T00:00:00Z",
      "tags": ["headshot"],
      "category": "professional"
    }
  ]
}
```

## Web Component Usage

### Standalone Mode

```html
<!-- Load the web component -->
<script type="module" src="https://cdn.starbook.app/v1/starbook.js"></script>

<!-- Use the component -->
<starbook-app></starbook-app>
```

### Embedded Mode with Custom Services

```html
<script type="module" src="https://cdn.starbook.app/v1/starbook.js"></script>

<starbook-app id="portfolio-app"></starbook-app>

<script>
  const app = document.getElementById('portfolio-app');

  // Inject custom storage service
  app.storageService = {
    async uploadFile(file, options) {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      return await response.json();
    },

    async deleteFile(fileUrl) {
      await fetch('/api/delete', {
        method: 'DELETE',
        body: JSON.stringify({ url: fileUrl }),
      });
    },

    async getSignedUrl(fileName, contentType) {
      const response = await fetch('/api/signed-url', {
        method: 'POST',
        body: JSON.stringify({ fileName, contentType }),
      });

      return await response.json();
    }
  };

  // Inject custom portfolio service
  app.portfolioService = {
    async savePortfolio(portfolio) {
      const response = await fetch('/api/portfolios', {
        method: 'POST',
        body: JSON.stringify(portfolio),
      });

      return await response.json();
    },

    async loadPortfolio(portfolioId) {
      const response = await fetch(`/api/portfolios/${portfolioId}`);
      return await response.json();
    },

    async listPortfolios() {
      const response = await fetch('/api/portfolios');
      return await response.json();
    },

    async deletePortfolio(portfolioId) {
      await fetch(`/api/portfolios/${portfolioId}`, {
        method: 'DELETE',
      });
    },

    async publishPortfolio(portfolioId) {
      const response = await fetch(`/api/portfolios/${portfolioId}/publish`, {
        method: 'POST',
      });

      return await response.json();
    }
  };

  // Optional: Auth service
  app.authService = {
    async getCurrentUser() {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        return await response.json();
      }
      return null;
    },

    isAuthenticated() {
      return !!localStorage.getItem('auth_token');
    },

    async login(credentials) {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      return await response.json();
    },

    async logout() {
      await fetch('/api/auth/logout', { method: 'POST' });
      localStorage.removeItem('auth_token');
    }
  };
</script>
```

## Angular/Nx Integration

### Installation

```bash
# In your Angular/Nx workspace
npm install @starbook/web-component
```

### Module Setup

```typescript
// app.module.ts
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import '@starbook/web-component';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  // ...
})
export class AppModule { }
```

### Component Usage

```typescript
// portfolio.component.ts
import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { StorageService } from './services/storage.service';
import { PortfolioService } from './services/portfolio.service';

@Component({
  selector: 'app-portfolio',
  template: `
    <starbook-app #starbook></starbook-app>
  `,
})
export class PortfolioComponent implements AfterViewInit {
  @ViewChild('starbook', { static: false }) starbookElement!: ElementRef;

  constructor(
    private storageService: StorageService,
    private portfolioService: PortfolioService
  ) {}

  ngAfterViewInit() {
    const element = this.starbookElement.nativeElement;

    // Inject Angular services
    element.storageService = {
      uploadFile: (file: File, options: any) =>
        this.storageService.uploadFile(file, options).toPromise(),
      deleteFile: (url: string) =>
        this.storageService.deleteFile(url).toPromise(),
      getSignedUrl: (fileName: string, contentType: string) =>
        this.storageService.getSignedUrl(fileName, contentType).toPromise(),
    };

    element.portfolioService = {
      savePortfolio: (portfolio: any) =>
        this.portfolioService.save(portfolio).toPromise(),
      loadPortfolio: (id: string) =>
        this.portfolioService.load(id).toPromise(),
      listPortfolios: () =>
        this.portfolioService.list().toPromise(),
      deletePortfolio: (id: string) =>
        this.portfolioService.delete(id).toPromise(),
      publishPortfolio: (id: string) =>
        this.portfolioService.publish(id).toPromise(),
    };

    // Listen to events
    element.addEventListener('portfolio-saved', (event: any) => {
      console.log('Portfolio saved:', event.detail);
    });

    element.addEventListener('media-uploaded', (event: any) => {
      console.log('Media uploaded:', event.detail);
    });
  }
}
```

### Angular Service Example

```typescript
// storage.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(private http: HttpClient) {}

  uploadFile(file: File, options?: any): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post('/api/upload', formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  deleteFile(url: string): Observable<void> {
    return this.http.delete<void>('/api/files', {
      body: { url }
    });
  }

  getSignedUrl(fileName: string, contentType: string): Observable<any> {
    return this.http.post('/api/signed-url', {
      fileName,
      contentType
    });
  }
}
```

## Events

The web component emits custom events:

```typescript
// Portfolio events
element.addEventListener('portfolio-created', (e) => {
  console.log('Portfolio created:', e.detail.portfolio);
});

element.addEventListener('portfolio-updated', (e) => {
  console.log('Portfolio updated:', e.detail.portfolio);
});

element.addEventListener('portfolio-deleted', (e) => {
  console.log('Portfolio deleted:', e.detail.portfolioId);
});

element.addEventListener('portfolio-published', (e) => {
  console.log('Portfolio published:', e.detail.url);
});

// Media events
element.addEventListener('media-uploaded', (e) => {
  console.log('Media uploaded:', e.detail.media);
});

element.addEventListener('media-edited', (e) => {
  console.log('Media edited:', e.detail.media);
});

element.addEventListener('media-deleted', (e) => {
  console.log('Media deleted:', e.detail.mediaId);
});

// Error events
element.addEventListener('error', (e) => {
  console.error('Error occurred:', e.detail.error);
});
```

## Configuration

```typescript
// Set configuration
element.config = {
  // API endpoints (if using default services)
  apiUrl: 'https://api.starbook.app',

  // Feature flags
  features: {
    enableVideoEditing: true,
    enableCollaboration: false,
    enableAnalytics: true,
  },

  // Upload settings
  upload: {
    maxFileSize: 100 * 1024 * 1024, // 100MB
    allowedTypes: ['image/*', 'video/*'],
    maxFiles: 50,
  },

  // Theme
  theme: {
    primaryColor: '#6366f1',
    mode: 'light', // or 'dark'
  },

  // Locale
  locale: 'en',
};
```

## Methods

```typescript
// Get current portfolio
const portfolio = await element.getPortfolio();

// Export portfolio as JSON
const json = await element.exportPortfolio();

// Import portfolio from JSON
await element.importPortfolio(portfolioJson);

// Clear all data
await element.clearData();

// Get statistics
const stats = await element.getStats();
```

## Benefits

1. **Framework Agnostic**: Works with Angular, React, Vue, Svelte, or vanilla JS
2. **Service Injection**: Use your own backend/storage
3. **Easy Integration**: Just add a script tag and configure
4. **Type Safety**: Full TypeScript definitions included
5. **Event-Driven**: React to component events
6. **Portable**: Export/import portfolio data as JSON
7. **Customizable**: Theme and feature flags
8. **Nx Compatible**: Works seamlessly in Nx monorepos
