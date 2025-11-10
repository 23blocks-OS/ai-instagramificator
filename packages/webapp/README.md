# StarBook WebApp

The main portfolio management application where users upload, edit, and organize their content.

## Features

- **Media Upload**: Drag & drop or click to upload photos and videos
- **Media Library**: Grid view of all uploaded content
- **Image Editing**: Crop, rotate, filters (using react-image-crop & fabric.js)
- **Video Editing**: Trim and basic video editing
- **Portfolio Builder**: Create professional portfolios from your media
- **Tagging & Organization**: Tag and categorize your content
- **Sharing**: Generate shareable links and embeddable widgets

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Zustand (State Management)
- React Dropzone (File Upload)
- React Image Crop (Image Editing)
- Fabric.js (Canvas Manipulation)
- Tailwind CSS
- Lucide Icons

## Development

```bash
npm run dev
```

Opens at http://localhost:3001

## Build

```bash
npm run build
npm run start
```

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # React components
├── lib/             # Utility functions
└── store/           # Zustand stores
```

## Future Enhancements

- [ ] Advanced image filters
- [ ] Video trimming and editing
- [ ] Portfolio templates
- [ ] Export to PDF
- [ ] Collaboration features
- [ ] Analytics dashboard
