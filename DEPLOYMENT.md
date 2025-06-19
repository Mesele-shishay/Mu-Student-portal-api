# Deploying MU eStudent API to Vercel (Serverless Adapter)

This guide will walk you through deploying your Express.js TypeScript API to Vercel using the recommended serverless adapter approach.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI**: Install globally with `npm i -g vercel`
3. **Git Repository**: Your code should be in a Git repository (GitHub, GitLab, etc.)

## Architecture Overview

Your project now uses the Vercel Serverless Adapter pattern:

```
├── api/
│   └── index.ts          # Vercel serverless entry point
├── src/
│   └── index.ts          # Express.js app (exported)
├── vercel.json           # Vercel configuration
└── package.json          # Dependencies
```

## Step-by-Step Deployment

### 1. Prepare Your Project

Your project is already configured for Vercel deployment with:

- ✅ `api/index.ts` - Vercel serverless adapter
- ✅ `vercel.json` - Vercel configuration
- ✅ `package.json` - Dependencies and scripts
- ✅ `.vercelignore` - Excluded files
- ✅ TypeScript build process

### 2. Build Your Project Locally (Optional)

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Test the build locally
npm start
```

### 3. Deploy to Vercel

#### Option A: Using Vercel CLI (Recommended)

```bash
# Login to Vercel
vercel login

# Deploy from your project directory
vercel

# Follow the prompts:
# - Set up and deploy? → Yes
# - Which scope? → Select your account
# - Link to existing project? → No
# - What's your project name? → mu-estudent-api (or your preferred name)
# - In which directory is your code located? → ./ (current directory)
# - Want to override the settings? → No
```

#### Option B: Using Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository
4. Configure the project:
   - **Framework Preset**: Node.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 4. Environment Variables

Set up environment variables in Vercel dashboard:

1. Go to your project settings in Vercel
2. Navigate to "Environment Variables"
3. Add the following variables:
   ```
   NODE_ENV=production
   PORT=3000
   CORS_ORIGIN=https://your-frontend-domain.com
   LOG_LEVEL=info
   REQUEST_TIMEOUT=30000
   ```

### 5. Custom Domain (Optional)

1. In your Vercel project dashboard, go to "Domains"
2. Add your custom domain
3. Configure DNS settings as instructed

## API Endpoints

After deployment, your API will be available at:

- **Health Check**: `https://your-project.vercel.app/`
- **Student Data (POST)**: `https://your-project.vercel.app/student/data`
- **Student Data (GET)**: `https://your-project.vercel.app/student/data?username=xxx&password=xxx`

## Important Notes

### Serverless Adapter Benefits

The Vercel Serverless Adapter approach provides:

1. **Full Express.js Compatibility**: All Express.js features work seamlessly
2. **Middleware Support**: All your middleware (CORS, Helmet, Morgan) works
3. **Route Handling**: All your routes are preserved
4. **Error Handling**: Your error handlers work as expected
5. **TypeScript Support**: Full TypeScript compilation and type checking

### Serverless Limitations

Vercel runs your Express.js app as serverless functions, which means:

1. **Cold Starts**: First request might be slower
2. **Function Timeout**: Default 10s, can be extended in dashboard
3. **Memory Limits**: 1024MB by default
4. **Stateless**: No persistent file system or memory between requests

### Web Scraping Considerations

Since your API does web scraping:

1. **Rate Limiting**: Be mindful of the target website's rate limits
2. **User Agent**: Already configured in your app
3. **Timeout**: Set to 30 seconds for scraping operations
4. **Error Handling**: Your app has robust error handling

### Monitoring

1. **Vercel Analytics**: Available in your dashboard
2. **Function Logs**: View in Vercel dashboard
3. **Performance**: Monitor function execution times

## Troubleshooting

### Common Issues

1. **Build Failures**:

   ```bash
   # Check build locally
   npm run build
   ```

2. **Environment Variables**:

   - Ensure all required env vars are set in Vercel dashboard
   - Check variable names match your config

3. **CORS Issues**:

   - Update `CORS_ORIGIN` in Vercel environment variables
   - Use your frontend domain or `*` for development

4. **Function Timeout**:

   - Set function timeout in Vercel dashboard
   - Optimize your scraping logic

5. **404 Errors**:
   - Ensure `api/index.ts` exists and exports the app correctly
   - Check `vercel.json` routes configuration

### Debugging

```bash
# View function logs
vercel logs

# Redeploy with debug info
vercel --debug

# Check function status
vercel ls
```

## Continuous Deployment

Once deployed, Vercel will automatically redeploy when you push to your main branch.

### Development Workflow

1. Make changes locally
2. Test with `npm run dev`
3. Build and test: `npm run build && npm start`
4. Commit and push to Git
5. Vercel automatically deploys

## Performance Optimization

1. **Caching**: Consider implementing response caching
2. **Connection Pooling**: Your axios setup is already optimized
3. **Error Retry**: Implement retry logic for failed requests
4. **Monitoring**: Use Vercel's built-in monitoring tools

## Security

1. **Environment Variables**: Never commit sensitive data
2. **CORS**: Configure properly for production
3. **Rate Limiting**: Consider implementing rate limiting
4. **Input Validation**: Your Zod schemas provide good validation

## Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Vercel Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
- **Your Project**: Check the README.md for project-specific information
