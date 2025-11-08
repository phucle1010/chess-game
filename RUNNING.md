# How to Run the Chess Game Project

This guide explains how to run both the Next.js client and Socket.io server together.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
PORT=3000
```

### 3. Set Up Database

Run the SQL migration in `lib/supabase/migrations.sql` in your Supabase SQL Editor.

### 4. Run the Application

```bash
npm run dev
```

This single command starts:

- ✅ Next.js development server
- ✅ Socket.io server (integrated)
- ✅ Both running on `http://localhost:3000`

## How It Works

The project uses a **custom Next.js server** (`server/index.ts`) that:

1. Creates an HTTP server
2. Initializes Next.js app
3. Attaches Socket.io to the same HTTP server
4. Handles both Next.js routes and Socket.io connections

This means:

- Next.js pages work normally at `http://localhost:3000`
- Socket.io connections work at `http://localhost:3000/api/socket`
- Both share the same port and server instance

## Architecture

```
┌─────────────────────────────────────┐
│     HTTP Server (Port 3000)         │
├─────────────────────────────────────┤
│  Next.js App Router                 │
│  - Pages (/game, /rooms, etc.)      │
│  - API Routes (/api/games, etc.)   │
├─────────────────────────────────────┤
│  Socket.io Server                   │
│  - Real-time game moves              │
│  - Real-time chat                    │
│  - Room updates                      │
└─────────────────────────────────────┘
```

## Scripts Explained

| Script             | Description                                         |
| ------------------ | --------------------------------------------------- |
| `npm run dev`      | **Recommended** - Runs Next.js + Socket.io together |
| `npm run dev:next` | Next.js only (Socket.io won't work)                 |
| `npm run build`    | Builds Next.js for production                       |
| `npm start`        | Runs production server (Next.js + Socket.io)        |

## Troubleshooting

### Port Already in Use

If port 3000 is already in use:

```bash
PORT=3001 npm run dev
```

Update `.env.local`:

```env
PORT=3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

### Socket.io Not Connecting

1. Make sure you're using `npm run dev` (not `npm run dev:next`)
2. Check that `NEXT_PUBLIC_SOCKET_URL` matches your server URL
3. Verify the server is running and you see: `> Socket.io ready on http://localhost:3000/api/socket`

### TypeScript Errors in Server Files

The server uses `tsx` to run TypeScript directly. If you see errors:

- Make sure `tsx` is installed: `npm install tsx --save-dev`
- Check that `server/tsconfig.json` exists

## Production Deployment

For production, you have two options:

### Option 1: Single Server (Recommended)

```bash
npm run build
npm start
```

This runs both Next.js and Socket.io on the same server.

### Option 2: Separate Servers

If you need to scale Socket.io separately:

1. Deploy Next.js to Vercel/Netlify
2. Deploy Socket.io server separately (e.g., Railway, Render, or your own server)
3. Update `NEXT_PUBLIC_SOCKET_URL` to point to your Socket.io server

## Development Tips

- The server auto-reloads on file changes (thanks to Next.js)
- Socket.io connections persist across hot reloads
- Use browser DevTools to see Socket.io connection status
- Check server console for Socket.io connection logs

## Verification

After running `npm run dev`, you should see:

```
> Next.js ready on http://localhost:3000
> Socket.io ready on http://localhost:3000/api/socket
```

Open `http://localhost:3000` in your browser and check the console for Socket.io connection status.
