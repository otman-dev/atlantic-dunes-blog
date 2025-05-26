// Simple utility to check environment configuration
export function checkEnvironment() {
  const checks = {
    hasSessionSecret: !!process.env.SESSION_SECRET,
    sessionSecretLength: process.env.SESSION_SECRET?.length || 0,
    nodeEnv: process.env.NODE_ENV,
    isProduction: process.env.NODE_ENV === 'production',
    vercelUrl: process.env.VERCEL_URL,
    isVercel: !!process.env.VERCEL_URL
  };
  
  console.log('Environment checks:', checks);
  
  if (!checks.hasSessionSecret) {
    console.error('❌ SESSION_SECRET is not set!');
  } else if (checks.sessionSecretLength < 32) {
    console.error('❌ SESSION_SECRET is too short! Minimum 32 characters required.');
  } else {
    console.log('✅ SESSION_SECRET is properly configured');
  }
  
  return checks;
}

export function logSessionConfig() {
  const config = {
    cookieName: 'atlantic-dunes-session',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    environment: process.env.NODE_ENV,
    isVercel: !!process.env.VERCEL_URL
  };
  
  console.log('Session configuration:', config);
  return config;
}
