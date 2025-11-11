# StarBook Angular/Nx Integration Example

This example shows how to integrate StarBook web component into an Angular application within an Nx monorepo.

## Project Structure

```
angular-nx-workspace/
├── apps/
│   └── portfolio-app/
│       ├── src/
│       │   ├── app/
│       │   │   ├── services/
│       │   │   │   ├── storage.service.ts
│       │   │   │   └── portfolio.service.ts
│       │   │   ├── components/
│       │   │   │   └── portfolio/
│       │   │   │       ├── portfolio.component.ts
│       │   │   │       └── portfolio.component.html
│       │   │   └── app.module.ts
│       │   └── main.ts
│       └── project.json
└── package.json
```

## Installation

```bash
# In your Nx workspace root
npm install @starbook/web-component
```

## Configuration

### 1. Enable Custom Elements

```typescript
// apps/portfolio-app/src/app/app.module.ts
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import '@starbook/web-component';

import { AppComponent } from './app.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';

@NgModule({
  declarations: [AppComponent, PortfolioComponent],
  imports: [BrowserModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Important!
})
export class AppModule {}
```

### 2. Storage Service

```typescript
// apps/portfolio-app/src/app/services/storage.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface UploadOptions {
  folder?: string;
  isPublic?: boolean;
  metadata?: Record<string, string>;
  onProgress?: (progress: number) => void;
}

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private apiUrl = '/api/storage';

  constructor(private http: HttpClient) {}

  uploadFile(file: File, options?: UploadOptions): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    if (options?.folder) formData.append('folder', options.folder);
    if (options?.metadata) {
      formData.append('metadata', JSON.stringify(options.metadata));
    }

    return new Promise((resolve, reject) => {
      this.http
        .post(`${this.apiUrl}/upload`, formData, {
          reportProgress: true,
          observe: 'events',
        })
        .subscribe({
          next: (event: HttpEvent<any>) => {
            if (event.type === HttpEventType.UploadProgress && event.total) {
              const progress = Math.round((100 * event.loaded) / event.total);
              options?.onProgress?.(progress);
            } else if (event.type === HttpEventType.Response) {
              resolve(event.body);
            }
          },
          error: (error) => reject(error),
        });
    });
  }

  async deleteFile(fileUrl: string): Promise<void> {
    await this.http
      .delete(`${this.apiUrl}/delete`, { body: { url: fileUrl } })
      .toPromise();
  }

  async getSignedUrl(
    fileName: string,
    contentType: string
  ): Promise<any> {
    return await this.http
      .post(`${this.apiUrl}/signed-url`, { fileName, contentType })
      .toPromise();
  }
}
```

### 3. Portfolio Service

```typescript
// apps/portfolio-app/src/app/services/portfolio.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PortfolioService {
  private apiUrl = '/api/portfolios';

  constructor(private http: HttpClient) {}

  async savePortfolio(portfolio: any): Promise<any> {
    return await this.http.post(this.apiUrl, portfolio).toPromise();
  }

  async loadPortfolio(portfolioId: string): Promise<any> {
    return await this.http.get(`${this.apiUrl}/${portfolioId}`).toPromise();
  }

  async listPortfolios(): Promise<any[]> {
    return await this.http.get<any[]>(this.apiUrl).toPromise();
  }

  async deletePortfolio(portfolioId: string): Promise<void> {
    await this.http.delete(`${this.apiUrl}/${portfolioId}`).toPromise();
  }

  async publishPortfolio(portfolioId: string): Promise<any> {
    return await this.http
      .post(`${this.apiUrl}/${portfolioId}/publish`, {})
      .toPromise();
  }
}
```

### 4. Portfolio Component

```typescript
// apps/portfolio-app/src/app/components/portfolio/portfolio.component.ts
import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css'],
})
export class PortfolioComponent implements AfterViewInit, OnDestroy {
  @ViewChild('starbook', { static: false }) starbookElement!: ElementRef;

  private eventListeners: Array<{
    event: string;
    handler: EventListener;
  }> = [];

  constructor(
    private storageService: StorageService,
    private portfolioService: PortfolioService
  ) {}

  ngAfterViewInit(): void {
    const element = this.starbookElement.nativeElement;

    // Inject services
    element.storageService = {
      uploadFile: (file: File, options: any) =>
        this.storageService.uploadFile(file, options),
      deleteFile: (url: string) => this.storageService.deleteFile(url),
      getSignedUrl: (fileName: string, contentType: string) =>
        this.storageService.getSignedUrl(fileName, contentType),
    };

    element.portfolioService = {
      savePortfolio: (portfolio: any) =>
        this.portfolioService.savePortfolio(portfolio),
      loadPortfolio: (id: string) =>
        this.portfolioService.loadPortfolio(id),
      listPortfolios: () => this.portfolioService.listPortfolios(),
      deletePortfolio: (id: string) =>
        this.portfolioService.deletePortfolio(id),
      publishPortfolio: (id: string) =>
        this.portfolioService.publishPortfolio(id),
    };

    // Set configuration
    element.config = {
      features: {
        enableVideoEditing: true,
        enableAnalytics: true,
      },
      upload: {
        maxFileSize: 100 * 1024 * 1024, // 100MB
      },
      theme: {
        primaryColor: '#6366f1',
        mode: 'light',
      },
    };

    // Listen to events
    this.addEventListener(element, 'portfolio-saved', (event: any) => {
      console.log('Portfolio saved:', event.detail);
      // Handle in your Angular app
    });

    this.addEventListener(element, 'media-uploaded', (event: any) => {
      console.log('Media uploaded:', event.detail);
    });

    this.addEventListener(element, 'error', (event: any) => {
      console.error('Error:', event.detail);
    });
  }

  ngOnDestroy(): void {
    // Clean up event listeners
    const element = this.starbookElement?.nativeElement;
    if (element) {
      this.eventListeners.forEach(({ event, handler }) => {
        element.removeEventListener(event, handler);
      });
    }
  }

  private addEventListener(
    element: any,
    event: string,
    handler: EventListener
  ): void {
    element.addEventListener(event, handler);
    this.eventListeners.push({ event, handler });
  }
}
```

```html
<!-- apps/portfolio-app/src/app/components/portfolio/portfolio.component.html -->
<div class="portfolio-container">
  <starbook-app #starbook></starbook-app>
</div>
```

```css
/* apps/portfolio-app/src/app/components/portfolio/portfolio.component.css */
.portfolio-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

starbook-app {
  display: block;
  width: 100%;
  height: 100%;
}
```

## Nx Configuration

```json
// apps/portfolio-app/project.json
{
  "name": "portfolio-app",
  "$schema": "../../node_modules/nx/schemas/project-schema.json",
  "projectType": "application",
  "sourceRoot": "apps/portfolio-app/src",
  "targets": {
    "build": {
      "executor": "@angular-devkit/build-angular:browser",
      "options": {
        "allowedCommonJsDependencies": ["@starbook/web-component"]
      }
    }
  }
}
```

## Backend API Example

```typescript
// Example Express.js API endpoints
import express from 'express';
import multer from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
const s3 = new S3Client({ region: 'us-east-1' });

// Upload file
router.post('/storage/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file!;
    const key = `uploads/${Date.now()}_${file.originalname}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
    );

    res.json({
      url: `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${key}`,
      key,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Portfolio endpoints
router.post('/portfolios', async (req, res) => {
  // Save to database
  const portfolio = await db.portfolios.create(req.body);
  res.json({ id: portfolio.id });
});

router.get('/portfolios/:id', async (req, res) => {
  const portfolio = await db.portfolios.findById(req.params.id);
  res.json(portfolio);
});

export default router;
```

## Running

```bash
# Development
nx serve portfolio-app

# Production build
nx build portfolio-app --prod
```

## Benefits

- ✅ Full type safety with TypeScript
- ✅ Use your existing Angular services
- ✅ Seamless integration with Nx
- ✅ Custom backend/storage
- ✅ Event-driven communication
- ✅ Easy to maintain and test
