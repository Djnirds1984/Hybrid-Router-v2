# Hybrid Router Dashboard - Installation Guide

This guide will walk you through setting up and running the Hybrid Router Dashboard. This project has two main parts: a **frontend** (the dashboard UI) and a **backend** (a server that provides system data).

## Prerequisites

-   [Node.js](https://nodejs.org/) (v16.x or later recommended)
-   [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
-   [Git](https://git-scm.com/)

---

## 1. Frontend Setup (Dashboard UI)

This will get the user interface running on your local machine.

### Step 1: Clone the Repository

```bash
git clone https://github.com/Djnirds1984/Hybrid-Router-v2.git
cd Hybrid-Router-v2
```

### Step 2: Install Dependencies

Install the required npm packages for the React application:

```bash
npm install
```
*(Or `yarn install`)*

### Step 3: Run the Development Server

Start the local development server. This will launch the dashboard.

```bash
npm run dev
```
*(Or `yarn dev`)*

After starting, Vite will show you the URLs to access the dashboard:
```
  ➜  Local:   http://localhost:30000/
  ➜  Network: http://192.168.100.168:30000/
```
- Use the **Local** URL if you are browsing from the same machine where the server is running.
- Use the **Network** URL to access the dashboard from other devices on the same network (like your phone or another computer).

#### **Note on Network Access:**
The project's `vite.config.js` is configured with `host: true` and `port: 30000` to make the development server accessible on your local network. If you can't connect using the network IP address, ensure that no firewall on the host machine is blocking port `30000`.


#### **Note on Connection Errors:**

If the dashboard shows a "Connection Error" (especially one complaining about `... is not valid JSON`), it means the frontend cannot reach the backend.

1.  **First, ensure the backend is running!** Follow the [Backend Setup Guide](./BACKEND_SETUP.md).
2.  This project uses a `vite.config.js` file to proxy API requests to the backend. If you've just cloned the project or made changes to this file, you may need to **stop and restart** the frontend development server for the proxy to work correctly:

    ```bash
    # In the terminal running the frontend, press CTRL+C
    # Then restart it:
    npm run dev
    ```

---

## 2. Backend Setup (Data Server)

The frontend requires a backend service to be running on the host machine (e.g., your Raspberry Pi or x64 server) to provide the live system data.

**For detailed instructions on setting up and running the backend, please follow the guide here:**

➡️ **[Backend Setup Guide](./BACKEND_SETUP.md)**

---

## 3. Building for Production

Once both the frontend and backend are working, you can create an optimized production build of the frontend:

```bash
npm run build
```
*(Or `yarn build`)*

This generates a `dist` folder with static files that you can deploy to any web server.

---

## 4. Optional: Nginx Reverse Proxy (Development)

You can run the dashboard and backend behind a single local URL using Nginx. This repo includes a ready-to-use config at `nginx/nginx.conf`:

### What it does
- Serves the frontend development server at `http://localhost:8081/`
- Proxies API calls `http://localhost:8081/api/...` to the backend on `127.0.0.1:8080`
- Supports WebSocket/HMR for the Vite dev server

### Prerequisites
- Frontend dev server running (Vite)
- Backend server running (Express on port 8080)

### Linux setup (Raspberry Pi / x64 / ARM)
1. Install Nginx (Debian/Raspberry Pi OS/Ubuntu):

   ```bash
   sudo apt update && sudo apt install -y nginx
   ```

2. Create a site config:

   ```bash
   sudo tee /etc/nginx/sites-available/hybrid-router >/dev/null <<'EOF'
   map $http_upgrade $connection_upgrade { default upgrade; '' close; }
   upstream backend { server 127.0.0.1:8080; }
   upstream frontend_dev { server 127.0.0.1:3000; }
   server {
     listen 8081;
     server_name _;
     location /api/ {
       proxy_pass http://backend/;
       proxy_http_version 1.1;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection $connection_upgrade;
     }
     location / {
       proxy_pass http://frontend_dev;
       proxy_http_version 1.1;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection $connection_upgrade;
     }
   }
   EOF
   ```

3. Enable the site and reload Nginx:

   ```bash
   sudo ln -sf /etc/nginx/sites-available/hybrid-router /etc/nginx/sites-enabled/hybrid-router
   sudo nginx -t
   sudo systemctl enable --now nginx
   sudo systemctl reload nginx
   ```

4. Open `http://<device-ip>:8081/` from your network

### Quick setup on port 80 (recommended)
Use this if you want the dashboard at `http://<device-ip>/` instead of `:8081`.

1. Disable the default site:

   ```bash
   sudo unlink /etc/nginx/sites-enabled/default
   ```

2. Create the site on port 80 (frontend dev on `30000`, backend on `8080`):

   ```bash
   sudo tee /etc/nginx/sites-available/hybrid-router >/dev/null <<'EOF'
   map $http_upgrade $connection_upgrade { default upgrade; '' close; }
   upstream backend { server 127.0.0.1:8080; }
   upstream frontend_dev { server 127.0.0.1:30000; }
   server {
     listen 80;
     server_name _;
     location /api/ {
       proxy_pass http://backend/;
       proxy_http_version 1.1;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection $connection_upgrade;
     }
     location / {
       proxy_pass http://frontend_dev;
       proxy_http_version 1.1;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection $connection_upgrade;
     }
   }
   EOF
   ```

3. Enable and reload:

   ```bash
   sudo ln -sf /etc/nginx/sites-available/hybrid-router /etc/nginx/sites-enabled/hybrid-router
   sudo nginx -t
   sudo systemctl reload nginx
   ```

4. Verify:

   ```bash
   # Through Nginx
   curl -I http://127.0.0.1/
   curl -v http://127.0.0.1/api/boards
   
   # Direct services
   curl -I http://127.0.0.1:30000/
   curl -v http://127.0.0.1:8080/api/boards
   ```

### Adjusting the frontend dev port
- If your Vite dev server runs on `30000` (per `vite.config.js`), change `upstream frontend_dev` to `127.0.0.1:30000`
- If your Vite dev server runs on `3000` (per `vite.config.ts`), keep `127.0.0.1:3000`

### Manage Nginx (Linux)
```bash
sudo systemctl status nginx
sudo systemctl reload nginx
sudo systemctl stop nginx
```

### Troubleshooting
- If `http://<device-ip>:8081` doesn’t load, ensure both frontend (`npm run dev`) and backend (`cd backend && npm start`) are running
- Port conflicts: change the `listen` port if `8081` is in use
- Logs: check `/var/log/nginx/error.log`

### Production example (serve built frontend)
Once you run `npm run build`, you can serve the `dist` output with Nginx and still proxy `/api` to the backend:

```bash
sudo mkdir -p /var/www/hybrid-router
sudo cp -r ./dist/* /var/www/hybrid-router/
sudo tee /etc/nginx/sites-available/hybrid-router-prod >/dev/null <<'EOF'
map $http_upgrade $connection_upgrade { default upgrade; '' close; }
upstream backend { server 127.0.0.1:8080; }
server {
  listen 80;
  server_name _;
  root /var/www/hybrid-router;
  index index.html;
  location / {
    try_files $uri $uri/ /index.html;
  }
  location /api/ {
    proxy_pass http://backend/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection $connection_upgrade;
  }
}
EOF
sudo ln -sf /etc/nginx/sites-available/hybrid-router-prod /etc/nginx/sites-enabled/hybrid-router-prod
sudo nginx -t
sudo systemctl reload nginx
```