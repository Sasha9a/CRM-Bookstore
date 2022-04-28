#!/bin/bash
echo 'Connect to Server...'

# Если npm install завершается Killed
# sudo fallocate -l 1G /swapfile
# sudo chmod 600 /swapfile
# sudo mkswap /swapfile
# sudo swapon /swapfile
# sudo swapon --show
# sudo cp /etc/fstab /etc/fstab.bak
# echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
# sudo sysctl vm.swappiness=10
# echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
# sudo sysctl vm.vfs_cache_pressure=50
# echo 'vm.vfs_cache_pressure=50' | sudo tee -a /etc/sysctl.conf

umask 777
ssh -tt -i ~/.ssh/id_rsa root@62.113.109.25 << EOF
sudo apt -y update
sudo curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -
sudo apt -y install nodejs
node -v
npm -v
sudo apt -y install nginx
sudo apt -y install git
sudo apt -y install mongodb-server
sudo apt -y install certbot python3-certbot-nginx
sudo apt-get -y install build-essential
sudo npm install -g pm2
sudo npm install -g nx
sudo /bin/dd if=/dev/zero of=/var/swap.1 bs=1M count=1024
sudo /sbin/mkswap /var/swap.1
sudo /sbin/swapon /var/swap.1
sudo ufw allow 'Nginx Full'
sudo ufw delete allow 'Nginx HTTP'
sudo ufw enable
git clone https://github.com/Sasha9a/CRM-Bookstore.git
cd CRM-Bookstore
sudo npm install
nx affected:build --all
sudo mkdir -p /var/www/raskniga.ru/html
sudo chown -R $USER:$USER /var/www/raskniga.ru/html
sudo chmod -R 755 /var/www/raskniga.ru
sudo cp deploy/nginx.conf /etc/nginx/sites-available/raskniga.ru
sudo ln -s /etc/nginx/sites-available/raskniga.ru /etc/nginx/sites-enabled/
sudo cp -r ~/CRM-Bookstore/dist/apps/web/* /var/www/raskniga.ru/html
sudo certbot --nginx --reinstall --redirect -d raskniga.ru -d www.raskniga.ru
sudo systemctl enable mongodb
sudo pm2 start dist/apps/api/main.js
sudo pm2 save
sudo pm2 startup
exit
EOF

echo 'Finish!'
