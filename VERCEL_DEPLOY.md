# Vercel Deployment Configuration

## Required Environment Variables

To deploy this application on Vercel, you need to set the following environment variables in your Vercel dashboard:

### 1. SESSION_SECRET
A secure random string for session encryption (minimum 32 characters):
```
SESSION_SECRET=1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h
```

### 2. NODE_ENV (usually set automatically by Vercel)
```
NODE_ENV=production
```

## Setting Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add the following variables:
   - `SESSION_SECRET`: Your secure session secret key
   - Make sure to set it for Production, Preview, and Development environments

## File System Notes

Since Vercel uses a read-only file system, the JSON data files in `/src/data/` will only work for reading in production. For a production deployment, consider using:

- A database (PostgreSQL, MongoDB, etc.)
- External storage service (AWS S3, etc.)
- Vercel KV for simple key-value storage

## Testing Locally

To test the production build locally:

```bash
npm run build
npm run start
```

This will simulate the production environment locally.

## Common Issues

1. **Session not persisting**: Ensure `SESSION_SECRET` is set in Vercel environment variables
2. **CORS issues**: The app uses relative URLs, so this shouldn't be an issue
3. **File system errors**: Data files are read-only in Vercel's serverless environment

## Demo Credentials

For testing authentication:
- Username: `admin`
- Password: `admin123`
