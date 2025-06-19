# 🚀 Quick Start: Deploy to Vercel

## Prerequisites

- [Vercel Account](https://vercel.com/signup)
- [Vercel CLI](https://vercel.com/docs/cli) (`npm i -g vercel`)

## 🎯 One-Click Deployment

### Option 1: Automated Script (Recommended)

```bash
# Windows
deploy.bat

# Linux/Mac
chmod +x deploy.sh
./deploy.sh
```

### Option 2: Manual Steps

```bash
# 1. Login to Vercel
vercel login

# 2. Deploy
vercel

# 3. Follow the prompts
```

### Option 3: Git Integration

1. Push your code to GitHub/GitLab
2. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your repository
5. Deploy automatically

## 📋 What's Been Configured

✅ **vercel.json** - Serverless function configuration (TypeScript build)  
✅ **package.json** - Dependencies and scripts  
✅ **.vercelignore** - Excluded files from deployment  
✅ **TypeScript support** - Vercel builds TypeScript directly  
✅ **Environment handling** - Production-ready config

## 🌐 Your API Endpoints

After deployment, your API will be live at:

- **Health Check**: `https://your-project.vercel.app/`
- **Student Data**: `https://your-project.vercel.app/student/data`

## ⚙️ Environment Variables

Set these in Vercel dashboard:

```
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.com
LOG_LEVEL=info
REQUEST_TIMEOUT=30000
```

## 🔧 Troubleshooting

**Build fails?**

- Vercel builds TypeScript automatically
- Check your `tsconfig.json` configuration
- Ensure all dependencies are in `package.json`

**Function timeout?**

- Set function timeout in Vercel dashboard
- Optimize your scraping logic

**CORS issues?**

- Update CORS_ORIGIN in Vercel environment variables

## 📚 Full Documentation

See `DEPLOYMENT.md` for complete deployment guide with troubleshooting, monitoring, and optimization tips.

## 🎉 Success!

Your Express.js TypeScript API is now deployed as serverless functions on Vercel with:

- ⚡ Automatic scaling
- 🌍 Global CDN
- 🔒 SSL certificates
- 📊 Built-in analytics
- 🔄 Continuous deployment
- 🔧 Automatic TypeScript compilation
