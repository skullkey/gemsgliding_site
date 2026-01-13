# Deployment Guide for GEMS Website

## Prerequisites
- EC2 instance running Ubuntu
- SSH access configured as `AWS_I12FLY_CT_2023`
- Domain `www.gemsgliding.co.za` pointing to your EC2 IP address
- Port 80 and 443 open in EC2 security group

## DNS Configuration
Before deploying, ensure your domain DNS records point to your EC2 instance:
- A record: `gemsgliding.co.za` → Your EC2 IP
- A record: `www.gemsgliding.co.za` → Your EC2 IP

## Deployment Steps

### 1. Make scripts executable
```bash
chmod +x deploy.sh setup-nginx.sh setup-ssl.sh
```

### 2. Deploy website files
```bash
./deploy.sh
```
This uploads all website files to `/var/www/gemsgliding` on your EC2 server.

### 3. Configure nginx
```bash
./setup-nginx.sh
```
This installs nginx (if needed) and configures it for your domain.

### 4. Setup SSL certificate
```bash
./setup-ssl.sh
```
This installs Let's Encrypt SSL certificate and configures auto-renewal.

## Updating the Site

After making changes to your website:
```bash
./deploy.sh
```

The site will be updated immediately (no need to re-run nginx or SSL setup).

## Troubleshooting

### Check nginx status
```bash
ssh AWS_I12FLY_CT_2023 "sudo systemctl status nginx"
```

### View nginx error logs
```bash
ssh AWS_I12FLY_CT_2023 "sudo tail -f /var/log/nginx/error.log"
```

### Test nginx configuration
```bash
ssh AWS_I12FLY_CT_2023 "sudo nginx -t"
```

### Check SSL certificate status
```bash
ssh AWS_I12FLY_CT_2023 "sudo certbot certificates"
```

### Restart nginx
```bash
ssh AWS_I12FLY_CT_2023 "sudo systemctl restart nginx"
```

## Security Group Configuration

Ensure your EC2 security group allows:
- Port 22 (SSH) - Your IP only
- Port 80 (HTTP) - 0.0.0.0/0
- Port 443 (HTTPS) - 0.0.0.0/0

## File Locations on Server

- Website files: `/var/www/gemsgliding/`
- Nginx config: `/etc/nginx/sites-available/gemsgliding`
- SSL certificates: `/etc/letsencrypt/live/www.gemsgliding.co.za/`
- Nginx logs: `/var/log/nginx/`

## Notes

- SSL certificates auto-renew every 60 days
- The nginx configuration includes gzip compression and caching headers
- Security headers are added automatically
- Both `gemsgliding.co.za` and `www.gemsgliding.co.za` work with SSL
