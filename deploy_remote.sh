#!/bin/bash


if [ -z "$1" ]; then
    echo "Usage: $0 <private_key_file>"
    echo "Example: ./deploy_remote.sh ~/.ssh/id_ed25519"
    exit 1
fi

PRIVATE_KEY="$1"
SERVER="165.22.108.44"
USER="root"

echo "🚀 Starting remote deployment to $SERVER..."

echo "Testing SSH connection..."
ssh -i "$PRIVATE_KEY" -o ConnectTimeout=10 -o StrictHostKeyChecking=no $USER@$SERVER "echo 'SSH connection successful!'" || {
    echo "❌ SSH connection failed. Please check your private key."
    exit 1
}

echo "✅ SSH connection successful!"

echo "📦 Uploading deployment files..."
scp -i "$PRIVATE_KEY" -o StrictHostKeyChecking=no ajmal-investment-platform.tar.gz $USER@$SERVER:/tmp/
scp -i "$PRIVATE_KEY" -o StrictHostKeyChecking=no deploy.sh $USER@$SERVER:/tmp/

echo "🚀 Executing deployment on remote server..."
ssh -i "$PRIVATE_KEY" -o StrictHostKeyChecking=no $USER@$SERVER "cd /tmp && chmod +x deploy.sh && ./deploy.sh"

echo "✅ Deployment completed!"
echo "🌐 Platform should be available at: https://ajmalinvestment.com"
echo "📊 Checking service status..."

ssh -i "$PRIVATE_KEY" -o StrictHostKeyChecking=no $USER@$SERVER "systemctl status ajmal-backend --no-pager -l && systemctl status nginx --no-pager -l"

echo "🎉 Ajmal Investments Platform deployment complete!"
