#!/bin/bash

if [ -z "$1" ]; then
    echo "Usage: $0 <private_key_file>"
    exit 1
fi

PRIVATE_KEY="$1"
SERVER="165.22.108.44"

echo "Testing SSH connection to $SERVER..."
ssh -i "$PRIVATE_KEY" -o ConnectTimeout=10 -o StrictHostKeyChecking=no root@$SERVER "echo 'SSH connection successful! Server is ready for deployment.'"

if [ $? -eq 0 ]; then
    echo "✅ SSH connection successful!"
    echo "Ready to deploy Ajmal Investments Platform"
else
    echo "❌ SSH connection failed"
    echo "Please check the private key file and server access"
fi
