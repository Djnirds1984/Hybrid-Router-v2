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
  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.100.168:5173/
```
- Use the **Local** URL if you are browsing from the same machine where the server is running.
- Use the **Network** URL to access the dashboard from other devices on the same network (like your phone or another computer).

#### **Note on Network Access:**
The project's `vite.config.js` is configured with `host: true` to make the development server accessible on your local network. If you can't connect using the network IP address, ensure that no firewall on the host machine is blocking port `5173`.


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