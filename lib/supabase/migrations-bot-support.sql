-- Migration: Add bot support to existing database
-- Run this if you already have the tables created

-- Add bot columns to rooms table
ALTER TABLE rooms 
  ADD COLUMN IF NOT EXISTS is_bot_room BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS bot_difficulty TEXT CHECK (bot_difficulty IN ('easy', 'medium', 'hard'));

-- Add bot columns to games table
ALTER TABLE games 
  ADD COLUMN IF NOT EXISTS is_bot_game BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS bot_difficulty TEXT CHECK (bot_difficulty IN ('easy', 'medium', 'hard')),
  ADD COLUMN IF NOT EXISTS bot_color TEXT CHECK (bot_color IN ('white', 'black'));

