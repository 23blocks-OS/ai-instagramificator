'use client';

import { FileUploader } from '@/components/FileUploader';
import { MediaGrid } from '@/components/MediaGrid';
import { ImageEditor } from '@/components/editor/ImageEditor';
import { VideoTrimmer } from '@/components/editor/VideoTrimmer';
import { useMediaStore } from '@/store/mediaStore';
import { Folder, LayoutGrid, Settings, User } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { currentFile, setCurrentFile, addEditedFile } = useMediaStore();

  const handleSaveEdit = async (editedUrl: string) => {
    if (!currentFile) return;

    // Convert the blob URL to a File object
    const response = await fetch(editedUrl);
    const blob = await response.blob();
    const fileName = `${currentFile.metadata.name.split('.')[0]}_edited.${blob.type.split('/')[1]}`;
    const file = new File([blob], fileName, { type: blob.type });

    // Create a new media file entry for the edited version
    const editedFile = {
      ...currentFile,
      id: crypto.randomUUID(),
      file,
      url: editedUrl,
      metadata: {
        ...currentFile.metadata,
        name: fileName,
        uploadedAt: new Date(),
      },
    };

    // Add the edited file to the store
    addEditedFile(editedFile);
    setCurrentFile(null);
  };

  const handleCancelEdit = () => {
    setCurrentFile(null);
  };

  // Show editor if a file is selected
  if (currentFile) {
    if (currentFile.type === 'image') {
      return (
        <ImageEditor
          media={currentFile}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      );
    } else if (currentFile.type === 'video') {
      return (
        <VideoTrimmer
          media={currentFile}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      );
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            StarBook
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Portfolio Manager</p>
        </div>

        <nav className="space-y-2">
          <NavItem icon={<LayoutGrid className="w-5 h-5" />} label="Library" active href="/" />
          <NavItem icon={<Folder className="w-5 h-5" />} label="Projects" href="/projects" />
          <NavItem icon={<User className="w-5 h-5" />} label="Portfolio" href="/portfolio" />
          <NavItem icon={<Settings className="w-5 h-5" />} label="Settings" href="/settings" />
        </nav>
      </aside>

      {/* Main content */}
      <main className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Media Library</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Upload and manage your photos and videos
            </p>
          </div>

          <div className="mb-8">
            <FileUploader />
          </div>

          <MediaGrid />
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false, href }: { icon: React.ReactNode; label: string; active?: boolean; href: string }) {
  return (
    <Link
      href={href}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        active
          ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
}
