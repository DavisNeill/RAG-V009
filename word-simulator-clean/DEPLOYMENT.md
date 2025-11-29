# Deployment Guide

This guide covers deploying the Word Simulator application to production.

## Table of Contents
- [Environment Setup](#environment-setup)
- [Database Setup](#database-setup)
- [Backend Deployment](#backend-deployment)
- [Frontend Deployment](#frontend-deployment)
- [Production Checklist](#production-checklist)

## Environment Setup

### Required Services
- Node.js hosting (Heroku, Railway, DigitalOcean, AWS EC2, etc.)
- MongoDB database (MongoDB Atlas, self-hosted, etc.)
- Static file hosting for frontend (Vercel, Netlify, AWS S3 + CloudFront, etc.)

### Environment Variables

**Backend (.env)**:
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/word-simulator
JWT_SECRET=your-very-secure-random-secret-key-here
JWT_EXPIRE=7d
CORS_ORIGIN=https://your-frontend-domain.com
```

**Frontend**:
Update the API endpoint in your frontend code or use environment variables:
```env
VITE_API_URL=https://your-backend-domain.com/api
```

## Database Setup

### MongoDB Atlas (Recommended)

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Create a free cluster

2. **Configure Database**
   - Create a database user
   - Whitelist IP addresses (or allow from anywhere: 0.0.0.0/0)
   - Get connection string

3. **Seed Initial Data**
   ```bash
   cd backend
   MONGODB_URI="your-connection-string" node src/utils/seedDatabase.js
   ```

## Backend Deployment

### Option 1: Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login and Create App**
   ```bash
   heroku login
   cd backend
   heroku create word-simulator-backend
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI="your-mongodb-uri"
   heroku config:set JWT_SECRET="your-secret"
   heroku config:set CORS_ORIGIN="https://your-frontend.vercel.app"
   ```

4. **Deploy**
   ```bash
   git add .
   git commit -m "Deploy backend"
   git push heroku main
   ```

### Option 2: Railway

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and Deploy**
   ```bash
   cd backend
   railway login
   railway init
   railway up
   ```

3. **Set Environment Variables** in Railway dashboard

### Option 3: DigitalOcean/AWS EC2

1. **Create Droplet/EC2 Instance**
   - Ubuntu 22.04 LTS
   - At least 1GB RAM

2. **SSH into Server**
   ```bash
   ssh root@your-server-ip
   ```

3. **Install Node.js and MongoDB**
   ```bash
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install PM2
   sudo npm install -g pm2

   # Install MongoDB (if self-hosting)
   # Follow: https://docs.mongodb.com/manual/installation/
   ```

4. **Clone and Setup**
   ```bash
   git clone https://github.com/your-repo/word-simulator.git
   cd word-simulator/backend
   npm install --production
   ```

5. **Create .env file**
   ```bash
   nano .env
   # Add your environment variables
   ```

6. **Start with PM2**
   ```bash
   pm2 start src/server.js --name word-simulator-backend
   pm2 save
   pm2 startup
   ```

7. **Setup Nginx Reverse Proxy**
   ```bash
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/word-simulator
   ```

   ```nginx
   server {
       listen 80;
       server_name api.your-domain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   ```bash
   sudo ln -s /etc/nginx/sites-available/word-simulator /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

8. **Setup SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d api.your-domain.com
   ```

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Build and Deploy**
   ```bash
   cd frontend
   vercel
   ```

3. **Configure Environment Variables**
   - Go to Vercel dashboard
   - Add `VITE_API_URL` environment variable

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

### Option 2: Netlify

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build**
   ```bash
   cd frontend
   npm run build
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod --dir=dist
   ```

4. **Configure redirects** (create `public/_redirects`):
   ```
   /*    /index.html   200
   ```

### Option 3: AWS S3 + CloudFront

1. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Create S3 Bucket**
   - Enable static website hosting
   - Upload `dist` folder contents

3. **Create CloudFront Distribution**
   - Point to S3 bucket
   - Configure custom domain
   - Setup SSL certificate

4. **Update CORS** in backend to allow CloudFront domain

## Production Checklist

### Security
- [ ] Change default JWT secret to strong random string
- [ ] Enable HTTPS for both frontend and backend
- [ ] Configure CORS properly (specific origins, not wildcard)
- [ ] Enable rate limiting
- [ ] Setup MongoDB authentication
- [ ] Use environment variables for all secrets
- [ ] Enable MongoDB encryption at rest
- [ ] Setup firewall rules
- [ ] Regular security updates

### Performance
- [ ] Enable gzip compression
- [ ] Setup CDN for static assets
- [ ] Configure caching headers
- [ ] Optimize images
- [ ] Enable database indexing
- [ ] Setup monitoring (PM2, New Relic, DataDog, etc.)
- [ ] Configure auto-scaling if needed

### Monitoring
- [ ] Setup error tracking (Sentry, Rollbar)
- [ ] Configure logging (Winston, Bunyan)
- [ ] Setup uptime monitoring (UptimeRobot, Pingdom)
- [ ] Database monitoring and backups
- [ ] Setup alerts for errors and downtime

### Backup
- [ ] Configure automated MongoDB backups
- [ ] Store backups in separate location
- [ ] Test restore procedures
- [ ] Document backup schedule

### Testing
- [ ] Test all API endpoints in production
- [ ] Test user registration and login
- [ ] Test test creation and submission
- [ ] Test validation engine
- [ ] Cross-browser testing
- [ ] Mobile responsiveness testing
- [ ] Load testing

### Documentation
- [ ] Update README with production URLs
- [ ] Document deployment process
- [ ] Create admin user guide
- [ ] Create student user guide
- [ ] API documentation

## Monitoring Commands

### Check Backend Status
```bash
# PM2
pm2 status
pm2 logs word-simulator-backend

# Heroku
heroku logs --tail

# Railway
railway logs
```

### Database Health
```bash
# MongoDB Atlas - use web dashboard
# Self-hosted
mongo --eval "db.stats()"
```

### SSL Certificate Renewal
```bash
# Let's Encrypt (automated, but can manually renew)
sudo certbot renew
```

## Rollback Procedure

### Heroku
```bash
heroku releases
heroku rollback v<version-number>
```

### Vercel/Netlify
- Use web dashboard to rollback to previous deployment

### PM2
```bash
pm2 reload word-simulator-backend
```

## Support

For deployment issues:
1. Check application logs
2. Verify environment variables
3. Check database connectivity
4. Verify CORS settings
5. Review firewall/security group rules

---

Happy Deploying! 🚀
