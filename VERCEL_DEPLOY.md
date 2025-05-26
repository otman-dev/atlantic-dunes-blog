# Vercel Deployment Guide for Atlantic Dunes Blog

## Environment Variables Setup

### Required Environment Variables
1. In your Vercel project dashboard, go to **Settings > Environment Variables**
2. Add the following variables:

```
SESSION_SECRET=your_super_secure_32_character_minimum_secret_here_for_production_use
```

**Important**: Generate a secure 32+ character string for SESSION_SECRET. You can use:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Authentication Configuration

The app uses these credentials by default:
- **Username**: `admin`
- **Password**: `admin123`

### Deployment Steps

1. **Push to GitHub/Git repository**
2. **Import project to Vercel**
3. **Set environment variables** (see above)
4. **Deploy**

### Troubleshooting Login Issues

If login fails on Vercel but works locally:

1. **Check Environment Variables**:
   - Verify `SESSION_SECRET` is set in Vercel dashboard
   - Ensure it's at least 32 characters long

2. **Check Logs**:
   - Go to Vercel project > Functions tab
   - Check logs for authentication API routes
   - Look for environment check messages

3. **Test Authentication**:
   - The app now includes fallback authentication that doesn't rely on file system
   - Check browser console for detailed login attempt logs
   - Verify network requests in browser dev tools

4. **Common Issues**:
   - **Cookie not set**: Vercel enforces HTTPS, cookies are now configured for secure environments
   - **Session not persisting**: Check if SESSION_SECRET is properly configured
   - **File system access**: App now uses fallback users when file system is unavailable

### Manual Testing

You can test the authentication manually by:

1. Open browser dev tools > Network tab
2. Try to login with `admin` / `admin123`
3. Check the POST request to `/api/auth/login`
4. Verify the response includes success and user data
5. Check if session cookie is set in Application tab

### Environment Validation

The app automatically checks environment configuration and logs the results. Check Vercel function logs to see:
- ✅ SESSION_SECRET is properly configured
- ❌ SESSION_SECRET is not set or too short
- Environment details (NODE_ENV, VERCEL_URL, etc.)

### Fallback Authentication

The latest version includes fallback authentication that works even if the file system is not accessible:
- Users are embedded in the code as a fallback
- File system is tried first, fallback is used if it fails
- Extensive logging helps identify which method is being used

### Security Notes

- SESSION_SECRET should be unique per environment
- Never commit SESSION_SECRET to version control
- Use different secrets for staging and production
- The fallback users are for development/demo purposes only
