/**
 * User information
 */
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt?: string;
  metadata?: Record<string, any>;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Registration data
 */
export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

/**
 * Interface for authentication operations (Optional)
 * Implement this interface if your host application manages authentication
 */
export interface IAuthService {
  /**
   * Get the currently logged-in user
   * @returns Promise with user data or null if not authenticated
   */
  getCurrentUser(): Promise<User | null>;

  /**
   * Check if user is authenticated
   * @returns Boolean indicating authentication status
   */
  isAuthenticated(): boolean;

  /**
   * Login with credentials
   * @param credentials - Login credentials
   * @returns Promise with user data
   */
  login(credentials: LoginCredentials): Promise<User>;

  /**
   * Register a new user
   * @param data - Registration data
   * @returns Promise with user data
   */
  register?(data: RegisterData): Promise<User>;

  /**
   * Logout the current user
   */
  logout(): Promise<void>;

  /**
   * Refresh authentication token
   */
  refreshToken?(): Promise<void>;

  /**
   * Get authentication token
   * @returns Current auth token or null
   */
  getToken?(): Promise<string | null>;
}
