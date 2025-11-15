# Hybrid Router - Backend Setup Guide

This guide explains how to set up and run the backend server for the Hybrid Router Dashboard. This server is designed to run on the host machine you want to monitor (e.g., a Raspberry Pi, an Ubuntu server, etc.). It collects system statistics and makes them available to the frontend dashboard.

## Technology

The backend is a lightweight [Node.js](https://nodejs.org/) server using:
-   **Express.js**: A minimal and flexible web application framework for creating the API.
-   **systeminformation**: A powerful library to retrieve detailed hardware, system, and OS information.
-   **CORS**: To allow the frontend (which may be running on a different port/domain) to connect to this server.

---

## Step 1: Navigate to the Backend Directory

From the root of the project (`Hybrid-Router-v2`), change into the `backend` directory.

```bash
cd backend
```

## Step 2: Install Backend Dependencies

Install the required Node.js packages for the server.

```bash
npm install
```
*(This will install `express`, `cors`, and `systeminformation` as defined in `backend/package.json`)*

## Step 3: Run the Backend Server

Start the server using the `start` script defined in `package.json`.

```bash
npm start
```

You should see a confirmation message in your terminal:
```
Hybrid Router backend server running on http://localhost:8080
```

The server is now running and listening for requests on port `8080`.

---

## How It Works

-   The server exposes a single API endpoint: `GET /api/boards`.
-   The frontend application (running via `npm run dev`) is configured to fetch data from this endpoint.
-   When you refresh the dashboard in your browser, it will now successfully connect to this server, fetch the live system data, and display it.

## Running on Different Boards (ARM / x64)

The process is the same for any board that can run Node.js.

1.  Ensure **Node.js** and **npm** are installed on your Raspberry Pi or x64 Ubuntu board.
2.  Clone the repository onto that board.
3.  Follow the setup steps above to run the backend server **on that board**.
4.  You can then access the frontend dashboard from any other computer on the same network by pointing your browser to the IP address of the board running the frontend dev server.
