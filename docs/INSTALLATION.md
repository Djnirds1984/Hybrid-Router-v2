# Hybrid Router Dashboard - Installation Guide

This guide will walk you through setting up and running the Hybrid Router Dashboard frontend. This project is designed to be the user interface for a system monitoring various host boards (like Raspberry Pi or x64 servers) on your network.

## Prerequisites

Before you begin, ensure you have the following installed on your development machine:

-   [Node.js](https://nodejs.org/) (v16.x or later recommended)
-   [npm](https://www.npmjs.com/) (usually comes with Node.js) or [Yarn](https://yarnpkg.com/)

## 1. Frontend Setup

This will get the user interface running on your local machine.

### Step 1: Clone the Repository

Clone this project to your local machine using Git:

```bash
git clone https://github.com/Djnirds1984/Hybrid-Router-v2.git
cd Hybrid-Router-v2
```

### Step 2: Install Dependencies

Install the required npm packages for the React application:

```bash
npm install
```
*(Or if you use Yarn: `yarn install`)*

### Step 3: Run the Development Server

Start the local development server. This will launch the dashboard in your web browser, typically at `http://localhost:5173` or a similar address.

```bash
npm run dev
```
*(Or if you use Yarn: `yarn dev`)*

At this point, the dashboard will likely show an error because it cannot connect to the backend API. This is expected. Proceed to the next section to understand the backend requirements.

---

## 2. Backend Setup (Action Required)

The frontend is only one half of the solution. It is designed to fetch data from a backend API endpoint that you need to create. This backend service will run on your host boards (or a central server) and provide the system statistics.

### API Endpoint Requirement

The frontend application will make `GET` requests to `/api/boards`. Your backend server must respond to this endpoint with a JSON array of board information objects.

**Example API URL:** `http://<your-server-ip>:8080/api/boards`

You will need to update the `fetch` URL in `src/App.tsx` if your API is hosted on a different domain or port. For development, it's recommended to proxy requests from the frontend dev server to your backend to avoid CORS issues.

### Expected JSON Data Format

The API response must be a JSON array where each object conforms to the `BoardInfo` structure defined in `src/types.ts`.

**Example JSON Response from `/api/boards`:**
```json
[
  {
    "id": "rpi3-01",
    "name": "Raspberry Pi 3",
    "arch": "arm",
    "cpuUsage": 45.2,
    "memory": {
      "used": 0.6,
      "total": 1
    },
    "temp": 55.1,
    "uptime": "15d 4h 32m",
    "network": {
      "status": "Online",
      "ipAddress": "192.168.1.101",
      "speed": 987
    }
  },
  {
    "id": "x64-server-01",
    "name": "Ubuntu Server",
    "arch": "x64",
    "cpuUsage": 12.8,
    "memory": {
      "used": 8.4,
      "total": 16
    },
    "temp": 41.5,
    "uptime": "98d 12h 5m",
    "network": {
      "status": "Online",
      "ipAddress": "192.168.1.102",
      "speed": 991
    }
  }
]
```

### Implementing the Backend

You can use any language or framework to create this backend service. Here are some popular choices:
*   **Node.js with Express:** A lightweight and fast way to create a REST API. You can use libraries like `os-utils` or `systeminformation` to get system stats.
*   **Python with Flask/FastAPI:** Excellent for scripting and system-level tasks. Python has many libraries for querying system information.
*   **Go:** A great choice for high-performance, low-resource system services.

The backend service would need to be installed and run on each host board you want to monitor, or a central aggregator would need to poll each board and expose a single API endpoint.

---

## 3. Building for Production

When you are ready to deploy the dashboard, you can create an optimized production build:

```bash
npm run build
```
*(Or if you use Yarn: `yarn build`)*

This command will generate a `dist` folder containing the static HTML, CSS, and JavaScript files. You can serve these files from any static web host or web server (like NGINX or Apache).