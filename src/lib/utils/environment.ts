// Environment utility functions for the blog application

export function getEnvironment(): 'development' | 'production' | 'test' {
  return (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development';
}

export function isDevelopment(): boolean {
  return getEnvironment() === 'development';
}

export function isProduction(): boolean {
  return getEnvironment() === 'production';
}

export function isTest(): boolean {
  return getEnvironment() === 'test';
}

export function getMongodbUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not set');
  }
  return uri;
}

export function getDatabaseName(): string {
  return process.env.DATABASE_NAME || 'atlantic-dunes-blog';
}

export function getSessionSecret(): string {
  return process.env.SESSION_SECRET || 'complex_password_at_least_32_characters_long_super_secret';
}
