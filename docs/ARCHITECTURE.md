# StarBook Architecture

## Overview

StarBook is a cloud-native portfolio management platform built as a monorepo with separate packages for the marketing website, web application, and infrastructure.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CloudFront CDN                        │
│                    (Global Content Delivery)                 │
└────────────────┬─────────────────────┬──────────────────────┘
                 │                     │
        ┌────────▼────────┐   ┌───────▼────────┐
        │  Static Website │   │  Media Assets  │
        │   (S3 Bucket)   │   │   (S3 Bucket)  │
        └─────────────────┘   └────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   Application Load Balancer                  │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────▼─────────────────┐
        │          ECS Cluster             │
        │  ┌────────────────────────────┐  │
        │  │   WebApp Containers        │  │
        │  │   (Next.js App)            │  │
        │  └────────────────────────────┘  │
        └────────────┬─────────────────────┘
                     │
        ┌────────────▼─────────────────┐
        │     RDS PostgreSQL           │
        │  (User data, portfolios)     │
        └──────────────────────────────┘
```

## Components

### 1. Website (Marketing Site)
- **Technology**: Next.js 14 (Static Export)
- **Purpose**: Marketing, landing pages, documentation
- **Hosting**: S3 + CloudFront
- **Features**:
  - SEO optimized
  - Fast loading times
  - Responsive design
  - Lead capture

### 2. WebApp (Portfolio Management Tool)
- **Technology**: Next.js 14 (SSR/SSG)
- **Purpose**: User interface for portfolio creation
- **Hosting**: ECS Fargate containers
- **Features**:
  - File upload/management
  - Image/video editing
  - Portfolio builder
  - User authentication
  - Real-time collaboration

### 3. Infrastructure (AWS)
- **Technology**: Terraform
- **Purpose**: Infrastructure as Code
- **Resources**:
  - VPC with public/private subnets
  - S3 for storage
  - CloudFront for CDN
  - ECS for containers
  - RDS for database
  - ALB for load balancing

## Data Flow

### Upload Flow
```
User → WebApp → Pre-signed S3 URL → Direct S3 Upload → CloudFront Invalidation
                     ↓
              Database Record (metadata)
```

### Portfolio View Flow
```
Public URL → CloudFront → S3 (static portfolio) → Browser
                ↓
         Database (fetch metadata)
```

## Technology Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Image Processing**: react-image-crop, fabric.js
- **File Upload**: react-dropzone
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js (Next.js API Routes)
- **Database**: PostgreSQL (RDS)
- **ORM**: Prisma (to be added)
- **Authentication**: NextAuth.js (to be added)
- **File Storage**: AWS S3
- **CDN**: CloudFront

### Infrastructure
- **Cloud Provider**: AWS
- **IaC**: Terraform
- **Container Registry**: ECR
- **Orchestration**: ECS Fargate
- **Load Balancing**: Application Load Balancer
- **Secrets**: AWS Secrets Manager

## Security

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (RBAC)
- OAuth providers (Google, GitHub)

### Data Security
- S3 bucket encryption at rest
- RDS encryption at rest
- TLS/SSL in transit
- Private subnets for sensitive resources
- Security groups for network isolation

### Media Security
- Pre-signed URLs for uploads
- Content validation
- Virus scanning (to be added)
- Watermarking options

## Scalability

### Horizontal Scaling
- ECS Auto Scaling based on CPU/Memory
- ALB distributes traffic
- Multi-AZ RDS for high availability

### Vertical Scaling
- Configurable instance sizes
- Database instance upgrades
- Storage auto-scaling

### Performance Optimization
- CloudFront edge caching
- Image optimization (WebP, responsive images)
- Database query optimization
- Connection pooling

## Monitoring & Observability

### Metrics
- CloudWatch metrics for all AWS resources
- Custom application metrics
- User analytics

### Logging
- CloudWatch Logs for application logs
- VPC Flow Logs for network traffic
- ALB access logs
- CloudTrail for audit logs

### Alerting
- CloudWatch Alarms
- SNS notifications
- PagerDuty integration (production)

## Disaster Recovery

### Backup Strategy
- RDS automated backups (7-day retention)
- S3 versioning enabled
- Cross-region replication (production)
- Database snapshots

### Recovery Procedures
- Point-in-time recovery for RDS
- S3 object restoration
- Infrastructure recreation via Terraform

## Development Workflow

```
Developer → Git Push → GitHub Actions → Build & Test → Deploy
                                              ↓
                                    Docker Build → ECR
                                              ↓
                                    ECS Task Update
```

## Future Enhancements

- [ ] Multi-region deployment
- [ ] Real-time collaboration with WebSockets
- [ ] AI-powered content recommendations
- [ ] Mobile apps (React Native)
- [ ] Advanced analytics dashboard
- [ ] Video transcoding pipeline
- [ ] CDN optimization with Lambda@Edge
- [ ] GraphQL API
