# 🚀 Ajmal Investments Platform - Production Deployment Guide

## Overview
This guide will help you deploy the Ajmal Investments platform to your DigitalOcean server (165.22.108.44) with complete server cleanup and production configuration.

## Prerequisites
- DigitalOcean server: 165.22.108.44 (Singapore)
- Domain: ajmalinvestment.com (pointing to server IP)
- SSH access to the server
- Root privileges

## Step 1: Upload Deployment Files

Download the deployment files from the attachments and upload them to your server:

```bash
# Upload files to server
scp ajmal-investment-platform.tar.gz root@165.22.108.44:/tmp/
scp deploy.sh root@165.22.108.44:/tmp/
```

## Step 2: Connect to Server and Deploy

```bash
# SSH into your server
ssh root@165.22.108.44

# Navigate to deployment directory
cd /tmp

# Make deployment script executable
chmod +x deploy.sh

# Run deployment (this will clean everything first)
./deploy.sh
```

## Step 3: Post-Deployment Configuration

### Update Email Configuration
Edit the backend environment file:
```bash
nano /opt/ajmal-backend/.env
```

Update these values:
```env
SMTP_USERNAME=info@ajmalinvestment.com
SMTP_PASSWORD=your_gmail_app_password_here
```

### Restart Backend Service
```bash
systemctl restart ajmal-backend
```

## Step 4: Verify Deployment

### Check Service Status
```bash
# Check backend service
systemctl status ajmal-backend

# Check nginx service
systemctl status nginx

# Check logs
journalctl -u ajmal-backend -f
```

### Test Platform Access
- Frontend: https://ajmalinvestment.com
- Backend API: https://ajmalinvestment.com/api/docs

## Step 5: Test Registration Flow

1. Navigate to: https://ajmalinvestment.com/register
2. Fill out registration form with valid data
3. Verify successful registration and redirect to dashboard
4. Check that onboarding banner appears for new users

## Troubleshooting

### If SSL Certificate Fails
```bash
# Manual SSL setup
certbot --nginx -d ajmalinvestment.com -d www.ajmalinvestment.com
```

### If Backend Service Fails
```bash
# Check logs
journalctl -u ajmal-backend -n 50

# Check environment
cat /opt/ajmal-backend/.env

# Restart service
systemctl restart ajmal-backend
```

### If Database Connection Fails
```bash
# Check PostgreSQL status
systemctl status postgresql

# Test database connection
sudo -u postgres psql -d ajmal_investments -c "SELECT version();"
```

### If Frontend Build Fails
```bash
# Rebuild frontend
cd /var/www/ajmalinvestment
pnpm install
pnpm run build
systemctl restart nginx
```

## Security Checklist

- [ ] SSL certificate installed and working
- [ ] Firewall configured (ports 80, 443, 22 only)
- [ ] Database password is secure
- [ ] Backend secret key is generated
- [ ] Email credentials are configured
- [ ] Log rotation is set up

## Monitoring

### View Logs
```bash
# Backend logs
journalctl -u ajmal-backend -f

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# System logs
dmesg | tail
```

### Performance Monitoring
```bash
# Check system resources
htop
df -h
free -h

# Check service memory usage
systemctl status ajmal-backend
```

## Backup Strategy

### Database Backup
```bash
# Create backup
sudo -u postgres pg_dump ajmal_investments > /backup/ajmal_$(date +%Y%m%d).sql

# Restore backup
sudo -u postgres psql ajmal_investments < /backup/ajmal_20240924.sql
```

### File Backup
```bash
# Backup application files
tar -czf /backup/ajmal_app_$(date +%Y%m%d).tar.gz /opt/ajmal-backend /var/www/ajmalinvestment
```

## Support

If you encounter any issues during deployment:

1. Check the logs first: `journalctl -u ajmal-backend -n 50`
2. Verify all services are running: `systemctl status ajmal-backend nginx postgresql`
3. Test database connectivity: `sudo -u postgres psql -d ajmal_investments`
4. Check domain DNS settings point to 165.22.108.44
5. Verify SSL certificate is valid: `certbot certificates`

## Success Indicators

✅ **Backend Service**: `systemctl status ajmal-backend` shows "active (running)"  
✅ **Frontend Access**: https://ajmalinvestment.com loads the landing page  
✅ **API Access**: https://ajmalinvestment.com/api/docs shows FastAPI documentation  
✅ **Registration**: New user registration works without "Registration failed" error  
✅ **SSL Certificate**: HTTPS works without browser warnings  
✅ **Database**: User data is stored and retrieved correctly  

## Next Steps After Deployment

1. Test all platform features thoroughly
2. Set up monitoring and alerting
3. Configure automated backups
4. Update DNS TTL settings
5. Set up log aggregation
6. Configure email templates
7. Test payment integration (when ready)

---

**Platform Status**: Ready for Production Deployment 🚀
