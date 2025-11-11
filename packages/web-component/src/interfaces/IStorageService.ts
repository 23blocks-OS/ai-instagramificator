/**
 * Options for file upload
 */
export interface UploadOptions {
  /** Folder/path in storage */
  folder?: string;
  /** Whether the file should be publicly accessible */
  isPublic?: boolean;
  /** Additional metadata to store with the file */
  metadata?: Record<string, string>;
  /** Progress callback */
  onProgress?: (progress: number) => void;
}

/**
 * Result of a file upload
 */
export interface UploadResult {
  /** Public URL of the uploaded file */
  url: string;
  /** Storage key/path */
  key: string;
  /** Thumbnail URL (for images/videos) */
  thumbnailUrl?: string;
  /** File metadata */
  metadata?: Record<string, any>;
}

/**
 * Signed URL for direct upload
 */
export interface SignedUrlResult {
  /** URL to upload the file to */
  uploadUrl: string;
  /** Final URL of the file after upload */
  fileUrl: string;
  /** Expiration time in seconds */
  expiresIn: number;
}

/**
 * Interface for file storage operations
 * Implement this interface to provide custom storage backend
 */
export interface IStorageService {
  /**
   * Upload a file to storage
   * @param file - The file to upload
   * @param options - Upload options
   * @returns Promise with the upload result
   */
  uploadFile(file: File, options?: UploadOptions): Promise<UploadResult>;

  /**
   * Delete a file from storage
   * @param fileUrl - URL or key of the file to delete
   */
  deleteFile(fileUrl: string): Promise<void>;

  /**
   * Get a pre-signed URL for direct upload
   * Useful for large files to avoid going through your server
   * @param fileName - Name of the file
   * @param contentType - MIME type of the file
   * @returns Promise with signed URL information
   */
  getSignedUrl(fileName: string, contentType: string): Promise<SignedUrlResult>;

  /**
   * Optional: Get file metadata
   * @param fileUrl - URL or key of the file
   */
  getFileMetadata?(fileUrl: string): Promise<Record<string, any>>;
}
