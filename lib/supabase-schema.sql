-- Run this SQL in Supabase SQL Editor.
-- Enable Google in Authentication > Providers > Google and add your OAuth client details.

-- Create players table
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  high_score INTEGER DEFAULT 0,
  total_coins BIGINT DEFAULT 0,
  games_played INTEGER DEFAULT 0,
  total_distance BIGINT DEFAULT 0,
  avatar_url TEXT
);

-- Create game sessions table
CREATE TABLE IF NOT EXISTS game_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  score INTEGER DEFAULT 0,
  coins_collected INTEGER DEFAULT 0,
  distance_traveled BIGINT DEFAULT 0,
  game_duration_seconds INTEGER DEFAULT 0,
  obstacles_avoided INTEGER DEFAULT 0,
  death_reason TEXT,
  completed BOOLEAN DEFAULT FALSE
);

-- Create leaderboard view
CREATE VIEW public.leaderboard AS
SELECT 
  p.id,
  p.name,
  p.high_score,
  p.total_coins,
  p.games_played,
  p.total_distance,
  ROW_NUMBER() OVER (ORDER BY p.high_score DESC) as rank
FROM players p
WHERE p.high_score > 0
ORDER BY p.high_score DESC
LIMIT 100;

-- Enable Row Level Security
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;

-- Policies for players table
CREATE POLICY "Public can read leaderboard players" ON players
  FOR SELECT TO anon, authenticated USING (TRUE);

CREATE POLICY "Users can create their own player" ON players
  FOR INSERT TO authenticated WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "Users can update their own player" ON players
  FOR UPDATE TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

-- Policies for game_sessions table
CREATE POLICY "Users can read their own sessions" ON game_sessions
  FOR SELECT TO authenticated USING ((select auth.uid()) = player_id);

CREATE POLICY "Users can create their own sessions" ON game_sessions
  FOR INSERT TO authenticated WITH CHECK ((select auth.uid()) = player_id);

-- Create indexes for performance
CREATE INDEX idx_players_high_score ON players(high_score DESC);
CREATE INDEX idx_game_sessions_player_id ON game_sessions(player_id);
CREATE INDEX idx_game_sessions_created_at ON game_sessions(created_at DESC);
