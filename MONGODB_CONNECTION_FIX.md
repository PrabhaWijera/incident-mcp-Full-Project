# 🔧 Fixing MongoDB Connection Errors on Railway

## Current Errors
1. **IP Whitelist Issue**: MongoDB Atlas requires IP addresses to be whitelisted
2. **SSL/TLS Error**: Connection issues with SSL certificates

## Solution 1: Whitelist Railway IPs in MongoDB Atlas (Quick Fix)

### Steps:

1. **Go to MongoDB Atlas:**
   - Open [cloud.mongodb.com](https://cloud.mongodb.com)
   - Log in to your account

2. **Network Access:**
   - Click **"Network Access"** in the left sidebar
   - Click **"Add IP Address"**

3. **Add Railway IPs:**
   - Click **"Allow Access from Anywhere"** button
   - This adds `0.0.0.0/0` (allows all IPs)
   - **Or** manually add: `0.0.0.0/0`
   - Click **"Confirm"**

   ⚠️ **Security Note**: Allowing `0.0.0.0/0` is fine for Railway deployments since your database is password-protected. For production, you can restrict to specific IP ranges if needed.

4. **Wait 1-2 minutes** for changes to propagate

5. **Redeploy your Railway service:**
   - Go to Railway → Your service → **Deployments**
   - Click **"Redeploy"**

---

## Solution 2: Use Railway MongoDB Plugin (Recommended - Easiest)

Railway's MongoDB plugin handles all network configuration automatically!

### Steps:

1. **Create MongoDB in Railway:**
   - In your Railway project, click **"+ New"**
   - Select **"Database"** → **"Add MongoDB"**
   - Railway will create a MongoDB instance

2. **Get Connection String:**
   - Click on the new **MongoDB service**
   - Go to **Variables** tab
   - Copy the `MONGO_URL` value (it looks like: `mongodb://mongo:27017/...`)

3. **Update Backend Service:**
   - Go back to your **backend service**
   - Go to **Variables** tab
   - Find or create `MONGODB_URI`
   - **Important**: Railway MongoDB uses a different format!
   - Replace the value with the `MONGO_URL` from step 2

   **Format differences:**
   - Atlas: `mongodb+srv://user:pass@cluster.mongodb.net/dbname`
   - Railway: `mongodb://mongo:27017/railway` (internal network)

4. **Redeploy:**
   - Railway will automatically redeploy
   - Check logs - should connect immediately!

---

## Solution 3: Fix Connection String Format

If using MongoDB Atlas, make sure your connection string is correct:

### Correct Format:
```
mongodb+srv://username:password@cluster-name.xxxxx.mongodb.net/database-name?retryWrites=true&w=majority
```

### Common Issues:

1. **Missing Database Name:**
   ```
   ❌ mongodb+srv://user:pass@cluster.mongodb.net/
   ✅ mongodb+srv://user:pass@cluster.mongodb.net/incident-assistant
   ```

2. **Special Characters in Password:**
   - If your password has special characters, URL-encode them:
   - `@` becomes `%40`
   - `#` becomes `%23`
   - `$` becomes `%24`
   - `%` becomes `%25`

3. **Wrong Connection String:**
   - Make sure you're using **"Connect your application"** (not "Connect with MongoDB Shell")
   - Should start with `mongodb+srv://` (not `mongodb://`)

---

## Solution 4: Check MongoDB Atlas Configuration

1. **Verify Cluster Status:**
   - Go to MongoDB Atlas → **Clusters**
   - Make sure cluster status is **"Running"** (green)
   - If paused, click **"Resume"**

2. **Verify Database User:**
   - Go to **Database Access**
   - Make sure your user exists and has correct permissions
   - Password should match what's in your connection string

3. **Check Connection String:**
   - Go to **Clusters** → Click **"Connect"** → **"Connect your application"**
   - Verify the connection string matches what you have in Railway

---

## Recommended: Use Railway MongoDB (Easiest)

For Railway deployments, using Railway's MongoDB plugin is the **easiest and most reliable** option:

✅ **No IP whitelisting needed** - Railway handles networking  
✅ **No SSL certificate issues** - Internal network connection  
✅ **Automatic backups** - Railway manages backups  
✅ **Simpler connection string** - Just copy from Variables  

### Quick Switch to Railway MongoDB:

1. **Add MongoDB plugin in Railway:**
   ```
   + New → Database → Add MongoDB
   ```

2. **Copy connection string:**
   ```
   MongoDB service → Variables → MONGO_URL
   ```

3. **Update backend variable:**
   ```
   Backend service → Variables → MONGODB_URI = <MONGO_URL>
   ```

4. **Redeploy** - Should work immediately!

---

## Verify Connection

After applying any solution, check Railway logs:

**Success looks like:**
```
🚀 Server running on port 5000
✅ MongoDB connected
🔄 Starting continuous monitoring service...
✅ Monitoring service started (checks every 300s)
```

**If still failing:**
- Check the exact error message in logs
- Verify connection string format
- Make sure IP is whitelisted (for Atlas)
- Try Railway MongoDB plugin (most reliable)

---

## Troubleshooting SSL Errors

If you see SSL/TLS errors with Atlas:

1. **Try adding SSL options to connection string:**
   ```
   mongodb+srv://user:pass@cluster.mongodb.net/dbname?retryWrites=true&w=majority&ssl=true
   ```

2. **Or use Railway MongoDB** (no SSL issues with internal network)

3. **Check Node.js version:**
   - Railway should use Node.js 18+ (which has better SSL support)
   - Check `package.json` for `"engines": { "node": ">=18.0.0" }`

---

**Recommendation: Use Railway MongoDB plugin for the easiest deployment experience!**

