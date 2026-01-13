#!/bin/bash

# Deployment script for GEMS website to EC2
# Usage: ./deploy.sh

set -e

SSH_CONFIG="AWS_I12FLY_CT_2023"
DOMAIN="www.gemsgliding.co.za"
REMOTE_USER="ubuntu"  # Change if your EC2 user is different
SITE_DIR="/var/www/gemsgliding"

echo "🚀 Deploying GEMS website to EC2..."

# Create remote directory
echo "📁 Creating site directory on server..."
ssh $SSH_CONFIG "sudo mkdir -p $SITE_DIR && sudo chown -R $REMOTE_USER:$REMOTE_USER $SITE_DIR"

# Sync files to server
echo "📤 Uploading files..."
rsync -avz --delete \
  --exclude '*.sh' \
  --exclude '*.md' \
  --exclude 'nginx.conf' \
  --exclude '.git' \
  --exclude '.gitignore' \
  --exclude '.gitattributes' \
  --exclude '.DS_Store' \
  ./ $SSH_CONFIG:$SITE_DIR/

echo "✅ Files deployed successfully!"
echo ""
echo "Next steps:"
echo "1. Run: ./setup-nginx.sh to configure nginx"
echo "2. Run: ./setup-ssl.sh to setup SSL certificate"
