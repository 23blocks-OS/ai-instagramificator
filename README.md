# StarBook - Portfolio Platform for Aspiring Talent

A comprehensive digital portfolio management and showcase platform for actors, models, performers, and other aspiring talent to create professional portfolios and share with agencies and producers.

## Features

- 📸 **Media Library** - Upload and organize photos and videos
- ✂️ **Built-in Editor** - Crop, rotate, and apply filters to your content
- 📚 **Portfolio Builder** - Create professional portfolios with customizable templates
- 🔗 **Easy Sharing** - Share with agencies via links or embed in websites
- 🎨 **Professional Templates** - Pre-designed layouts for different talent types
- 🔒 **Privacy Controls** - Public, private, or password-protected portfolios

## Project Structure

This is a monorepo containing:

```
├── packages/
│   ├── website/          # Marketing website (Next.js)
│   ├── webapp/           # Portfolio management app (Next.js + TypeScript)
├── infrastructure/       # Terraform IaC for AWS
└── docs/                # Documentation
```

## Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- Terraform 1.5+ (for infrastructure)
- AWS CLI configured (for deployment)

### Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the website (marketing):**
   ```bash
   npm run dev:website
   ```
   Opens at http://localhost:3000

3. **Run the webapp (portfolio tool):**
   ```bash
   npm run dev:webapp
   ```
   Opens at http://localhost:3001

4. **Run both simultaneously:**
   ```bash
   npm run dev
   ```

### Build

```bash
npm run build
```

### Infrastructure

See [infrastructure/README.md](infrastructure/README.md) for deployment instructions.

## Tech Stack

### Website
- Next.js 14 (App Router)
- Tailwind CSS
- TypeScript

### Webapp
- Next.js 14 (App Router)
- TypeScript
- React Image/Video editing libraries
- Shadcn UI components
- Zustand (state management)

### Infrastructure
- Terraform
- AWS (S3, CloudFront, ECS, RDS)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## License

[Add your license here]
