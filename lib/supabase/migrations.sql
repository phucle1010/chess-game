-- ============================================
-- Chess Game Database Schema
-- Includes support for bot games
-- ============================================

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  rating INTEGER DEFAULT 1200,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  draws INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create rooms table
-- Supports both regular multiplayer rooms and bot game rooms
CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  host_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  max_players INTEGER DEFAULT 2,
  current_players INTEGER DEFAULT 0,
  status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'finished')),
  game_id UUID,
  -- Bot game support
  is_bot_room BOOLEAN DEFAULT FALSE, -- TRUE if this is a bot game room
  bot_difficulty TEXT CHECK (bot_difficulty IN ('easy', 'medium', 'hard')), -- Bot difficulty level
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create room_players table
CREATE TABLE IF NOT EXISTS room_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  color TEXT CHECK (color IN ('white', 'black')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(room_id, user_id)
);

-- Create games table
-- Supports both regular multiplayer games and bot games
CREATE TABLE IF NOT EXISTS games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  white_player_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  black_player_id UUID REFERENCES users(id) ON DELETE SET NULL,
  current_turn TEXT DEFAULT 'white' CHECK (current_turn IN ('white', 'black')),
  status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'finished', 'abandoned')),
  winner_id UUID REFERENCES users(id) ON DELETE SET NULL,
  fen TEXT DEFAULT 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  pgn TEXT DEFAULT '',
  time_control INTEGER DEFAULT 600,
  white_time_remaining INTEGER DEFAULT 600,
  black_time_remaining INTEGER DEFAULT 600,
  -- Bot game support
  is_bot_game BOOLEAN DEFAULT FALSE, -- TRUE if this is a bot game
  bot_difficulty TEXT CHECK (bot_difficulty IN ('easy', 'medium', 'hard')), -- Bot difficulty level
  bot_color TEXT CHECK (bot_color IN ('white', 'black')), -- Which color the bot is playing
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_rooms_status ON rooms(status);
CREATE INDEX IF NOT EXISTS idx_room_players_room_id ON room_players(room_id);
CREATE INDEX IF NOT EXISTS idx_room_players_user_id ON room_players(user_id);
CREATE INDEX IF NOT EXISTS idx_games_room_id ON games(room_id);
CREATE INDEX IF NOT EXISTS idx_games_white_player_id ON games(white_player_id);
CREATE INDEX IF NOT EXISTS idx_games_black_player_id ON games(black_player_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_room_id ON chat_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view all profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for rooms
CREATE POLICY "Anyone can view rooms" ON rooms FOR SELECT USING (true);
CREATE POLICY "Users can create rooms" ON rooms FOR INSERT WITH CHECK (auth.uid() = host_id);
CREATE POLICY "Users can update own rooms" ON rooms FOR UPDATE USING (auth.uid() = host_id);
CREATE POLICY "Users can delete own rooms" ON rooms FOR DELETE USING (auth.uid() = host_id);

-- RLS Policies for room_players
CREATE POLICY "Anyone can view room players" ON room_players FOR SELECT USING (true);
CREATE POLICY "Users can join rooms" ON room_players FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave rooms" ON room_players FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for games
CREATE POLICY "Anyone can view games" ON games FOR SELECT USING (true);
CREATE POLICY "Users can create games" ON games FOR INSERT WITH CHECK (auth.uid() = white_player_id);
CREATE POLICY "Players can update their games" ON games FOR UPDATE USING (
  auth.uid() = white_player_id OR auth.uid() = black_player_id
);

-- RLS Policies for chat_messages
CREATE POLICY "Anyone can view chat messages" ON chat_messages FOR SELECT USING (true);
CREATE POLICY "Users can send messages" ON chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_games_updated_at BEFORE UPDATE ON games
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Bot Game Support
-- ============================================
-- This schema includes support for bot games:
-- 
-- Rooms:
--   - is_bot_room: Indicates if the room is for bot games
--   - bot_difficulty: Difficulty level ('easy', 'medium', 'hard')
--
-- Games:
--   - is_bot_game: Indicates if the game is against a bot
--   - bot_difficulty: Difficulty level of the bot
--   - bot_color: Which color the bot is playing ('white' or 'black')
--
-- Bot games start automatically when created (status = 'active')
-- and the bot makes moves automatically when it's their turn.
-- ============================================

