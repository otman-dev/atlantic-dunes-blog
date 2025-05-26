export interface AuthState {
  isAuthenticated: boolean;
  user?: {
    id: string;
    username: string;
    role: string;
  };
}

export async function login(username: string, password: string): Promise<boolean> {
  try {
    console.log('Attempting login for username:', username);
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    console.log('Login response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Login response data:', data);
      return true;
    } else {
      const errorData = await response.json();
      console.log('Login error response:', errorData);
    }
    
    return false;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
}

export async function logout(): Promise<void> {
  try {
    console.log('Starting logout process...');
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
    });
    console.log('Logout response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Logout response data:', data);
    } else {
      console.error('Logout failed with status:', response.status);
    }
  } catch (error) {
    console.error('Logout error:', error);
  }
}

export async function isAuthenticated(): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/session');
    if (response.ok) {
      const data = await response.json();
      return data.isAuthenticated;
    }
    return false;
  } catch (error) {
    console.error('Auth check error:', error);
    return false;
  }
}

export async function getCurrentUser(): Promise<AuthState['user'] | null> {
  try {
    const response = await fetch('/api/auth/session');
    if (response.ok) {
      const data = await response.json();
      return data.isAuthenticated ? data.user : null;
    }
    return null;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}
