# Planning Poker Web App

A real-time Planning Poker estimation tool built with Next.js, TypeScript, and Socket.io.

## Features

- 🎯 Real-time collaborative voting
- 🎴 Fibonacci sequence cards (0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, ?, ☕)
- 👥 Multi-user rooms with live participant list
- 📊 Voting statistics (min, max, average, median, distribution)
- 🔒 Private voting until reveal
- 📝 Story/task description support
- 🔄 Reset and start new rounds

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Use

1. **Create or Join a Room**
   - Enter your name
   - Click "Create New Room" to start a new session
   - Or enter a room ID and click "Join Room" to join an existing session

2. **Estimate**
   - Enter or update the user story/task description
   - Select your estimate from the Planning Poker cards
   - Wait for all participants to vote

3. **Reveal Results**
   - Click "Reveal Votes" to show everyone's estimates
   - View statistics and vote distribution
   - Discuss any discrepancies

4. **Start New Round**
   - Click "Reset & Start New Round" to clear votes and estimate the next story

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Socket.io** - Real-time WebSocket communication
- **Tailwind CSS** - Styling
- **React Hooks** - State management

## Project Structure

```
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page (room creation/joining)
│   └── room/
│       └── [roomId]/
│           └── page.tsx     # Room page with voting interface
├── components/
│   ├── PokerCard.tsx        # Individual voting card component
│   ├── UserList.tsx         # Participant list sidebar
│   ├── ResultsDisplay.tsx   # Voting results and statistics
│   └── RoomControls.tsx     # Reveal/Reset controls
├── server.js                # Custom Next.js server with Socket.io
└── package.json
```

## Environment Variables

Optional: Create a `.env.local` file to customize:

```
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
PORT=3000
```

## Deployment

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for detailed deployment instructions.

### Quick Deploy (Recommended: Railway)

1. Push your code to GitHub
2. Go to [railway.app](https://railway.app) and sign up
3. Click "New Project" → "Deploy from GitHub repo"
4. Select this repository
5. Railway will automatically deploy your app!

Your app will be live at a URL like: `https://your-app-name.up.railway.app`

### Build for Production (Local Testing)

```bash
npm run build
npm start
```

### Supported Platforms

- ✅ **Railway** (Recommended - easiest, free tier)
- ✅ **Render** (Free tier available)
- ✅ **Fly.io** (Good free tier)
- ⚠️ **Vercel/Netlify** (Requires separate Socket.io server - see DEPLOYMENT.md)

## License

MIT
