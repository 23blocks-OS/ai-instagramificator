# Getting Started with StarBook

This guide will help you set up the StarBook development environment and deploy your first instance.

## Prerequisites

### Required
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Git**
- **AWS Account** (for deployment)
- **Terraform** >= 1.5.0 (for infrastructure)

### Recommended
- **Docker** (for containerization)
- **VS Code** with extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - Terraform

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/23blocks-OS/ai-instagramificator.git
cd ai-instagramificator
```

### 2. Install Dependencies

```bash
# Install all workspace dependencies
npm install
```

This will install dependencies for:
- Root workspace
- Website package
- Webapp package

### 3. Environment Variables

#### Website
Create `packages/website/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

#### WebApp
Create `packages/webapp/.env.local`:
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/starbook

# AWS (for local S3 testing)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
S3_MEDIA_BUCKET=starbook-media-dev

# NextAuth
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-secret-key

# Optional: OAuth providers
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

### 4. Run Development Servers

#### Option A: Run All Services
```bash
npm run dev
```

This starts:
- Website at http://localhost:3000
- Webapp at http://localhost:3001

#### Option B: Run Individual Services
```bash
# Terminal 1 - Website
npm run dev:website

# Terminal 2 - WebApp
npm run dev:webapp
```

### 5. Local Database (Optional)

If you want to run PostgreSQL locally:

```bash
# Using Docker
docker run --name starbook-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=starbook \
  -p 5432:5432 \
  -d postgres:15

# Or use Docker Compose (create docker-compose.yml)
docker-compose up -d
```

## Building for Production

### Build All Packages
```bash
npm run build
```

### Build Individual Packages
```bash
npm run build:website
npm run build:webapp
```

### Test Production Build Locally
```bash
# After building
npm run start:website  # Port 3000
npm run start:webapp   # Port 3001
```

## Infrastructure Deployment

### 1. Configure AWS Credentials

```bash
aws configure
```

Enter your:
- AWS Access Key ID
- AWS Secret Access Key
- Default region (e.g., us-east-1)
- Default output format (json)

### 2. Initialize Terraform

```bash
cd infrastructure
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values
terraform init
```

### 3. Plan Infrastructure

```bash
terraform plan
```

Review the resources that will be created.

### 4. Apply Infrastructure

```bash
terraform apply
```

Type `yes` to confirm. This will create:
- VPC and networking
- S3 buckets
- RDS database
- ECS cluster
- Load balancer
- CloudFront distribution

### 5. Note the Outputs

```bash
terraform output
```

Save these values:
- S3 bucket names
- Database endpoint
- ECR repository URL
- CloudFront domain

## Deploying the Application

### 1. Build Docker Image

```bash
cd packages/webapp

# Build
docker build -t starbook-webapp .

# Tag for ECR
docker tag starbook-webapp:latest <ecr-url>/starbook-app-dev:latest
```

### 2. Push to ECR

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin <ecr-url>

# Push
docker push <ecr-url>/starbook-app-dev:latest
```

### 3. Deploy to ECS

Create an ECS task definition and service (see infrastructure docs).

### 4. Deploy Static Website

```bash
cd packages/website
npm run build

# Upload to S3
aws s3 sync out/ s3://starbook-website-dev/

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id <distribution-id> \
  --paths "/*"
```

## Verifying the Deployment

### Check Website
Visit your CloudFront domain or custom domain to see the marketing site.

### Check WebApp
Visit the ALB DNS name or custom domain to access the application.

### Check Database
```bash
# Connect to RDS
psql -h <rds-endpoint> -U starbook_admin -d starbook
```

## Common Development Tasks

### Adding a New Package

```bash
cd packages
mkdir new-package
cd new-package
npm init -y
```

Update root `package.json` workspaces.

### Running Tests

```bash
npm run test
```

### Linting

```bash
npm run lint
```

### Type Checking

```bash
cd packages/webapp
npx tsc --noEmit
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3002 npm run dev:webapp
```

### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Terraform State Issues
```bash
# Refresh state
terraform refresh

# Import existing resource
terraform import aws_s3_bucket.media starbook-media-dev
```

### AWS Permission Errors
- Ensure your AWS user has necessary permissions
- Check IAM policies
- Verify AWS CLI configuration

## Next Steps

- [ ] Set up authentication (NextAuth.js)
- [ ] Add database migrations (Prisma)
- [ ] Configure CI/CD pipeline
- [ ] Set up monitoring and alerts
- [ ] Enable HTTPS with custom domain
- [ ] Add automated tests

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## Getting Help

- Check the [main README](../README.md)
- Review [Architecture docs](./ARCHITECTURE.md)
- Open an issue on GitHub
- Contact the team
