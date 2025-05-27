// Simple hardcoded authentication
export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin'
};

export interface AuthState {
  isAuthenticated: boolean;
  user?: {
    username: string;
  };
}

// In a real app, you'd use proper session management, JWT tokens, etc.
// For this demo, we'll use localStorage (client-side only)

export function login(username: string, password: string): boolean {
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('username', username);
    }
    return true;
  }
  return false;
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
  }
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') {
    return false; // Server-side, assume not authenticated
  }
  return localStorage.getItem('isAuthenticated') === 'true';
}

export function getCurrentUser(): { username: string } | null {
  if (typeof window === 'undefined') {
    return null;
  }
  
  const username = localStorage.getItem('username');
  const authenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (authenticated && username) {
    return { username };
  }
  
  return null;
}

export function requireAuth(): boolean {
  return isAuthenticated();
}
