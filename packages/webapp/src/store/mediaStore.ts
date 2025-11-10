import { create } from 'zustand';

export interface MediaFile {
  id: string;
  file: File;
  url: string;
  type: 'image' | 'video';
  thumbnail?: string;
  metadata: {
    name: string;
    size: number;
    uploadedAt: Date;
    tags: string[];
    category?: string;
  };
}

interface MediaStore {
  files: MediaFile[];
  selectedFiles: string[];
  currentFile: MediaFile | null;

  // Actions
  addFiles: (files: File[]) => void;
  addEditedFile: (mediaFile: MediaFile) => void;
  removeFile: (id: string) => void;
  selectFile: (id: string) => void;
  deselectFile: (id: string) => void;
  setCurrentFile: (file: MediaFile | null) => void;
  updateFileTags: (id: string, tags: string[]) => void;
  updateFileCategory: (id: string, category: string) => void;
}

export const useMediaStore = create<MediaStore>((set) => ({
  files: [],
  selectedFiles: [],
  currentFile: null,

  addFiles: (files: File[]) => {
    const newFiles: MediaFile[] = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      url: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : 'video',
      metadata: {
        name: file.name,
        size: file.size,
        uploadedAt: new Date(),
        tags: [],
      },
    }));

    set((state) => ({
      files: [...state.files, ...newFiles],
    }));
  },

  addEditedFile: (mediaFile: MediaFile) => {
    set((state) => ({
      files: [...state.files, mediaFile],
    }));
  },

  removeFile: (id: string) => {
    set((state) => {
      const file = state.files.find((f) => f.id === id);
      if (file) {
        URL.revokeObjectURL(file.url);
      }
      return {
        files: state.files.filter((f) => f.id !== id),
        selectedFiles: state.selectedFiles.filter((fId) => fId !== id),
      };
    });
  },

  selectFile: (id: string) => {
    set((state) => ({
      selectedFiles: [...state.selectedFiles, id],
    }));
  },

  deselectFile: (id: string) => {
    set((state) => ({
      selectedFiles: state.selectedFiles.filter((fId) => fId !== id),
    }));
  },

  setCurrentFile: (file: MediaFile | null) => {
    set({ currentFile: file });
  },

  updateFileTags: (id: string, tags: string[]) => {
    set((state) => ({
      files: state.files.map((f) =>
        f.id === id
          ? { ...f, metadata: { ...f.metadata, tags } }
          : f
      ),
    }));
  },

  updateFileCategory: (id: string, category: string) => {
    set((state) => ({
      files: state.files.map((f) =>
        f.id === id
          ? { ...f, metadata: { ...f.metadata, category } }
          : f
      ),
    }));
  },
}));
