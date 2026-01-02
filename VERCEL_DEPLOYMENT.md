# 🚀 Vercel Deployment Guide

This guide covers deploying the AI Incident Assistant project to Vercel.

## 📋 Overview

This project consists of:
1. **Frontend** (`incident-frontend`) - Next.js application ✅ Can deploy to Vercel
2. **Backend** (`ai-incident-assistant`) - Express.js with continuous monitoring ⚠️ Needs separate hosting
3. **Demo Server** (`demo-company-server`) - Express.js demo service ⚠️ Optional, for testing

## ⚠️ Important Note

**Vercel uses serverless functions**, which are not suitable for long-running processes like the backend monitoring service. The backend needs to run continuously to monitor services.

### Recommended Approach:
- **Frontend**: Deploy to Vercel ✅
- **Backend**: Deploy to Railway, Render, Fly.io, or similar ✅
- **Demo Server**: Optional, deploy separately if needed

---

## 🎯 Part 1: Deploy Frontend to Vercel

### Step 1: Prepare Frontend

1. **Ensure all dependencies are installed:**
   ```bash
   cd incident-frontend
   npm install
   ```

2. **Test build locally:**
   ```bash
   npm run build
   ```

3. **Verify `.env.example` exists** (already created)

### Step 2: Deploy to Vercel

#### Option A: Using Vercel CLI (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Navigate to frontend directory:**
   ```bash
   cd incident-frontend
   ```

4. **Deploy:**
   ```bash
   vercel
   ```
   - Follow prompts
   - Select your project
   - Choose production

5. **Set environment variable:**
   ```bash
   vercel env add NEXT_PUBLIC_API_URL
   ```
   - Enter your backend URL (e.g., `https://your-backend.railway.app`)
   - Select all environments (Production, Preview, Development)

6. **Redeploy with environment variable:**
   ```bash
   vercel --prod
   ```

#### Option B: Using Vercel Dashboard

1. **Go to [vercel.com](https://vercel.com)** and sign in

2. **Import your Git repository:**
   - Click "Add New..." → "Project"
   - Import your Git repository
   - Set **Root Directory** to `incident-frontend`

3. **Configure project:**
   - Framework Preset: **Next.js** (auto-detected)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

4. **Add Environment Variable:**
   - Go to Settings → Environment Variables
   - Add `NEXT_PUBLIC_API_URL`
   - Value: Your backend URL (e.g., `https://your-backend.railway.app`)
   - Select all environments

5. **Deploy:**
   - Click "Deploy"

### Step 3: Verify Deployment

After deployment, your frontend will be available at:
```
https://your-project.vercel.app
```

---

## 🎯 Part 2: Deploy Backend (Railway Example)

Since Vercel serverless functions don't support long-running processes, deploy the backend separately.

### Option A: Deploy to Railway (Recommended)

1. **Go to [railway.app](https://railway.app)** and sign in

2. **Create new project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo" or "Empty Project"

3. **Configure project:**
   - If using GitHub: Connect repository and set root to `ai-incident-assistant`
   - If empty: Upload the `ai-incident-assistant` folder

4. **Add MongoDB:**
   - Click "+ New" → "Database" → "MongoDB"
   - Railway will provide connection string automatically

5. **Set Environment Variables:**
   - Go to Variables tab
   - Add all variables from `.env.example`:
     ```
     MONGODB_URI=<Railway MongoDB connection string>
     NIM_API_KEY=your-nvidia-nim-api-key
     NIM_BASE_URL=https://integrate.api.nvidia.com
     PRIMARY_MODEL=meta/llama-3.1-8b-instruct
     SECONDARY_MODEL=mistralai/mistral-7b-instruct
     PORT=5000
     ```

6. **Configure start command:**
   - Settings → Start Command: `node src/server.js`

7. **Get your backend URL:**
   - Railway provides a public URL (e.g., `https://your-project.up.railway.app`)
   - Update `NEXT_PUBLIC_API_URL` in Vercel with this URL

### Option B: Deploy to Render

1. **Go to [render.com](https://render.com)** and sign in

2. **Create new Web Service:**
   - Connect your Git repository
   - Set root directory to `ai-incident-assistant`

3. **Configure:**
   - Build Command: `npm install`
   - Start Command: `node src/server.js`
   - Environment: Node

4. **Add MongoDB:**
   - Create new MongoDB service
   - Use connection string in environment variables

5. **Add Environment Variables:**
   - Same as Railway example above

6. **Get public URL and update Vercel frontend**

### Option C: Deploy to Fly.io

1. **Install Fly CLI:**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login:**
   ```bash
   fly auth login
   ```

3. **Initialize app:**
   ```bash
   cd ai-incident-assistant
   fly launch
   ```

4. **Configure environment variables:**
   ```bash
   fly secrets set MONGODB_URI="your-connection-string"
   fly secrets set NIM_API_KEY="your-api-key"
   # ... add other variables
   ```

5. **Deploy:**
   ```bash
   fly deploy
   ```

---

## 🎯 Part 3: Deploy Demo Server (Optional)

The demo server is optional and only needed for testing. You can deploy it similarly to the backend:

1. **Railway/Render/Fly.io** - Same process as backend
2. **Update backend monitoring** - Add the demo server URL to your backend's monitored services

---

## 🔧 Environment Variables Summary

### Frontend (Vercel)
```
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

### Backend (Railway/Render/Fly.io)
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/incident-management
NIM_API_KEY=your-nvidia-nim-api-key
NIM_BASE_URL=https://integrate.api.nvidia.com
PRIMARY_MODEL=meta/llama-3.1-8b-instruct
SECONDARY_MODEL=mistralai/mistral-7b-instruct
```

---

## ✅ Post-Deployment Checklist

- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Railway/Render/Fly.io
- [ ] MongoDB database connected
- [ ] Environment variables configured
- [ ] `NEXT_PUBLIC_API_URL` points to backend
- [ ] Frontend can communicate with backend
- [ ] CORS configured on backend (should allow Vercel domain)
- [ ] Test incident creation
- [ ] Test AI analysis
- [ ] Test service monitoring

---

## 🐛 Troubleshooting

### Frontend can't connect to backend

1. **Check CORS on backend:**
   - Ensure backend allows requests from Vercel domain
   - Update CORS configuration if needed

2. **Verify environment variable:**
   - Check Vercel dashboard → Settings → Environment Variables
   - Ensure `NEXT_PUBLIC_API_URL` is set correctly
   - Redeploy after changing environment variables

3. **Check backend logs:**
   - Verify backend is running
   - Check for connection errors

### Backend monitoring service not working

- Ensure backend is deployed on a platform that supports long-running processes
- Check MongoDB connection
- Verify all environment variables are set

### Build errors

- Ensure all dependencies are in `package.json`
- Check Node.js version compatibility
- Review build logs in Vercel dashboard

---

## 📝 Notes

- **Vercel Free Tier**: Suitable for frontend deployment
- **Railway Free Tier**: $5 credit monthly, suitable for backend
- **Render Free Tier**: Slower cold starts, suitable for backend
- **MongoDB Atlas**: Free tier available for database

---

## 🎉 You're Done!

Your AI Incident Assistant should now be deployed:
- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://your-backend.railway.app`

Test the deployment and ensure everything works correctly!

