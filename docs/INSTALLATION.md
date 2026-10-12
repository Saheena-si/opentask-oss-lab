# OpenTask — Installation & Setup Guide

This guide provides step-by-step instructions for installing and running OpenTask locally on Windows, macOS, or Linux.

---

## 1. Prerequisites

Before starting, ensure you have the following installed on your machine:

1. **Git** (v2.30 or higher)
   - Check with: `git --version`
2. **Node.js** (v20 or v24 LTS)
   - Check with: `node -v`
3. **npm** (v10 or v11+)
   - Check with: `npm -v`

> **Note for Windows Users**: OpenTask uses Node.js's built-in `node:sqlite` module. You **do not** need Python or Visual Studio C++ Build Tools installed.

---

## 2. Clone the Repository

Clone the project to your local directory:

```bash
git clone https://github.com/saheena-si/opentask-oss-lab.git
cd opentask-oss-lab
```

---

## 3. Install Dependencies

You can install all dependencies from the root directory with a single command:

```bash
npm run install:all
```

Alternatively, install backend and frontend packages individually:

```bash
# 1. Install Backend Dependencies
cd backend
npm install

# 2. Install Frontend Dependencies
cd ../frontend
npm install
cd ..
```

---

## 4. Environment Variables Setup

Both backend and frontend come with `.env.example` templates with sensible defaults:

### Backend Configuration
```bash
# Optional: copy example file
cp backend/.env.example backend/.env
```
Default values:
```env
PORT=5000
NODE_ENV=development
DB_PATH=./data/opentask.db
CORS_ORIGIN=http://localhost:5173
```

### Frontend Configuration
```bash
# Optional: copy example file
cp frontend/.env.example frontend/.env
```
Default values:
```env
VITE_API_BASE_URL=http://localhost:5000
```

---

## 5. Running the Application

Open **two separate terminal windows** (e.g. PowerShell or Command Prompt).

### Terminal 1: Start Backend Server
```powershell
cd C:\Users\a\Desktop\opentask-oss-lab\backend
npm start
```
*Output expected:*
```
===============================================
🚀 OpenTask Server running on http://localhost:5000
📡 Health Check: http://localhost:5000/api/health
📋 Tasks API:    http://localhost:5000/api/tasks
===============================================
```

### Terminal 2: Start Frontend Development Server
```powershell
cd C:\Users\a\Desktop\opentask-oss-lab\frontend
npm run dev
```
*Output expected:*
```
  VITE v6.x.x  ready in 250 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open your browser to `http://localhost:5173` to interact with OpenTask.

---

## 6. Verifying the Installation

1. **Verify Backend Health**: Visit `http://localhost:5000/api/health` in your browser. You should receive a JSON response: `{"status":"ok", "database":"connected"}`.
2. **Verify Frontend**: In `http://localhost:5173`, look at the top navigation bar. It should show a green dot with **"Backend Connected"**.
3. **Verify Demo Data**: By default, 6 initial demo tasks are pre-populated in the dashboard.

---

## 7. How to Reset Database Demo Data

The SQLite database file is stored at:
`backend/data/opentask.db`

To reset the database back to clean demo data:

### Method A: Run the Seed Script
```powershell
cd backend
npm run seed
```
*(If tasks already exist, it will safely skip seeding to prevent duplicates).*

### Method B: Complete Reset
1. Stop the backend server (`Ctrl + C`).
2. Delete the database file:
   ```powershell
   Remove-Item .\backend\data\opentask.db
   ```
3. Restart the backend server (`npm start`). The table schema and demo tasks will be recreated automatically!

---

## 8. Troubleshooting

### Port 5000 is already in use
If another application is using port 5000:
1. Open `backend/.env` (or set the environment variable) and change `PORT=5001`.
2. Update `frontend/.env` to `VITE_API_BASE_URL=http://localhost:5001`.

### PowerShell Execution Policy Error
If running `npm run dev` displays an execution policy restriction:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

### Backend shows "Server Offline" in Frontend
- Confirm Terminal 1 is still running.
- Test `http://localhost:5000/api/health` in your browser.
- Check that no firewall or anti-virus is blocking local loopback (`127.0.0.1`).
