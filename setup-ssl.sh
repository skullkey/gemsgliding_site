#!/bin/bash

# Setup SSL certificate with Let's Encrypt
# Usage: ./setup-ssl.sh

set -e

SSH_CONFIG="AWS_I12FLY_CT_2023"
DOMAIN="www.gemsgliding.co.za"
EMAIL="schalk@house4hack.co.za"  # Change this to your email

echo "🔒 Setting up SSL certificate with Let's Encrypt..."

ssh $SSH_CONFIG << EOF
    # Install certbot
    if ! command -v certbot &> /dev/null; then
        echo "Installing certbot..."
        sudo apt update
        sudo apt install -y certbot python3-certbot-nginx
    fi

    # Obtain and install certificate
    echo "Obtaining SSL certificate..."
    sudo certbot --nginx \
        -d gemsgliding.co.za \
        -d www.gemsgliding.co.za \
        --non-interactive \
        --agree-tos \
        --email $EMAIL \
        --redirect

    # Setup auto-renewal
    sudo systemctl enable certbot.timer
    sudo systemctl start certbot.timer

    echo "✅ SSL certificate installed and auto-renewal configured!"
EOF

echo ""
echo "✅ SSL setup complete!"
echo "🌐 Site is now accessible at https://$DOMAIN"
echo "🔄 Certificate will auto-renew before expiration"
