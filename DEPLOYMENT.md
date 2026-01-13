# Deployment Guide

This guide will help you deploy your Planning Poker app so your teammates can use it online.

## Quick Deploy Options

### Option 1: Railway (Recommended - Easiest & Free)

Railway is the easiest option with a generous free tier.

**Steps:**

1. **Create a Railway account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy your app**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your GitHub account
   - Select this repository
   - Railway will automatically detect it's a Node.js app

3. **Set environment variables** (optional)
   - Go to your project settings
   - Add variables if needed:
     - `NODE_ENV=production`
     - `PORT` (Railway sets this automatically)

4. **Get your URL**
   - Railway will give you a URL like: `https://your-app-name.up.railway.app`
   - Share this with your teammates!

**Cost:** Free tier includes 500 hours/month and $5 credit

---

### Option 2: Render (Also Easy & Free)

**Steps:**

1. **Create a Render account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create a new Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select this repo

3. **Configure the service:**
   - **Name:** planning-poker (or any name)
   - **Environment:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** Free (or paid if you want)

4. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy your app
   - You'll get a URL like: `https://planning-poker.onrender.com`

**Note:** Free tier spins down after 15 minutes of inactivity (takes ~30 seconds to wake up)

**Cost:** Free tier available

---

### Option 3: Fly.io (Good Free Tier)

**Steps:**

1. **Install Fly CLI**
   ```bash
   # Windows (PowerShell)
   iwr https://fly.io/install.ps1 -useb | iex
   ```

2. **Create account and login**
   ```bash
   fly auth signup
   fly auth login
   ```

3. **Initialize your app**
   ```bash
   fly launch
   ```
   - Follow the prompts
   - Don't deploy yet (we need to create fly.toml first)

4. **Deploy**
   ```bash
   fly deploy
   ```

**Cost:** Free tier includes 3 shared VMs

---

### Option 4: Vercel (Requires Modification)

⚠️ **Note:** Vercel doesn't support custom servers with Socket.io on their serverless platform. You'd need to:
- Use Vercel for the frontend
- Deploy Socket.io server separately (Railway/Render)
- Update `NEXT_PUBLIC_SOCKET_URL` to point to your Socket.io server

This is more complex, so I recommend Railway or Render instead.

---

## Before Deploying

### 1. Push to GitHub

If you haven't already, create a GitHub repository:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/planning-poker.git
git push -u origin main
```

### 2. Test Locally First

Make sure everything works:
```bash
npm install
npm run build
npm start
```

Then test at `http://localhost:3000`

---

## After Deployment

### Update Socket.io Connection (if needed)

If your deployment platform uses a different URL, you may need to update the client connection. The app automatically uses `window.location.origin`, so it should work automatically.

### Share with Your Team

Once deployed, share the URL with your teammates. They can:
1. Visit the URL
2. Enter their name
3. Create or join a room
4. Start estimating!

---

## Environment Variables

Most platforms set these automatically, but you can configure:

- `NODE_ENV=production` - Production mode
- `PORT` - Server port (usually set by platform)
- `HOSTNAME` - Server hostname (defaults to 0.0.0.0)

---

## Troubleshooting

### "Connection failed" errors
- Make sure your platform supports WebSockets (Railway, Render, Fly.io all do)
- Check that the server is running
- Verify CORS settings in `server.js`

### Build fails
- Make sure all dependencies are in `package.json`
- Check that Node.js version is 18+ (most platforms use this by default)

### Socket.io not connecting
- Verify the URL is correct
- Check browser console for errors
- Ensure WebSocket connections aren't blocked by firewall

---

## Recommended: Railway

For the easiest deployment experience, I recommend **Railway**:
- ✅ One-click GitHub deployment
- ✅ Automatic HTTPS
- ✅ Free tier
- ✅ No credit card required
- ✅ Easy to update (just push to GitHub)

Good luck with your deployment! 🚀
