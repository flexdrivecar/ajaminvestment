#!/bin/bash

echo "🚀 DEPLOYING SEO OPTIMIZATIONS TO AJMALINVESTMENT.COM"
echo "=================================================="

echo "=== DEPLOYING SITEMAP AND ROBOTS.TXT ==="
scp -i ~/.ssh/ajmal_deploy_key -o StrictHostKeyChecking=no sitemap.xml root@165.22.108.44:/var/www/ajmalinvestment/dist/
scp -i ~/.ssh/ajmal_deploy_key -o StrictHostKeyChecking=no robots.txt root@165.22.108.44:/var/www/ajmalinvestment/dist/

echo "=== UPDATING NGINX CONFIGURATION ==="
ssh -i ~/.ssh/ajmal_deploy_key -o StrictHostKeyChecking=no root@165.22.108.44 "
cat >> /etc/nginx/sites-available/ajmalinvestment << 'EOF'

    location = /sitemap.xml {
        root /var/www/ajmalinvestment/dist;
        expires 1d;
        add_header Cache-Control \"public, immutable\";
        add_header X-Robots-Tag \"noindex\";
    }

    location = /robots.txt {
        root /var/www/ajmalinvestment/dist;
        expires 1d;
        add_header Cache-Control \"public, immutable\";
    }

    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control \"public, immutable\";
        add_header Vary Accept-Encoding;
    }

    add_header X-Frame-Options \"SAMEORIGIN\" always;
    add_header X-Content-Type-Options \"nosniff\" always;
    add_header Referrer-Policy \"no-referrer-when-downgrade\" always;
    add_header Content-Security-Policy \"default-src 'self' http: https: data: blob: 'unsafe-inline'\" always;

EOF

nginx -t && systemctl reload nginx
"

echo "=== TESTING SEO FILES ==="
echo "Sitemap test:"
curl -s -I https://ajmalinvestment.com/sitemap.xml | head -2

echo "Robots.txt test:"
curl -s -I https://ajmalinvestment.com/robots.txt | head -2

echo "=== SEO DEPLOYMENT COMPLETED ==="
echo "Next steps:"
echo "1. Add property to Google Search Console: https://search.google.com/search-console"
echo "2. Submit sitemap: https://ajmalinvestment.com/sitemap.xml"
echo "3. Request indexing for key pages"
echo "4. Monitor in GSC for indexing status"
echo "=================================================="
