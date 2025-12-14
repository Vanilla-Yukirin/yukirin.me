# 自建服务器部署指南

本文档详细介绍如何在自己的服务器上部署 Next.js 项目。

## 环境要求

- **服务器系统**: Ubuntu 20.04+ / CentOS 7+ / Debian 10+
- **Node.js**: 18.x 或更高版本
- **npm**: 8.x 或更高版本
- **Nginx**: 用于反向代理和静态文件服务
- **PM2**: 用于进程管理（推荐）
- **域名**: 已解析到服务器 IP

## 第一步：服务器准备

### 1.1 安装 Node.js

```bash
# 使用 NodeSource 安装 Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装
node --version  # 应该显示 v20.x.x
npm --version   # 应该显示 10.x.x
```

### 1.2 安装 Nginx

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y nginx

# 启动 Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# 验证安装
nginx -v
```

### 1.3 安装 PM2（进程管理器）

```bash
sudo npm install -g pm2

# 验证安装
pm2 --version
```

## 第二步：部署项目

### 2.1 克隆项目到服务器

```bash
# 进入部署目录（建议使用 /var/www）
cd /var/www

# 克隆项目
sudo git clone https://github.com/Vanilla-Yukirin/yukirin.me.git
cd yukirin.me

# 设置权限
sudo chown -R $USER:$USER /var/www/yukirin.me
```

### 2.2 安装项目依赖

```bash
# 在项目目录下
npm install
```

### 2.3 构建项目

```bash
npm run build
```

构建完成后，会生成 `.next` 目录，包含所有优化后的生产代码。

### 2.4 测试启动

```bash
# 临时启动，确认项目正常运行
npm start
```

打开浏览器访问 `http://服务器IP:3000`，如果能看到网站说明部署成功。
按 `Ctrl+C` 停止服务。

## 第三步：使用 PM2 管理进程

PM2 可以让 Node.js 应用在后台持续运行，并且在崩溃时自动重启。

### 3.1 创建 PM2 配置文件

```bash
# 在项目根目录创建 ecosystem.config.js
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'yukirin-site',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: '/var/www/yukirin.me',
    instances: 1,
    exec_mode: 'fork',
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss'
  }]
};
EOF

# 创建日志目录
mkdir -p logs
```

### 3.2 启动应用

```bash
# 使用 PM2 启动
pm2 start ecosystem.config.js

# 查看运行状态
pm2 status

# 查看日志
pm2 logs yukirin-site

# 停止应用（如果需要）
# pm2 stop yukirin-site

# 重启应用（如果需要）
# pm2 restart yukirin-site
```

### 3.3 设置开机自启

```bash
# 保存 PM2 进程列表
pm2 save

# 生成开机自启脚本
pm2 startup

# 根据提示执行命令（通常是类似这样的命令）
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp $HOME
```

## 第四步：配置 Nginx 反向代理

### 4.1 创建 Nginx 配置文件

```bash
# 创建网站配置
sudo nano /etc/nginx/sites-available/yukirin.me
```

### 4.2 基础配置（HTTP）

将以下内容粘贴到配置文件中，**替换域名为你自己的域名**：

```nginx
# HTTP 配置
server {
    listen 80;
    listen [::]:80;
    server_name yukirin.me www.yukirin.me;  # 替换为你的域名

    # 日志文件
    access_log /var/log/nginx/yukirin.me.access.log;
    error_log /var/log/nginx/yukirin.me.error.log;

    # 反向代理到 Next.js 应用
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # 静态文件缓存（可选优化）
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, immutable";
    }

    # 图片等静态资源
    location /images/ {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 30d;
        add_header Cache-Control "public";
    }
}
```

### 4.3 启用配置

```bash
# 创建软链接到 sites-enabled
sudo ln -s /etc/nginx/sites-available/yukirin.me /etc/nginx/sites-enabled/

# 测试 Nginx 配置
sudo nginx -t

# 如果显示 "syntax is ok" 和 "test is successful"，则重启 Nginx
sudo systemctl reload nginx
```

### 4.4 配置 HTTPS（推荐）

使用 Let's Encrypt 免费 SSL 证书：

```bash
# 安装 Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# 自动配置 SSL（会自动修改 Nginx 配置）
sudo certbot --nginx -d yukirin.me -d www.yukirin.me

# 按照提示输入邮箱，同意服务条款
# 选择是否重定向 HTTP 到 HTTPS（推荐选择重定向）

# 测试自动续期
sudo certbot renew --dry-run
```

配置完成后，Nginx 配置会自动更新为 HTTPS。

### 4.5 完整的 HTTPS 配置示例

如果需要手动配置 HTTPS，配置文件应该类似这样：

```nginx
# HTTP 重定向到 HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name yukirin.me www.yukirin.me;
    return 301 https://$server_name$request_uri;
}

# HTTPS 配置
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name yukirin.me www.yukirin.me;

    # SSL 证书（由 Certbot 自动配置）
    ssl_certificate /etc/letsencrypt/live/yukirin.me/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yukirin.me/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # 日志
    access_log /var/log/nginx/yukirin.me.access.log;
    error_log /var/log/nginx/yukirin.me.error.log;

    # 反向代理
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # 静态文件缓存
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }
}
```

## 第五步：防火墙配置

### 5.1 开放必要端口

```bash
# 如果使用 UFW
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp  # SSH（如果还没开放）
sudo ufw enable
sudo ufw status

# 如果使用 firewalld（CentOS）
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

**注意**：端口 3000 不需要对外开放，因为通过 Nginx 反向代理访问。

## 第六步：验证部署

### 6.1 检查服务状态

```bash
# 检查 PM2 进程
pm2 status

# 检查 Nginx 状态
sudo systemctl status nginx

# 查看应用日志
pm2 logs yukirin-site --lines 50
```

### 6.2 访问网站

浏览器访问：
- HTTP: `http://your-domain.com`
- HTTPS: `https://your-domain.com`

如果一切正常，应该能看到网站正常运行。

## 日常维护

### 更新网站内容

```bash
# 进入项目目录
cd /var/www/yukirin.me

# 拉取最新代码
git pull origin main

# 重新构建（如果有代码变更）
npm run build

# 重启应用
pm2 restart yukirin-site
```

### 更新数据文件

如果只是修改了 `data/` 目录中的数据文件：

```bash
cd /var/www/yukirin.me

# 拉取最新数据
git pull origin main

# 无需重新构建，直接重启
pm2 restart yukirin-site
```

### 查看日志

```bash
# PM2 应用日志
pm2 logs yukirin-site

# Nginx 访问日志
sudo tail -f /var/log/nginx/yukirin.me.access.log

# Nginx 错误日志
sudo tail -f /var/log/nginx/yukirin.me.error.log
```

### 监控资源使用

```bash
# PM2 监控
pm2 monit

# 系统资源
htop  # 或 top
```

## 故障排查

### 网站无法访问

1. **检查 PM2 进程**
   ```bash
   pm2 status
   # 如果显示 stopped 或 errored
   pm2 restart yukirin-site
   pm2 logs yukirin-site
   ```

2. **检查 Nginx**
   ```bash
   sudo systemctl status nginx
   sudo nginx -t  # 测试配置
   ```

3. **检查端口占用**
   ```bash
   sudo netstat -tlnp | grep :3000
   sudo netstat -tlnp | grep :80
   ```

4. **查看日志**
   ```bash
   pm2 logs yukirin-site --lines 100
   ```

### 构建失败

```bash
# 清除缓存
rm -rf .next node_modules

# 重新安装依赖
npm install

# 重新构建
npm run build
```

### 内存不足

如果服务器内存较小（< 1GB），可能需要增加 swap：

```bash
# 创建 2GB swap
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# 永久生效
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

## 性能优化建议

### 1. 启用 Nginx 压缩

编辑 `/etc/nginx/nginx.conf`，在 `http` 块中添加：

```nginx
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/rss+xml font/truetype font/opentype application/vnd.ms-fontobject image/svg+xml;
```

### 2. 配置日志轮转

```bash
# 创建日志轮转配置
sudo nano /etc/logrotate.d/yukirin-site
```

添加内容：

```
/var/www/yukirin.me/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 $USER $USER
    sharedscripts
}
```

### 3. 定期备份

```bash
# 创建备份脚本
cat > /var/www/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/yukirin"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# 备份数据文件
tar -czf $BACKUP_DIR/data_$DATE.tar.gz -C /var/www/yukirin.me data/

# 保留最近 7 天的备份
find $BACKUP_DIR -name "data_*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
EOF

chmod +x /var/www/backup.sh

# 添加到 crontab（每天凌晨 2 点备份）
(crontab -l 2>/dev/null; echo "0 2 * * * /var/www/backup.sh") | crontab -
```

## 安全建议

1. **定期更新系统和软件包**
   ```bash
   sudo apt-get update && sudo apt-get upgrade
   ```

2. **配置防火墙**（见上文第五步）

3. **使用 HTTPS**（见上文 4.4）

4. **限制 SSH 访问**
   - 禁用 root 登录
   - 使用 SSH 密钥认证
   - 修改默认 SSH 端口

5. **定期备份**（见上文性能优化部分）

## 注意事项

1. **域名解析**：确保域名 A 记录已指向服务器 IP
2. **端口 3000**：Next.js 默认运行在 3000 端口，通过 Nginx 反向代理，不需要对外开放
3. **public 目录**：Next.js 的静态文件在 `public/` 目录，会自动通过应用访问，**不需要单独配置 Nginx 指向 public**
4. **环境变量**：目前项目不需要环境变量，所有数据在 `data/` 目录

## 总结

完整部署流程：

```bash
# 1. 安装环境
# 安装 Node.js、Nginx、PM2

# 2. 部署项目
cd /var/www
git clone https://github.com/Vanilla-Yukirin/yukirin.me.git
cd yukirin.me
npm install
npm run build

# 3. 启动应用
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# 4. 配置 Nginx
sudo nano /etc/nginx/sites-available/yukirin.me
# 粘贴配置
sudo ln -s /etc/nginx/sites-available/yukirin.me /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 5. 配置 SSL
sudo certbot --nginx -d yukirin.me -d www.yukirin.me

# 6. 访问网站
# https://your-domain.com
```

现在你的网站已经在自己的服务器上成功运行了！
