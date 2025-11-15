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

Start the local development server. This will launch the dashboard in your web browser.

```bash
npm run dev
```
*(Or `yarn dev`)*

The dashboard will open, but it will show a connection error because it cannot connect to the backend yet. Proceed to the next step.

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
