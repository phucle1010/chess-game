# Chess Game Setup Guide

This is a comprehensive chess game application built with Next.js, Supabase, React Query, and Socket.io.

## Features

- ✅ User authentication (register, login, reset password) with Supabase
- ✅ Real-time multiplayer chess games
- ✅ Room-based game system
- ✅ Real-time chat with Socket.io
- ✅ React Query for data fetching and mutations
- ✅ Socket.io for real-time game updates and chat
- ✅ Chess game logic with chess.js
- ✅ User ratings and statistics
- ✅ Leaderboard system

## Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- Supabase account and project

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to SQL Editor in your Supabase dashboard
3. Run the SQL migration file: `lib/supabase/migrations.sql`
4. Copy your Supabase URL and anon key from Settings > API

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── game/              # Game page
│   ├── rooms/              # Rooms page
│   └── layout.tsx         # Root layout with React Query provider
├── actions/                # React Query hooks
│   ├── useAuth.ts         # Authentication hooks
│   ├── useGames.ts        # Game-related hooks
│   ├── useRooms.ts        # Room-related hooks
│   ├── useChat.ts         # Chat hooks
│   └── useUsers.ts        # User hooks
├── components/            # React components
│   ├── game/              # Game-specific components
│   ├── modals/            # Modal components
│   └── ui/                # UI components (shadcn/ui)
├── hooks/                 # Custom React hooks
│   ├── useGameState.ts    # Game state management
│   ├── useChatSocket.ts   # Chat socket integration
│   └── useRoomSocket.ts   # Room socket integration
├── lib/                   # Library configurations
│   ├── supabase/          # Supabase client setup
│   ├── react-query/       # React Query provider
│   └── socket/            # Socket.io client
├── services/              # API service functions
│   ├── auth.service.ts    # Authentication service
│   ├── game.service.ts    # Game service
│   ├── room.service.ts    # Room service
│   ├── chat.service.ts    # Chat service
│   └── user.service.ts    # User service
├── types/                 # TypeScript type definitions
└── server/                # Socket.io server setup
```

## Database Schema

The application uses the following Supabase tables:

- `users` - User profiles and statistics
- `rooms` - Game rooms
- `room_players` - Players in rooms
- `games` - Chess games
- `chat_messages` - Chat messages

See `lib/supabase/migrations.sql` for the complete schema.

## Socket.io Setup

The Socket.io server is configured in `server/socket.ts`. For production, you may need to run a separate Socket.io server or use a service like Socket.io Cloud.

## Authentication Flow

1. Users register/login through Supabase Auth
2. User profile is created in the `users` table
3. JWT tokens are managed by Supabase
4. React Query hooks handle authentication state

## Game Flow

1. User creates or joins a room
2. When 2 players are in a room, a game is automatically created
3. Moves are synchronized via Socket.io
4. Game state is persisted in Supabase
5. Chat messages are sent via Socket.io

## API Routes

- `GET /api/games` - Get games
- `POST /api/games` - Create game
- `PATCH /api/games` - Update game
- `GET /api/rooms` - Get rooms
- `POST /api/rooms` - Create room
- `POST /api/rooms/[roomId]/join` - Join room
- `POST /api/rooms/[roomId]/leave` - Leave room
- `GET /api/chat/[roomId]` - Get chat messages
- `POST /api/chat/[roomId]` - Send chat message

## Running the Application

### Development Mode (Recommended)

The application runs both Next.js and Socket.io server together:

```bash
npm run dev
```

This will start:

- Next.js development server on `http://localhost:3000`
- Socket.io server integrated with the same server

### Alternative: Run Separately (Not Recommended)

If you need to run them separately (for debugging):

```bash
# Terminal 1: Next.js only (no Socket.io)
npm run dev:next

# Terminal 2: Socket.io only (won't work without Next.js)
npm run dev:socket
```

**Note:** The recommended approach is `npm run dev` which runs both together.

### Production Mode

```bash
# Build the application
npm run build

# Start production server (with Socket.io)
npm start
```

## Development Scripts

```bash
# Run development server (Next.js + Socket.io)
npm run dev

# Run Next.js only (no Socket.io)
npm run dev:next

# Build for production
npm run build

# Start production server (Next.js + Socket.io)
npm start

# Start Next.js production server only
npm start:next

# Lint code
npm run lint

# Format code
npm run format
```

## Notes

- The Socket.io server needs to be running for real-time features
- Make sure Supabase RLS policies are set up correctly
- Environment variables must be set for the app to work
- The chess board component may need updates to support FEN notation for initial board state
