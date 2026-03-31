# RegiNova Production Deployment Guide

## Overview
This guide covers deploying RegiNova to production with full security, monitoring, and backup configurations.

---

## Phase 1: Pre-Deployment Checklist

### 1.1 Environment Configuration
- [ ] Generate new JWT_SECRET: `python -c "import secrets; print(secrets.token_urlsafe(32))"`
- [ ] Create `.env.production` file with:
  - Production database URL (Neon PostgreSQL)
  - Generated JWT_SECRET
  - Groq API key
  - Production domain CORS origins
- [ ] Set `DEBUG=False` and `ENVIRONMENT=production`
- [ ] Update CORS_ORIGINS with your production domain

### 1.2 Database Preparation
- [ ] Verify Neon PostgreSQL connection
- [ ] Run schema migrations: `python reset_db.py`
- [ ] Enable automated backups (Neon: Settings > Backups)
- [ ] Test backup restoration procedure

### 1.3 Security Hardening
- [ ] Rotate all API keys (Groq, database credentials)
- [ ] Enable HTTPS on production domain
- [ ] Generate and install SSL certificates
- [ ] Configure security headers (HSTS, CSP, X-Frame-Options)

---

## Phase 2: Backend Deployment (Render.com Example)

### 2.1 Prepare Repository
```bash
# Create .gitignore entries
echo ".env" >> .gitignore
echo ".env.production" >> .gitignore
echo "__pycache__/" >> .gitignore
echo "*.db" >> .gitignore
echo "faiss_indexes/" >> .gitignore
echo "vault/" >> .gitignore
echo "logs/" >> .gitignore

# Commit changes
git add .
git commit -m "Production deployment preparation"
git push
```

### 2.2 Create Render Deployment
1. Go to https://render.com
2. Connect GitHub repository
3. Create New > Web Service
4. Configure:
   - **Name:** reginova-backend
   - **Environment:** Python 3.11
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port 8000`

### 2.3 Set Environment Variables in Render
```
DATABASE_URL=postgresql+psycopg2://...
JWT_SECRET=<your-generated-secret>
GROQ_API_KEY=<your-groq-key>
ENVIRONMENT=production
DEBUG=False
CORS_ORIGINS=["https://yourdomain.com"]
```

### 2.4 Deploy
- Push to `main` branch
- Render will auto-deploy
- Monitor deployment logs

---

## Phase 3: Frontend Deployment (Vercel Example)

### 3.1 Update API Configuration
Edit `frontend/src/api/config.js`:
```javascript
const BASE_URL = 'https://reginova-backend.render.com';
// or your production backend URL
```

### 3.2 Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from frontend directory
cd frontend
vercel --prod
```

### 3.3 Configure Custom Domain
1. In Vercel dashboard: Settings > Domains
2. Add your custom domain
3. Update DNS records per Vercel instructions

---

## Phase 4: SSL/HTTPS Configuration

### 4.1 Enable HTTPS
Render and Vercel provide free SSL certificates automatically.

### 4.2 Security Headers
Already configured in `app/main.py` SecurityHeadersMiddleware:
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security: max-age=31536000
- Content-Security-Policy: default-src 'self'

---

## Phase 5: Monitoring & Logging

### 5.1 Application Logs
Location: `./logs/`
- `reginova.log` - All application logs
- `error.log` - Error logs only
- `audit.log` - User actions and security events

### 5.2 Monitor Logs
```bash
# View live logs
tail -f logs/reginova.log

# Search for errors
grep "ERROR" logs/error.log

# View audit trail
tail -f logs/audit.log
```

### 5.3 Set Up External Monitoring
**Option A: Sentry (Error Tracking)**
```bash
pip install sentry-sdk
# Configure in app/main.py
```

**Option B: Datadog (Full Monitoring)**
```bash
pip install datadog
# Configure environment variables
```

---

## Phase 6: Database Backups

### 6.1 Neon Automatic Backups
1. Login to Neon console: https://console.neon.tech
2. Project > Branches > Backups
3. Enable automated backups (daily/weekly)
4. Retention: 7-30 days recommended

### 6.2 Manual Backup
```bash
# Export database
PGPASSWORD=$DB_PASSWORD pg_dump \
  -h $DB_HOST \
  -U $DB_USER \
  -d reginova_prod \
  > backup_$(date +%Y%m%d_%H%M%S).sql

# Store in safe location (AWS S3, Google Cloud Storage, etc.)
```

### 6.3 Backup Restoration
```bash
# Restore from backup
PGPASSWORD=$DB_PASSWORD psql \
  -h $DB_HOST \
  -U $DB_USER \
  -d reginova_prod \
  < backup_file.sql
```

---

## Phase 7: Rate Limiting & DDoS Protection

### 7.1 Enable Rate Limiting
Already configured in `.env.production`:
```
RATE_LIMIT_ENABLED=True
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW_SECONDS=60
```
This allows 100 requests per 60 seconds per IP.

### 7.2 Cloudflare DDoS Protection
1. Update DNS to Cloudflare nameservers
2. Enable DDoS protection (free tier includes basic)
3. Set Security Level > High
4. Enable Web Application Firewall (WAF)

---

## Phase 8: API Key Rotation

### 8.1 Groq API Key Rotation
1. Visit https://console.groq.com
2. Generate new API key
3. Update in production environment:
   ```
   GROQ_API_KEY=<new-key>
   ```
4. Redeploy backend
5. Delete old key from Groq console

### 8.2 JWT Secret Rotation
1. Generate new secret: `python -c "import secrets; print(secrets.token_urlsafe(32))"`
2. Update JWT_SECRET in production
3. All existing tokens become invalid (users must re-login)

---

## Phase 9: Performance Optimization

### 9.1 Database Connection Pooling
Update DATABASE_URL:
```
postgresql+psycopg2://user:pass@host/db?connect_timeout=10
```

### 9.2 FAISS Vector Store Optimization
- Store FAISS indexes on persistent storage
- Use shared volume for multi-instance deployments
- Regular index maintenance: `vector_store.optimize_index()`

### 9.3 Caching
Add Redis for session management:
```bash
pip install redis
# Configure in config.py
```

---

## Phase 10: Monitoring & Health Checks

### 10.1 Health Check Endpoint
```
GET /api/health
```
Returns: `{"status": "success", "timestamp": "..."}`

### 10.2 Configure Health Checks (Render)
1. In Render dashboard: Settings > Health Checks
2. Endpoint: `/api/health`
3. Check interval: 5 minutes

### 10.3 Uptime Monitoring
Use service like:
- UptimeRobot (free)
- Pingdom
- Datadog

Configure to check: `https://your-domain/api/health`

---

## Post-Deployment Verification

### Checklist
- [ ] Backend is running at https://your-backend-domain
- [ ] Frontend is running at https://your-frontend-domain
- [ ] Health check returns 200 OK
- [ ] Can signup and create account
- [ ] Can upload documents
- [ ] Can search documents
- [ ] Analytics dashboard shows metrics
- [ ] Logs are being written
- [ ] SSL certificate is valid
- [ ] Database backups are configured

---

## Troubleshooting

### Backend Won't Start
```bash
# Check logs
render.logs

# Verify environment variables
echo $DATABASE_URL
echo $JWT_SECRET

# Test locally first
uvicorn app.main:app --reload
```

### Database Connection Errors
```bash
# Test connection
psql -h $DB_HOST -U $DB_USER -d reginova_prod -c "SELECT 1;"

# Check connection string format
# Should be: postgresql+psycopg2://user:pass@host:5432/db
```

### Groq API Errors
```bash
# Verify API key
echo $GROQ_API_KEY | wc -c  # Should be ~56 chars

# Check available models
python scripts/check_groq_models.py

# Update to correct model if deprecated
GROQ_MODEL=llama-3.1-8b-instant
```

### CORS Errors
Check `CORS_ORIGINS` environment variable:
```bash
# Should include your frontend domain
CORS_ORIGINS=["https://yourdomain.com","https://www.yourdomain.com"]
```

---

## Support & Resources

- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **Neon Docs:** https://neon.tech/docs
- **Groq Docs:** https://console.groq.com/docs
- **FastAPI Docs:** https://fastapi.tiangolo.com/deployment

---

## Maintenance Schedule

| Task | Frequency | Owner |
|------|-----------|-------|
| Check logs | Daily | DevOps |
| Review errors | Daily | DevOps |
| Rotate API keys | Quarterly | Security |
| Test backups | Monthly | DBA |
| Security updates | As needed | DevOps |
| Performance review | Monthly | DevOps |

---

**Last Updated:** 2024
**Status:** Production Ready
