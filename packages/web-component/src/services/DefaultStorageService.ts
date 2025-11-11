import { IStorageService, UploadOptions, UploadResult, SignedUrlResult } from '../interfaces';

/**
 * Default storage service using localStorage for demo/standalone mode
 * In production, this would be replaced with actual cloud storage
 */
export class DefaultStorageService implements IStorageService {
  private storageKey = 'starbook_files';

  async uploadFile(file: File, options?: UploadOptions): Promise<UploadResult> {
    // Create object URL for the file
    const url = URL.createObjectURL(file);

    // Generate a unique key
    const key = `${Date.now()}_${file.name}`;

    // Store file reference in localStorage
    const files = this.getStoredFiles();
    files.push({
      key,
      url,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
      metadata: options?.metadata || {},
    });
    localStorage.setItem(this.storageKey, JSON.stringify(files));

    // Simulate upload progress
    if (options?.onProgress) {
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 50));
        options.onProgress(i);
      }
    }

    return {
      url,
      key,
      thumbnailUrl: file.type.startsWith('image/') ? url : undefined,
      metadata: options?.metadata,
    };
  }

  async deleteFile(fileUrl: string): Promise<void> {
    const files = this.getStoredFiles();
    const filtered = files.filter(f => f.url !== fileUrl);
    localStorage.setItem(this.storageKey, JSON.stringify(filtered));

    // Revoke object URL
    URL.revokeObjectURL(fileUrl);
  }

  async getSignedUrl(fileName: string, contentType: string): Promise<SignedUrlResult> {
    // In standalone mode, we don't use signed URLs
    // Return a dummy response
    return {
      uploadUrl: '/upload',
      fileUrl: `/files/${fileName}`,
      expiresIn: 3600,
    };
  }

  async getFileMetadata(fileUrl: string): Promise<Record<string, any>> {
    const files = this.getStoredFiles();
    const file = files.find(f => f.url === fileUrl);
    return file?.metadata || {};
  }

  private getStoredFiles(): any[] {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }
}
