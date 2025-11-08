# Chess Game - Multiplayer Online Chess

A full-featured multiplayer chess game built with Next.js, Supabase, React Query, and Socket.io.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
PORT=3000
```

### 3. Set Up Database

Run `lib/supabase/migrations.sql` in your Supabase SQL Editor.

### 4. Run the Application

```bash
npm run dev
```

**That's it!** This single command runs both:

- ✅ Next.js client (pages, API routes)
- ✅ Socket.io server (real-time features)

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📚 Documentation

- **[RUNNING.md](./RUNNING.md)** - Detailed guide on running the project
- **[SETUP.md](./SETUP.md)** - Complete setup and configuration guide

## 🎮 Features

- ✅ User authentication (register, login, password reset)
- ✅ Real-time multiplayer chess games
- ✅ Room-based game system
- ✅ Real-time chat
- ✅ User ratings and statistics
- ✅ Leaderboard

## 🏗️ Architecture

The application uses a **custom Next.js server** that integrates:

- Next.js App Router for pages and API routes
- Socket.io for real-time communication
- Both running on the same HTTP server

## 📝 Available Scripts

| Command          | Description                                    |
| ---------------- | ---------------------------------------------- |
| `npm run dev`    | Start development server (Next.js + Socket.io) |
| `npm run build`  | Build for production                           |
| `npm start`      | Start production server                        |
| `npm run lint`   | Run ESLint                                     |
| `npm run format` | Format code with Prettier                      |

## 🔧 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **State Management:** React Query (@tanstack/react-query)
- **Real-time:** Socket.io
- **Chess Engine:** chess.js
- **UI:** shadcn/ui + Tailwind CSS
- **Type Safety:** TypeScript

## 📖 Project Structure

```
├── app/              # Next.js pages and API routes
├── actions/          # React Query hooks
├── services/         # API service functions
├── hooks/            # Custom React hooks
├── components/       # React components
├── lib/              # Configurations
├── server/           # Custom server with Socket.io
└── types/            # TypeScript types
```

## 🐛 Troubleshooting

See [RUNNING.md](./RUNNING.md) for detailed troubleshooting guide.

## 📄 License

Private project
