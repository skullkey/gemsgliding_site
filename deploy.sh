#!/bin/bash

# Deployment script for GEMS website to EC2
# Usage: ./deploy.sh

set -e

SSH_CONFIG="AWS_I12FLY_CT_2023"
DOMAIN="www.gemsgliding.co.za"
REMOTE_USER="ubuntu"  # Change if your EC2 user is different
SITE_DIR="/var/www/gemsgliding"
REPO_URL="git@github.com:skullkey/gemsgliding_site.git"

echo "🚀 Deploying GEMS website to EC2..."

# Create remote directory
echo "📁 Creating site directory on server..."
ssh $SSH_CONFIG "sudo mkdir -p $SITE_DIR && sudo chown -R $REMOTE_USER:$REMOTE_USER $SITE_DIR"

# Clone or pull repository
echo "📦 Updating repository on server..."
ssh $SSH_CONFIG << 'ENDSSH'
cd /var/www/gemsgliding
if [ -d ".git" ]; then
  echo "Repository exists, pulling latest changes..."
  git pull origin main
else
  echo "Cloning repository..."
  git clone git@github.com:skullkey/gemsgliding_site.git .
fi
ENDSSH

echo "✅ Deployment successful!"
echo ""
echo "Website files are in: $SITE_DIR/public/"
echo "Deployment scripts remain private in: $SITE_DIR/"
echo ""
echo "Next steps (if first deployment):"
echo "1. Run: ./setup-nginx.sh to configure nginx"
echo "2. Run: ./setup-ssl.sh to setup SSL certificate"
