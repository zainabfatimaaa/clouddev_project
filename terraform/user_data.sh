#!/bin/bash
# This script installs and configures the MERN application with DynamoDB

# Update system packages
yum update -y

# Install Node.js, Git, and other dependencies
curl -sL https://rpm.nodesource.com/setup_16.x | bash -
yum install -y nodejs git

# Install PM2 globally
npm install -g pm2

# Clone the application repository
git clone ${repository} /var/www/app
cd /var/www/app
git checkout ${branch}

# Install application dependencies
npm install

# Setup environment variables
cat > /var/www/app/.env << EOF
NODE_ENV=production
PORT=80
AWS_REGION=${aws_region}
# Add any other environment variables your application needs
EOF

# Configure AWS CLI (EC2 instance already has permissions via IAM role)
mkdir -p /root/.aws
cat > /root/.aws/config << EOF
[default]
region = ${aws_region}
output = json
EOF

# Start the application with PM2
cd /var/www/app
npm run build  # If you have a build step
pm2 start server.js --name ${app_name}
pm2 startup
pm2 save

# Configure nginx as a reverse proxy if needed
# yum install -y nginx
# Configure nginx...

# Ensure the application starts on system boot
echo "Setting up systemd service for PM2"
env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ec2-user --hp /home/ec2-user
systemctl enable pm2-ec2-user