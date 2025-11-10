# Contributing to StarBook

Thank you for your interest in contributing to StarBook! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect differing opinions and experiences

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/ai-instagramificator.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes
6. Commit and push
7. Create a Pull Request

## Development Setup

See [docs/GETTING_STARTED.md](docs/GETTING_STARTED.md) for detailed setup instructions.

```bash
npm install
npm run dev
```

## Project Structure

```
ai-instagramificator/
├── packages/
│   ├── website/      # Marketing site
│   └── webapp/       # Main application
├── infrastructure/   # Terraform IaC
└── docs/            # Documentation
```

## Coding Standards

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for formatting
- Write meaningful variable and function names
- Add JSDoc comments for public APIs

**Example**:
```typescript
/**
 * Uploads a media file to S3 with validation
 * @param file - The file to upload
 * @param options - Upload options
 * @returns Promise with upload result
 */
async function uploadMedia(
  file: File,
  options: UploadOptions
): Promise<UploadResult> {
  // Implementation
}
```

### React Components

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use TypeScript for props

**Example**:
```tsx
interface MediaCardProps {
  media: MediaFile;
  onDelete?: (id: string) => void;
}

export function MediaCard({ media, onDelete }: MediaCardProps) {
  // Component implementation
}
```

### CSS/Styling

- Use Tailwind CSS utility classes
- Follow mobile-first approach
- Use semantic color names from theme
- Avoid inline styles

```tsx
<div className="flex flex-col gap-4 p-6 rounded-lg bg-white dark:bg-gray-800">
  {/* Content */}
</div>
```

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

**Examples**:
```
feat: add image crop functionality to editor
fix: resolve upload progress bar not updating
docs: update API documentation for media endpoints
refactor: extract media upload logic into hook
```

## Pull Request Process

1. **Update documentation** if you're changing functionality
2. **Add tests** for new features
3. **Ensure all tests pass**: `npm run test`
4. **Ensure linting passes**: `npm run lint`
5. **Update the README** if needed
6. **Keep PRs focused** - one feature/fix per PR
7. **Write a clear PR description**:
   - What changes were made?
   - Why were they necessary?
   - How can they be tested?

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How has this been tested?

## Checklist
- [ ] Code follows project style guidelines
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] All tests passing
```

## Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests (when available)
```bash
npm run test:e2e
```

### Manual Testing Checklist
- [ ] Test on Chrome, Firefox, Safari
- [ ] Test responsive design (mobile, tablet, desktop)
- [ ] Test dark mode
- [ ] Test with slow network
- [ ] Test error states

## Adding New Features

1. **Discuss first** - Open an issue to discuss major changes
2. **Plan the architecture** - Consider impact on existing code
3. **Write tests first** (TDD) when appropriate
4. **Implement incrementally** - Small, reviewable changes
5. **Document as you go** - Update relevant docs
6. **Get feedback early** - Draft PRs are welcome

## Bug Reports

Use the issue template and include:

- **Description** - Clear description of the bug
- **Steps to reproduce**
- **Expected behavior**
- **Actual behavior**
- **Screenshots** (if applicable)
- **Environment**:
  - OS
  - Browser
  - Node version
  - Package versions

## Feature Requests

- Check if it already exists in issues
- Explain the use case
- Describe the proposed solution
- Consider alternatives
- Be open to discussion

## Infrastructure Changes

For Terraform changes:

1. Test in a separate environment first
2. Run `terraform plan` and include output in PR
3. Document any new variables or outputs
4. Consider cost implications
5. Update infrastructure README

## Documentation

- Keep docs up-to-date with code changes
- Use clear, simple language
- Include code examples
- Add diagrams for complex concepts
- Check for spelling and grammar

## Review Process

1. **Initial review** - Maintainer checks PR basics
2. **Technical review** - Code quality, architecture
3. **Testing** - Verify functionality works
4. **Approval** - At least one maintainer approval needed
5. **Merge** - Squash and merge preferred

## Getting Help

- **Questions?** Open a discussion
- **Stuck?** Tag a maintainer
- **Need review?** Request review from maintainers

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in the project README

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

## Thank You!

Your contributions make StarBook better for everyone. We appreciate your time and effort!
