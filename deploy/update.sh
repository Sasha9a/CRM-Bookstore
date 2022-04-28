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
cd CRM-Bookstore
sudo git pull
sudo npm install
nx affected:build --all
sudo cp deploy/nginx.conf /etc/nginx/sites-available/raskniga.ru
sudo ln -s /etc/nginx/sites-available/raskniga.ru /etc/nginx/sites-enabled/
sudo cp -r ~/CRM-Bookstore/dist/apps/web/* /var/www/raskniga.ru/html
sudo certbot --nginx --reinstall --redirect -d raskniga.ru -d www.raskniga.ru
sudo pm2 restart 0
exit
EOF

echo 'Finish!'
