#!/bin/bash


set -e

echo "🚀 Starting Ajmal Investments Platform Deployment..."

echo "🧹 Cleaning existing installations..."
systemctl stop nginx || true
systemctl stop ajmal-backend || true
systemctl stop ajmal-frontend || true
rm -rf /var/www/ajmalinvestment
rm -rf /opt/ajmal-backend
rm -f /etc/systemd/system/ajmal-*.service
rm -f /etc/nginx/sites-enabled/ajmalinvestment.com
rm -f /etc/nginx/sites-available/ajmalinvestment.com

echo "📦 Updating system packages..."
apt update && apt upgrade -y

echo "📦 Installing required packages..."
apt install -y nginx postgresql postgresql-contrib python3-pip python3-venv nodejs npm git curl

curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs
npm install -g pnpm

echo "📁 Creating directories..."
mkdir -p /var/www/ajmalinvestment
mkdir -p /opt/ajmal-backend
mkdir -p /var/log/ajmal

echo "📦 Extracting deployment package..."
cd /tmp
tar -xzf ajmal-investment-platform.tar.gz

echo "🗄️ Setting up PostgreSQL..."
sudo -u postgres createdb ajmal_investments || true
sudo -u postgres psql -c "CREATE USER ajmal_user WITH PASSWORD 'ajmal_secure_password_2024';" || true
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ajmal_investments TO ajmal_user;" || true

echo "🔧 Deploying Backend..."
cp -r backend/* /opt/ajmal-backend/
cd /opt/ajmal-backend

python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install poetry
poetry install --no-dev

cat > /opt/ajmal-backend/.env << EOF
DATABASE_URL=postgresql://ajmal_user:ajmal_secure_password_2024@localhost:5432/ajmal_investments
SECRET_KEY=ajmal_super_secret_key_2024_production_$(openssl rand -hex 32)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=info@ajmalinvestment.com
SMTP_PASSWORD=your_email_app_password_here
FRONTEND_URL=https://ajmalinvestment.com
EOF

cat > /etc/systemd/system/ajmal-backend.service << EOF
[Unit]
Description=Ajmal Investments Backend
After=network.target postgresql.service

[Service]
Type=simple
User=root
WorkingDirectory=/opt/ajmal-backend
Environment=PATH=/opt/ajmal-backend/venv/bin
ExecStart=/opt/ajmal-backend/venv/bin/poetry run uvicorn app.main:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

echo "🎨 Deploying Frontend..."
cd /tmp
cp -r frontend/* /var/www/ajmalinvestment/

cat > /var/www/ajmalinvestment/.env << EOF
VITE_API_URL=https://ajmalinvestment.com/api
EOF

cd /var/www/ajmalinvestment
pnpm install
pnpm run build

echo "🌐 Configuring Nginx..."
cat > /etc/nginx/sites-available/ajmalinvestment.com << EOF
server {
    listen 80;
    server_name ajmalinvestment.com www.ajmalinvestment.com;
    
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ajmalinvestment.com www.ajmalinvestment.com;
    
    ssl_certificate /etc/letsencrypt/live/ajmalinvestment.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ajmalinvestment.com/privkey.pem;
    
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    location / {
        root /var/www/ajmalinvestment/dist;
        try_files \$uri \$uri/ /index.html;
        
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    location /api/ {
        proxy_pass http://localhost:8000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    client_max_body_size 10M;
}
EOF

ln -sf /etc/nginx/sites-available/ajmalinvestment.com /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

echo "🔒 Installing SSL certificate..."
apt install -y certbot python3-certbot-nginx
certbot --nginx -d ajmalinvestment.com -d www.ajmalinvestment.com --non-interactive --agree-tos --email info@ajmalinvestment.com || echo "SSL setup failed - will use HTTP for now"

echo "🚀 Starting services..."
systemctl daemon-reload
systemctl enable ajmal-backend
systemctl start ajmal-backend
systemctl enable nginx
systemctl restart nginx

cat > /etc/logrotate.d/ajmal << EOF
/var/log/ajmal/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 root root
}
EOF

echo "✅ Deployment completed successfully!"
echo ""
echo "🌐 Your platform is now available at:"
echo "   - https://ajmalinvestment.com (with SSL)"
echo "   - http://ajmalinvestment.com (redirects to HTTPS)"
echo ""
echo "📊 Service status:"
systemctl status ajmal-backend --no-pager -l
systemctl status nginx --no-pager -l
echo ""
echo "📝 Next steps:"
echo "1. Update your email SMTP credentials in /opt/ajmal-backend/.env"
echo "2. Test the registration flow"
echo "3. Monitor logs: journalctl -u ajmal-backend -f"
echo ""
echo "🎉 Ajmal Investments Platform is live!"
