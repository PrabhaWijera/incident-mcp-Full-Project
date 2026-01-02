# 🔧 Setting Up Environment Variables in Railway

## Current Issue
Your backend is running, but `MONGODB_URI` is not set, so the database cannot connect.

## Quick Fix: Add Environment Variables

### Step 1: Go to Railway Dashboard

1. Open your Railway project: [railway.app](https://railway.app)
2. Click on your **backend service** (the service you just deployed)

### Step 2: Add Environment Variables

1. Click on the **Variables** tab (or **Settings** → **Variables**)
2. Click **"New Variable"** or **"+ New"**

### Step 3: Add Required Variables

Add these variables one by one:

#### 1. MONGODB_URI (Required)
```
Name: MONGODB_URI
Value: mongodb+srv://username:password@cluster.mongodb.net/dbname
```

**How to get MongoDB URI:**

**Option A: MongoDB Atlas (Free - Recommended)**
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in (free tier available)
3. Create a new cluster (Free M0 tier is fine)
4. Click **"Connect"** → **"Connect your application"**
5. Copy the connection string (looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`)
6. Replace `<username>` and `<password>` with your actual credentials
7. Add database name at the end: `...mongodb.net/incident-assistant?retryWrites=true&w=majority`

**Option B: Railway MongoDB Plugin (Easiest)**
1. In Railway, click **"+ New"** → **"Database"** → **"Add MongoDB"**
2. Railway will create a MongoDB instance for you
3. Click on the MongoDB service
4. Go to **Variables** tab
5. Copy the `MONGO_URL` value
6. Add it as `MONGODB_URI` in your backend service

#### 2. NIM_API_KEY (Required)
```
Name: NIM_API_KEY
Value: your-nvidia-nim-api-key-here
```
Use the NVIDIA NIM API key you already have.

#### 3. NIM_BASE_URL (Required)
```
Name: NIM_BASE_URL
Value: https://integrate.api.nvidia.com
```

#### 4. PRIMARY_MODEL (Required)
```
Name: PRIMARY_MODEL
Value: meta/llama-3.1-8b-instruct
```

#### 5. SECONDARY_MODEL (Required)
```
Name: SECONDARY_MODEL
Value: mistralai/mistral-7b-instruct
```

#### 6. FRONTEND_URL (Optional - for CORS)
```
Name: FRONTEND_URL
Value: https://your-frontend.vercel.app
```
Only needed if you're deploying the frontend to Vercel.

### Step 4: Save and Redeploy

1. After adding all variables, Railway will **automatically redeploy** your service
2. Or click **"Redeploy"** in the **Deployments** tab
3. Wait for the deployment to complete

### Step 5: Verify It Works

1. Go to **Logs** tab
2. You should see:
   ```
   🚀 Server running on port 5000
   ✅ MongoDB connected
   🔄 Starting continuous monitoring service...
   ✅ Monitoring service started (checks every 300s)
   ```

3. Test the health endpoint:
   ```bash
   curl https://your-app.up.railway.app/health
   ```
   
   Should return:
   ```json
   {
     "status": "ok",
     "database": "connected",
     "timestamp": "2026-01-01T..."
   }
   ```

---

## Complete Environment Variables Checklist

### Required Variables:
- [ ] `MONGODB_URI` - MongoDB connection string
- [ ] `NIM_API_KEY` - NVIDIA NIM API key
- [ ] `NIM_BASE_URL` - `https://integrate.api.nvidia.com`
- [ ] `PRIMARY_MODEL` - `meta/llama-3.1-8b-instruct`
- [ ] `SECONDARY_MODEL` - `mistralai/mistral-7b-instruct`

### Optional Variables:
- [ ] `PORT` - Railway sets this automatically (usually `5000`)
- [ ] `FRONTEND_URL` - Your Vercel frontend URL (for CORS)

---

## Troubleshooting

### MongoDB Connection Still Failing?

1. **Check MongoDB Atlas Network Access:**
   - Go to MongoDB Atlas → **Network Access**
   - Click **"Add IP Address"**
   - Click **"Allow Access from Anywhere"** (or add Railway's IP ranges)

2. **Verify Connection String:**
   - Make sure username and password are correct
   - Replace `<username>` and `<password>` with actual values
   - Add database name: `...mongodb.net/incident-assistant?...`

3. **Check Railway Logs:**
   - Look for specific MongoDB error messages
   - Common errors:
     - `authentication failed` - Wrong username/password
     - `connection timeout` - Network access not configured
     - `server selection timeout` - Cluster not accessible

### Server Not Redeploying After Adding Variables?

1. Manually trigger a redeploy:
   - Go to **Deployments** tab
   - Click **"Redeploy"** on the latest deployment
   - Or push a commit to your GitHub repository

---

## Quick Copy-Paste Template

If using Railway MongoDB plugin, you can copy these directly:

```bash
MONGODB_URI=<from-railway-mongodb-plugin>
NIM_API_KEY=your-key-here
NIM_BASE_URL=https://integrate.api.nvidia.com
PRIMARY_MODEL=meta/llama-3.1-8b-instruct
SECONDARY_MODEL=mistralai/mistral-7b-instruct
```

**Note:** Railway automatically sets `PORT`, so you don't need to set it manually.

