# StarBook Web Component

> Embeddable portfolio builder for any framework

## Installation

```bash
npm install @starbook/web-component
```

## Quick Start

### Standalone Usage

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module" src="https://unpkg.com/@starbook/web-component"></script>
</head>
<body>
  <starbook-app></starbook-app>
</body>
</html>
```

### With Custom Services

```html
<starbook-app id="app"></starbook-app>

<script type="module">
  const app = document.getElementById('app');

  // Inject your storage service
  app.storageService = {
    async uploadFile(file, options) {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      return await res.json();
    },
    async deleteFile(url) {
      await fetch('/api/delete', { method: 'DELETE', body: JSON.stringify({ url }) });
    },
    async getSignedUrl(fileName, contentType) {
      const res = await fetch('/api/signed-url', {
        method: 'POST',
        body: JSON.stringify({ fileName, contentType })
      });
      return await res.json();
    }
  };

  // Inject your portfolio service
  app.portfolioService = {
    async savePortfolio(portfolio) {
      const res = await fetch('/api/portfolios', {
        method: 'POST',
        body: JSON.stringify(portfolio)
      });
      return await res.json();
    },
    async loadPortfolio(id) {
      const res = await fetch(`/api/portfolios/${id}`);
      return await res.json();
    },
    async listPortfolios() {
      const res = await fetch('/api/portfolios');
      return await res.json();
    },
    async deletePortfolio(id) {
      await fetch(`/api/portfolios/${id}`, { method: 'DELETE' });
    },
    async publishPortfolio(id) {
      const res = await fetch(`/api/portfolios/${id}/publish`, { method: 'POST' });
      return await res.json();
    }
  };
</script>
```

## Angular Integration

### 1. Install Package

```bash
npm install @starbook/web-component
```

### 2. Enable Custom Elements

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

### 3. Use in Component

```typescript
// portfolio.component.ts
import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { StorageService } from './services/storage.service';

@Component({
  selector: 'app-portfolio',
  template: '<starbook-app #starbook></starbook-app>',
})
export class PortfolioComponent implements AfterViewInit {
  @ViewChild('starbook') starbookElement!: ElementRef;

  constructor(private storage: StorageService) {}

  ngAfterViewInit() {
    const element = this.starbookElement.nativeElement;

    element.storageService = {
      uploadFile: (file: File, options: any) =>
        this.storage.uploadFile(file, options).toPromise(),
      // ... other methods
    };

    // Listen to events
    element.addEventListener('portfolio-saved', (event: any) => {
      console.log('Saved:', event.detail);
    });
  }
}
```

## React Integration

```tsx
import { useEffect, useRef } from 'react';
import '@starbook/web-component';

function Portfolio() {
  const ref = useRef<any>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.storageService = {
        // Your implementation
      };
    }
  }, []);

  return <starbook-app ref={ref} />;
}
```

## Vue Integration

```vue
<template>
  <starbook-app ref="starbook"></starbook-app>
</template>

<script>
import '@starbook/web-component';

export default {
  mounted() {
    this.$refs.starbook.storageService = {
      // Your implementation
    };
  }
}
</script>
```

## API

### Properties

- `storageService: IStorageService` - File storage service
- `portfolioService: IPortfolioService` - Portfolio data service
- `authService?: IAuthService` - Authentication service (optional)
- `config: StarBookConfig` - Configuration object

### Methods

- `getPortfolio(): Promise<Portfolio>` - Get current portfolio
- `exportPortfolio(): Promise<string>` - Export as JSON
- `importPortfolio(json: string): Promise<void>` - Import from JSON
- `clearData(): Promise<void>` - Clear all data
- `getStats(): Promise<Stats>` - Get statistics

### Events

- `portfolio-created` - Portfolio created
- `portfolio-updated` - Portfolio updated
- `portfolio-deleted` - Portfolio deleted
- `portfolio-published` - Portfolio published
- `media-uploaded` - Media uploaded
- `media-edited` - Media edited
- `media-deleted` - Media deleted
- `error` - Error occurred

## TypeScript

Full TypeScript definitions are included:

```typescript
import type {
  IStorageService,
  IPortfolioService,
  StarBookConfig,
} from '@starbook/web-component';
```

## License

MIT
