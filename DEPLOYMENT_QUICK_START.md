# 🚀 Quick Deployment Guide

## Overview

This project has 3 components:
- **Frontend** (Next.js) → Deploy to Vercel ✅
- **Backend** (Express.js) → Deploy to Railway/Render/Fly.io ✅  
- **Demo Server** (Optional) → Deploy separately if needed

---

## Step 1: Deploy Backend First

### Option A: Railway (Recommended - Easiest)

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository and set root directory to `ai-incident-assistant`
4. Railway will auto-detect Node.js

5. **Add MongoDB:**
   - Click **"+ New"** → **"Database"** → **"MongoDB"**
   - Copy the connection string (starts with `mongodb+srv://`)

6. **Set Environment Variables:**
   - Go to **Variables** tab
   - Add these variables:
     ```
     MONGODB_URI=<paste-mongodb-connection-string>
     NIM_API_KEY=your-nvidia-nim-api-key
     NIM_BASE_URL=https://integrate.api.nvidia.com
     PRIMARY_MODEL=meta/llama-3.1-8b-instruct
     SECONDARY_MODEL=mistralai/mistral-7b-instruct
     PORT=5000
     ```
   - Click **"Deploy"**

7. **Get your backend URL:**
   - After deployment, click on your service
   - Go to **Settings** → **Networking**
   - Copy the **Public Domain** (e.g., `https://your-app.up.railway.app`)

---

## Step 2: Deploy Frontend to Vercel

### Using Vercel Dashboard (Easiest)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. **Configure:**
   - **Root Directory**: `incident-frontend` (click "Edit" and set this)
   - **Framework Preset**: Next.js (auto-detected)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

5. **Add Environment Variable:**
   - In the project settings, go to **Environment Variables**
   - Add:
     - **Name**: `NEXT_PUBLIC_API_URL`
     - **Value**: Your backend URL from Step 1 (e.g., `https://your-app.up.railway.app`)
     - Select all environments (Production, Preview, Development)

6. Click **"Deploy"**

7. **Your frontend will be live at:** `https://your-project.vercel.app`

---

## Step 3: Update Backend CORS (If Needed)

If your frontend can't connect to backend:

1. Go to Railway backend project → **Variables**
2. Add:
   - **Name**: `FRONTEND_URL`
   - **Value**: Your Vercel frontend URL (e.g., `https://your-project.vercel.app`)
3. Redeploy backend

---

## Step 4: Test Deployment

1. Open your Vercel frontend URL
2. Go to **Services** page
3. Add a test service:
   - Name: `Test Service`
   - URL: `https://httpbin.org/status/200`
   - Health Endpoint: `/status/200`
4. Check if monitoring creates incidents
5. Test AI analysis on an incident

---

## Environment Variables Checklist

### Frontend (Vercel)
- [x] `NEXT_PUBLIC_API_URL` = Your backend URL

### Backend (Railway/Render/Fly.io)
- [x] `MONGODB_URI` = MongoDB connection string
- [x] `NIM_API_KEY` = Your NVIDIA NIM API key
- [x] `NIM_BASE_URL` = `https://integrate.api.nvidia.com`
- [x] `PRIMARY_MODEL` = `meta/llama-3.1-8b-instruct`
- [x] `SECONDARY_MODEL` = `mistralai/mistral-7b-instruct`
- [x] `PORT` = `5000`
- [ ] `FRONTEND_URL` = Your Vercel URL (optional, for CORS)

---

## Alternative Platforms

### Backend on Render
1. Go to [render.com](https://render.com)
2. Create **Web Service** from GitHub repo
3. Root directory: `ai-incident-assistant`
4. Build: `npm install`
5. Start: `node src/server.js`
6. Add MongoDB service
7. Set environment variables (same as Railway)

### Backend on Fly.io
```bash
cd ai-incident-assistant
fly launch
fly secrets set MONGODB_URI="your-connection-string"
fly secrets set NIM_API_KEY="your-api-key"
# ... add other secrets
fly deploy
```

---

## Troubleshooting

**Frontend shows errors:**
- Check `NEXT_PUBLIC_API_URL` is set correctly in Vercel
- Verify backend URL is accessible
- Check browser console for errors

**Backend not connecting:**
- Verify MongoDB connection string
- Check all environment variables are set
- Review Railway/Render logs

**CORS errors:**
- Add `FRONTEND_URL` to backend environment variables
- Redeploy backend

**Monitoring not working:**
- Verify backend is running (not sleeping)
- Check MongoDB connection
- Review backend logs

---

## Cost Estimates (Free Tier)

- **Vercel**: Free (unlimited deployments)
- **Railway**: $5/month credit (usually free for small projects)
- **Render**: Free (slower, may sleep after inactivity)
- **MongoDB Atlas**: Free (512MB storage)

---

## 🎉 Done!

Your AI Incident Assistant is now live:
- Frontend: `https://your-project.vercel.app`
- Backend: `https://your-backend.railway.app`

