# RegiNova Backend - Production Deployment Guide

Complete guide for deploying RegiNova backend to Render.

## Overview

This guide covers deploying the FastAPI backend to Render.com with PostgreSQL database on Neon.

## Prerequisites

1. **GitHub Account** - For version control
2. **Render Account** - Free tier at https://render.com
3. **Neon Account** - PostgreSQL hosting at https://neon.tech
4. **Groq Account** - API key from https://console.groq.com

## Step 1: Prepare Code for Deployment

### 1.1 Create render.yaml

Create `backend/render.yaml`:

```yaml
services:
  - type: web
    name: reginova-backend
    env: python
    plan: free
    buildCommand: "pip install -r requirements.txt"
    startCommand: "uvicorn app.main:app --host 0.0.0.0 --port $PORT"
    envVars:
      - key: PYTHON_VERSION
        value: 3.9
      - key: DATABASE_URL
        fromDatabase:
          name: reginova-db
          property: connectionString
      - key: GROQ_API_KEY
        sync: false
      - key: JWT_SECRET_KEY
        sync: false
      - key: CORS_ORIGINS
        value: '["https://reginova.vercel.app"]'
      - key: DEBUG
        value: "False"

databases:
  - name: reginova-db
    ipAllowList: []
```

### 1.2 Push to GitHub

```bash
# Initialize git if not done
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial backend setup"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/yourusername/reginova.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 2: Set Up PostgreSQL Database on Neon

### 2.1 Create Neon Project

1. Visit https://neon.tech
2. Sign up with GitHub
3. Click "Create new project"
4. Configure:
   - Name: `reginova`
   - Region: Choose closest to users
   - Postgres Version: Latest (15+)

### 2.2 Get Connection String

1. In Neon dashboard, click your project
2. Click "Connection string" tab
3. Choose "Pooled connection" for reliability
4. Copy full connection string
5. It should look like:
   ```
   postgresql://username:password@host.neon.tech/reginova?sslmode=require
   ```

### 2.3 Create Database

```bash
# Using psql CLI
psql "postgresql://username:password@host.neon.tech/reginova?sslmode=require"

# Then run (optional - backend creates tables automatically)
CREATE DATABASE reginova;
```

## Step 3: Set Up Render Service

### 3.1 Connect GitHub

1. Visit https://render.com
2. Sign up with GitHub
3. Click "Create new" → "Web Service"
4. Select "Connect a repository"
5. Search for and select your `reginova` repository
6. Click "Connect"

### 3.2 Configure Service

**Basic Settings:**
- Name: `reginova-backend`
- Environment: Python 3
- Region: Choose closest to users
- Plan: Free (or paid for higher performance)

**Build & Start:**
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### 3.3 Set Environment Variables

In Render dashboard, go to "Environment":

```
DATABASE_URL = postgresql://user:pass@host.neon.tech/reginova?sslmode=require
GROQ_API_KEY = your_groq_api_key_here
JWT_SECRET_KEY = your_secret_key_here
CORS_ORIGINS = ["https://reginova.vercel.app"]
DEBUG = False
APP_NAME = RegiNova Backend
APP_VERSION = 1.0.0
```

### 3.4 Configure Build Settings

**Publish directory:** Leave empty (not static content)

**Build cache:** Enable (saves build time)

## Step 4: Deploy

### 4.1 Manual Deploy

1. Click "Create Web Service" (if not already done)
2. Render will automatically detect `render.yaml`
3. Service will build and deploy
4. Wait for status to show "Live"

### 4.2 View Logs

```bash
# In Render dashboard, click service → Logs
# Or use Render CLI:
render logs reginova-backend
```

### 4.3 Verify Deployment

Test the health endpoint:

```bash
curl https://reginova-backend.onrender.com/api/health
```

Response should be:
```json
{
  "status": "success",
  "message": "RegiNova backend is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Step 5: Configure Frontend

### 5.1 Update Frontend API URL

Edit `frontend/src/api/config.js`:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  'https://reginova-backend.onrender.com';
```

### 5.2 Deploy Frontend to Vercel

1. Visit https://vercel.com
2. Sign up with GitHub
3. Click "Import Project"
4. Select your repository
5. Configure:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output: `dist`
6. Deploy

### 5.3 Update Backend CORS

In Render dashboard, update environment variable:

```
CORS_ORIGINS = ["https://your-vercel-domain.vercel.app"]
```

## Step 6: Post-Deployment Verification

### 6.1 Test Authentication Flow

```bash
# Signup
curl -X POST https://reginova-backend.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!",
    "full_name": "Test User"
  }'

# Login
curl -X POST https://reginova-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!"
  }'
```

### 6.2 Test Document Upload

```bash
# After getting token from login
curl -X POST https://reginova-backend.onrender.com/api/documents/upload \
  -H "Authorization: Bearer TOKEN" \
  -F "file=@sample.pdf"
```

### 6.3 End-to-End Test

1. Open frontend URL
2. Sign up with test account
3. Upload a policy document
4. Perform Q&A search
5. Check search results

## Monitoring & Maintenance

### View Logs

```bash
# Render dashboard → Services → reginova-backend → Logs
# Or CLI:
render logs reginova-backend --follow
```

### Monitor Database

**Neon Console:**
- Check query logs
- Monitor storage usage
- View connection stats

### Analytics Dashboard

In Render:
- CPU usage
- Memory usage
- Request count
- Response times

### Common Issues & Solutions

**Issue: Database Connection Failed**
- Verify DATABASE_URL in environment
- Check IP allowlist in Neon (should be empty for Render)
- Test connection locally first

**Issue: 502 Bad Gateway**
- Check application logs
- Verify Groq API key is valid
- Check if application is running

**Issue: Slow Performance**
- Check database query logs
- Optimize vector search parameters
- Consider upgrading to paid plan

## Manual Restart

If service becomes unresponsive:

```bash
# In Render dashboard → Services → reginova-backend
# Click "Manual Deploy" or "Restart Service"
```

## Scaling Recommendations

### Current Setup
- Free plan suitable for low-to-medium traffic
- Supports ~100 concurrent users
- Automatic restart on failure

### For Production Traffic

1. **Upgrade Render Plan**
   - Standard tier for reliability
   - Auto-scaling for traffic spikes

2. **Database Optimization**
   - Upgrade Neon to paid plan
   - Add database indexes (done automatically)
   - Enable connection pooling

3. **Caching**
   - Add Redis for embedding cache
   - Cache frequently searched documents

4. **Load Balancing**
   - Deploy multiple instances
   - Use Render's load balancer

## Continuous Deployment

### Automatic Deploy on Push

By default, Render deploys automatically when you push to main branch:

```bash
# Just push changes
git add .
git commit -m "Fix: Update search algorithm"
git push origin main

# Render will automatically build and deploy
```

### Disable Auto-Deploy

In Render dashboard → Settings → Disable auto-deploy if needed

## Rollback

If deployment breaks:

1. In Render dashboard, click "Previous Deploys"
2. Find last working version
3. Click "Redeploy"
4. Confirm rollback

## Backup & Recovery

### Database Backup

Neon provides automatic backups:
- Kept for 7 days (free plan)
- Available in Neon dashboard

### Manual Backup

```bash
# Dump database
pg_dump "postgresql://user:pass@host.neon.tech/reginova" > backup.sql

# Restore database
psql "postgresql://user:pass@host.neon.tech/reginova" < backup.sql
```

## Security Checklist

- [x] JWT_SECRET_KEY is strong random string
- [x] GROQ_API_KEY is not in git (use environment variables)
- [x] DATABASE_URL uses SSL connection
- [x] CORS_ORIGINS restricted to frontend domain
- [x] DEBUG is False in production
- [x] Passwords hashed with bcrypt
- [x] Rate limiting enabled (recommended)

## Cleanup

### Remove Old Deployments

In Render dashboard:
- Click Settings
- Remove unused environments
- Delete old preview deployments

## Support

For issues:
- Check Render status: https://render-status.com
- Review logs in Render dashboard
- Test locally to isolate issues

## Additional Resources

- Render Docs: https://render.com/docs
- FastAPI Deployment: https://fastapi.tiangolo.com/deployment
- Neon Docs: https://neon.tech/docs
- PostgreSQL Docs: https://www.postgresql.org/docs

## Next Steps

1. Monitor production for 24 hours
2. Gather user feedback
3. Optimize based on performance metrics
4. Plan for scaling if needed
