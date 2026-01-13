#!/bin/bash

# Setup nginx configuration on EC2
# Usage: ./setup-nginx.sh

set -e

SSH_CONFIG="AWS_I12FLY_CT_2023"
DOMAIN="www.gemsgliding.co.za"

echo "⚙️  Setting up nginx configuration..."

# Copy nginx config to server
echo "📤 Uploading nginx configuration..."
scp nginx.conf $SSH_CONFIG:/tmp/gemsgliding.conf

# Install and configure nginx
ssh $SSH_CONFIG << 'EOF'
    # Install nginx if not already installed
    if ! command -v nginx &> /dev/null; then
        echo "Installing nginx..."
        sudo apt update
        sudo apt install -y nginx
    fi

    # Move config to nginx sites
    sudo mv /tmp/gemsgliding.conf /etc/nginx/sites-available/gemsgliding
    
    # Enable site
    sudo ln -sf /etc/nginx/sites-available/gemsgliding /etc/nginx/sites-enabled/
    
    # Remove default site if exists
    sudo rm -f /etc/nginx/sites-enabled/default
    
    # Test nginx configuration
    sudo nginx -t
    
    # Restart nginx
    sudo systemctl restart nginx
    sudo systemctl enable nginx
    
    echo "✅ Nginx configured and running!"
EOF

echo ""
echo "✅ Nginx setup complete!"
echo "🌐 Site should now be accessible at http://$DOMAIN"
echo ""
echo "Next: Run ./setup-ssl.sh to add HTTPS support"
