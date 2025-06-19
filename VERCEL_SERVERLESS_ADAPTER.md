# 🚀 Vercel Serverless Adapter for Express.js

## What is the Vercel Serverless Adapter?

The Vercel Serverless Adapter is the **recommended approach** for deploying Express.js applications to Vercel. It allows you to run your full Express.js application as serverless functions while maintaining all Express.js features and middleware.

## 🏗️ Architecture

```
├── api/
│   └── index.ts          # Vercel serverless entry point
├── src/
│   └── index.ts          # Express.js app (exported)
├── vercel.json           # Vercel configuration
└── package.json          # Dependencies
```

## 🔧 How It Works

### 1. Express.js App (`src/index.ts`)

```typescript
import express from "express";

const app = express();

// All your middleware, routes, and logic
app.use(cors());
app.use(helmet());
app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

// Export for serverless
export default app;
```

### 2. Vercel Adapter (`api/index.ts`)

```typescript
import app from "../src/index";

// Export the Express app as the default handler
export default app;
```

### 3. Vercel Configuration (`vercel.json`)

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/api/index.ts"
    }
  ]
}
```

## ✅ Benefits

### Full Express.js Compatibility

- ✅ All Express.js features work seamlessly
- ✅ Middleware support (CORS, Helmet, Morgan, etc.)
- ✅ Route handling with parameters
- ✅ Error handling and custom error middleware
- ✅ Request/Response objects work as expected
- ✅ Static file serving
- ✅ Template engines

### TypeScript Support

- ✅ Full TypeScript compilation
- ✅ Type checking and IntelliSense
- ✅ Path aliases work correctly
- ✅ Import/export syntax

### Serverless Benefits

- ✅ Automatic scaling
- ✅ Global CDN
- ✅ SSL certificates
- ✅ Built-in analytics
- ✅ Continuous deployment

## 🚀 Deployment Process

### 1. Local Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Test production build
npm start
```

### 2. Deploy to Vercel

```bash
# Using CLI
vercel

# Or using automated script
deploy.bat  # Windows
./deploy.sh # Linux/Mac
```

### 3. Git Integration

- Push to GitHub/GitLab
- Import in Vercel dashboard
- Automatic deployments on push

## 🔍 How Vercel Handles Requests

1. **Request comes in** → `https://your-app.vercel.app/api/student/data`
2. **Vercel routes** → `/api/index.ts` (based on `vercel.json`)
3. **Serverless function** → `api/index.ts` executes
4. **Express app** → `src/index.ts` handles the request
5. **Response** → Returns to client

## ⚙️ Configuration Details

### Environment Variables

Set in Vercel dashboard:

```
NODE_ENV=production
CORS_ORIGIN=https://your-frontend.com
LOG_LEVEL=info
REQUEST_TIMEOUT=30000
```

### Function Settings

- **Timeout**: Set in Vercel dashboard (default: 10s)
- **Memory**: 1024MB (default)
- **Region**: Auto-selected for best performance

## 🔧 Troubleshooting

### Common Issues

**404 Errors**

- Ensure `api/index.ts` exists
- Check `vercel.json` routes configuration
- Verify the app is exported correctly

**Build Failures**

- Check TypeScript compilation: `npm run build`
- Ensure all dependencies are in `package.json`
- Verify `tsconfig.json` includes `api/` directory

**Function Timeout**

- Set longer timeout in Vercel dashboard
- Optimize your application logic
- Consider caching for expensive operations

**CORS Issues**

- Update `CORS_ORIGIN` in environment variables
- Use `*` for development, specific domain for production

### Debugging Commands

```bash
# View function logs
vercel logs

# Redeploy with debug info
vercel --debug

# Check function status
vercel ls

# Test locally
vercel dev
```

## 📊 Performance Considerations

### Cold Starts

- First request might be slower (1-2 seconds)
- Subsequent requests are fast
- Consider implementing health checks

### Memory Usage

- Default: 1024MB per function
- Monitor usage in Vercel dashboard
- Optimize if approaching limits

### Timeout Limits

- Default: 10 seconds
- Can be extended in dashboard
- Consider breaking long operations

## 🔒 Security

### Environment Variables

- Never commit sensitive data
- Use Vercel dashboard for secrets
- Different values for dev/prod

### CORS Configuration

- Configure properly for production
- Use specific origins, not `*`
- Consider rate limiting

### Input Validation

- Your Zod schemas provide validation
- Validate all user inputs
- Sanitize data before processing

## 📈 Monitoring

### Vercel Analytics

- Request volume
- Response times
- Error rates
- Function execution times

### Function Logs

- View in Vercel dashboard
- Real-time monitoring
- Error tracking

### Performance Metrics

- Cold start times
- Memory usage
- Timeout frequency

## 🎯 Best Practices

### Code Organization

- Keep Express.js app in `src/`
- Use `api/` only for Vercel adapter
- Maintain clean separation of concerns

### Error Handling

- Use Express.js error middleware
- Log errors appropriately
- Return consistent error responses

### Performance

- Implement caching where appropriate
- Optimize database queries
- Use connection pooling

### Security

- Validate all inputs
- Use HTTPS in production
- Implement rate limiting
- Keep dependencies updated

## 🚀 Ready to Deploy!

Your Express.js application is now configured with the Vercel Serverless Adapter and ready for deployment. This approach gives you the best of both worlds: full Express.js compatibility with serverless benefits.

### Next Steps

1. **Deploy**: Use `deploy.bat` or `vercel` command
2. **Configure**: Set environment variables in Vercel dashboard
3. **Monitor**: Use Vercel analytics and logs
4. **Optimize**: Based on performance metrics

### Support

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Express.js Docs**: [expressjs.com](https://expressjs.com)
- **TypeScript Docs**: [typescriptlang.org](https://typescriptlang.org)
