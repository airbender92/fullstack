### 完整的前后端分离项目部署指南（Windows + Nginx）

以下是基于您的项目结构和需求整理的完整部署流程，包含环境准备、配置步骤和常见问题解决方法。


### **一、环境准备**
#### **1. 安装 Node.js 和 pnpm**
- 从 [Node.js 官网](https://nodejs.org/) 下载并安装 LTS 版本
- 安装 pnpm 包管理器：
  ```bash
  npm install -g pnpm
  ```

#### **2. 下载并解压 Nginx**
- 从 [Nginx 官网](https://nginx.org/en/download.html) 下载 Windows 版本
- 解压到本地目录（例如：`D:\wybD\FW\nginx-1.28.0`）


### **二、项目构建**
#### **1. 后端项目（packages/server）**
```bash
cd packages/server
pnpm install       # 安装依赖
pnpm run build     # 编译 TypeScript
pnpm start         # 测试启动（默认监听 3001 端口）
```

#### **2. 前端项目（packages/client）**
```bash
cd packages/client
pnpm install       # 安装依赖

# 修改 webpack.prod.config.js 添加 publicPath
output: {
  publicPath: '/fullstack/',
}

pnpm run build     # 构建前端静态文件（输出到 dist 目录）
```


### **三、Nginx 配置**
#### **1. 修改 nginx.conf**
```nginx
worker_processes 1;

events {
    worker_connections 1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile      on;
    keepalive_timeout 65;

    server {
        listen       80;
        server_name  localhost;

        root D:/wybD/fullstack/packages/client/dist;
        index index.html;

        # 根路径重定向到 /fullstack/
        location = / {
            return 301 /fullstack/;
        }

        # 处理 /fullstack/ 路径
        location ^~ /fullstack/ {
            alias D:/wybD/fullstack/packages/client/dist/;
            try_files $uri $uri/ /index.html;
        }

        # 处理不带斜杠的 /fullstack
        location = /fullstack {
            return 301 /fullstack/;
        }

        # API 代理
        location /api {
            proxy_pass http://localhost:3001;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        error_page 500 502 503 504 /50x.html;
        location = /50x.html {
            root html;
        }
    }
}
```


### **四、启动服务**
#### **1. 创建 Nginx 日志目录**
```bash
cd D:\wybD\FW\nginx-1.28.0
mkdir logs
```

#### **2. 启动后端服务**
```bash
cd packages/server
node dist/index.js  # 或使用 PM2 管理进程
```

#### **3. 启动 Nginx**
```bash
cd D:\wybD\FW\nginx-1.28.0

# 检查配置文件是否正确
nginx -t

# 启动 Nginx
start nginx.exe

# 验证进程
tasklist | findstr nginx
```


### **五、验证部署**
1. **访问前端应用**  
   打开浏览器访问 `http://localhost`，应自动跳转到 `http://localhost/fullstack/`

2. **检查静态资源**  
   在开发者工具的 Network 面板中，确认 JS/CSS 文件加载路径正确：
   ```
   http://localhost/fullstack/js/main.js
   http://localhost/fullstack/css/main.css
   ```

3. **测试 API 请求**  
   访问 `http://localhost/api`，应返回后端服务的响应


### **六、常见问题及解决方法**
#### **1. Nginx 启动失败**
- **问题**：`nginx.pid` 文件不存在  
  **解决**：手动创建 `logs` 目录并重启

- **问题**：端口冲突  
  **解决**：使用 `netstat -ano | findstr :80` 检查端口占用，修改 Nginx 监听端口

#### **2. 前端资源加载失败**
- **问题**：JavaScript 文件返回 HTML 内容  
  **解决**：检查 Nginx 配置中 `location /fullstack/` 路径是否正确

- **问题**：404 错误  
  **解决**：确认 `dist` 目录包含正确的静态文件，检查 `publicPath` 配置

#### **3. 重定向循环**
- **问题**：浏览器提示“重定向次数过多”  
  **解决**：确保 Nginx 配置中 `location` 规则优先级正确，避免循环重定向


### **七、高级配置（可选）**
#### **1. 使用域名访问**
1. 修改 Windows hosts 文件（`C:\Windows\System32\drivers\etc\hosts`）：
   ```plaintext
   127.0.0.1  myapp.local
   ```

2. 修改 Nginx 配置中的 `server_name`：
   ```nginx
   server_name myapp.local;
   ```

3. 重启 Nginx 并访问 `http://myapp.local`

#### **2. 配置 HTTPS**
使用 [mkcert](https://github.com/FiloSottile/mkcert) 生成本地证书：
```nginx
server {
    listen 443 ssl;
    server_name localhost;

    ssl_certificate      D:/wybD/certs/cert.pem;
    ssl_certificate_key  D:/wybD/certs/key.pem;

    # 其他配置保持不变
}
```


通过以上步骤，你可以在本地 Windows 环境中成功部署前后端分离项目，实现前端静态文件服务和后端 API 代理。