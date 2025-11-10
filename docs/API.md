# StarBook API Documentation

## Overview

The StarBook API provides endpoints for managing user portfolios, media files, and content sharing.

**Base URL**: `https://api.starbook.app/v1`

**Authentication**: JWT Bearer token

## Authentication

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response**:
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "jwt_token"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response**:
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "jwt_token"
}
```

## Media Management

### Upload Media
```http
POST /media/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: [binary]
category: "headshot"
tags: ["professional", "outdoor"]
```

**Response**:
```json
{
  "id": "uuid",
  "url": "https://cdn.starbook.app/media/...",
  "type": "image",
  "metadata": {
    "name": "photo.jpg",
    "size": 1024000,
    "format": "jpeg",
    "dimensions": {
      "width": 1920,
      "height": 1080
    }
  },
  "uploadedAt": "2024-01-01T00:00:00Z"
}
```

### Get Pre-signed Upload URL
```http
POST /media/presigned-url
Authorization: Bearer {token}
Content-Type: application/json

{
  "filename": "photo.jpg",
  "contentType": "image/jpeg",
  "size": 1024000
}
```

**Response**:
```json
{
  "uploadUrl": "https://s3.amazonaws.com/...",
  "mediaId": "uuid",
  "expiresIn": 3600
}
```

### List Media
```http
GET /media?page=1&limit=20&category=headshot&tag=professional
Authorization: Bearer {token}
```

**Response**:
```json
{
  "items": [
    {
      "id": "uuid",
      "url": "https://cdn.starbook.app/media/...",
      "type": "image",
      "metadata": {...},
      "tags": ["professional"],
      "category": "headshot"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

### Get Media Details
```http
GET /media/{mediaId}
Authorization: Bearer {token}
```

### Update Media Metadata
```http
PATCH /media/{mediaId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "tags": ["professional", "outdoor", "2024"],
  "category": "headshot",
  "description": "Professional headshot taken outdoors"
}
```

### Delete Media
```http
DELETE /media/{mediaId}
Authorization: Bearer {token}
```

## Portfolio Management

### Create Portfolio
```http
POST /portfolios
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Acting Portfolio",
  "description": "My professional acting portfolio",
  "template": "actor-default",
  "visibility": "public",
  "mediaIds": ["uuid1", "uuid2"],
  "customization": {
    "theme": "dark",
    "primaryColor": "#6366f1"
  }
}
```

**Response**:
```json
{
  "id": "uuid",
  "name": "Acting Portfolio",
  "slug": "john-doe-acting",
  "url": "https://starbook.app/p/john-doe-acting",
  "embedCode": "<iframe src='...'></iframe>",
  "visibility": "public",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### List Portfolios
```http
GET /portfolios
Authorization: Bearer {token}
```

### Get Portfolio
```http
GET /portfolios/{portfolioId}
Authorization: Bearer {token}
```

### Update Portfolio
```http
PATCH /portfolios/{portfolioId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Portfolio Name",
  "visibility": "private"
}
```

### Delete Portfolio
```http
DELETE /portfolios/{portfolioId}
Authorization: Bearer {token}
```

### Add Media to Portfolio
```http
POST /portfolios/{portfolioId}/media
Authorization: Bearer {token}
Content-Type: application/json

{
  "mediaIds": ["uuid1", "uuid2"],
  "order": [0, 1]
}
```

### Remove Media from Portfolio
```http
DELETE /portfolios/{portfolioId}/media/{mediaId}
Authorization: Bearer {token}
```

## Sharing & Collaboration

### Create Share Link
```http
POST /portfolios/{portfolioId}/share
Authorization: Bearer {token}
Content-Type: application/json

{
  "expiresIn": 86400,
  "password": "optional-password",
  "allowDownload": false
}
```

**Response**:
```json
{
  "shareUrl": "https://starbook.app/s/abc123xyz",
  "expiresAt": "2024-01-02T00:00:00Z",
  "accessCode": "abc123xyz"
}
```

### Get Share Link Details
```http
GET /share/{accessCode}
```

### Access Shared Portfolio
```http
GET /share/{accessCode}/portfolio
```

## User Profile

### Get Profile
```http
GET /users/me
Authorization: Bearer {token}
```

### Update Profile
```http
PATCH /users/me
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Jane Doe",
  "bio": "Professional actor",
  "website": "https://janedoe.com",
  "socialLinks": {
    "instagram": "janedoe",
    "imdb": "nm1234567"
  }
}
```

## Analytics

### Get Portfolio Analytics
```http
GET /portfolios/{portfolioId}/analytics?period=7d
Authorization: Bearer {token}
```

**Response**:
```json
{
  "views": 150,
  "uniqueVisitors": 75,
  "averageTimeOnPage": 45,
  "topMedia": [
    {
      "mediaId": "uuid",
      "views": 50
    }
  ],
  "geographicDistribution": {
    "US": 60,
    "UK": 20,
    "CA": 15
  }
}
```

## Error Responses

All errors follow this format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### Error Codes

- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `429` - Too Many Requests
- `500` - Internal Server Error

## Rate Limiting

- **Authenticated requests**: 1000 requests/hour
- **Unauthenticated requests**: 100 requests/hour

Rate limit headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Webhooks (Future)

Subscribe to events:
- `media.uploaded`
- `portfolio.created`
- `portfolio.shared`
- `share.viewed`

## SDKs (Future)

- JavaScript/TypeScript
- Python
- Ruby
- PHP

## Versioning

The API uses URL versioning (`/v1/`). Breaking changes will increment the major version.

## Support

- API Status: https://status.starbook.app
- Documentation: https://docs.starbook.app
- Support: support@starbook.app
