import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

let _supabaseClient: ReturnType<typeof createClient> | null = null

export function getSupabase() {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to the project environment variables.')
  }
  if (!_supabaseClient) {
    _supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  }
  return _supabaseClient
}

// Player type
export async function signInWithGoogle() {
  const { data, error } = await getSupabase().auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await getSupabase().auth.signOut()
  if (error) throw error
}

export async function getCurrentAuthUser() {
  const { data, error } = await getSupabase().auth.getUser()
  if (error && error.message !== 'Auth session missing!') throw error
  return data.user
}

export interface Player {
  id: string
  name: string
  email?: string
  high_score: number
  total_coins: number
  games_played: number
  total_distance: number
  avatar_url?: string
  created_at: string
}

// Game session type
export interface GameSession {
  id: string
  player_id: string
  score: number
  coins_collected: number
  distance_traveled: number
  game_duration_seconds: number
  obstacles_avoided: number
  death_reason?: string
  completed: boolean
  created_at: string
}

// API functions
export async function getOrCreatePlayerForUser(user: { id: string; email?: string; user_metadata?: Record<string, unknown> }): Promise<Player> {
  const { data: existingPlayer, error: lookupError } = await getSupabase().from('players').select('*').eq('id', user.id).maybeSingle()
  if (lookupError) throw lookupError
  if (existingPlayer) return existingPlayer

  const name = String(user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Runner').slice(0, 20)
  const { data: newPlayer, error } = await getSupabase().from('players').insert({
    id: user.id,
    name,
    email: user.email,
    avatar_url: typeof user.user_metadata?.avatar_url === 'string' ? user.user_metadata.avatar_url : undefined,
  }).select().single()
  if (error) throw error
  return newPlayer
}

export async function getOrCreatePlayer(name: string, email?: string): Promise<Player> {
  if (email) {
    const { data: existingPlayer } = await getSupabase()
      .from('players')
      .select('*')
      .eq('email', email)
      .single()

    if (existingPlayer) {
      return existingPlayer
    }
  }

  const { data: newPlayer, error } = await getSupabase()
    .from('players')
    .insert([{ name, email }])
    .select()
    .single()

  if (error) throw error
  return newPlayer
}

export async function updatePlayerStats(
  playerId: string,
  score: number,
  coinsCollected: number,
  distanceTraveled: number
): Promise<void> {
  const { data: currentPlayer } = await getSupabase()
    .from('players')
    .select('*')
    .eq('id', playerId)
    .single()

  if (!currentPlayer) throw new Error('Player not found')

  const newHighScore = Math.max(currentPlayer.high_score, score)

  await getSupabase()
    .from('players')
    .update({
      high_score: newHighScore,
      total_coins: currentPlayer.total_coins + coinsCollected,
      games_played: currentPlayer.games_played + 1,
      total_distance: currentPlayer.total_distance + distanceTraveled,
      updated_at: new Date().toISOString(),
    })
    .eq('id', playerId)
}

export async function createGameSession(
  playerId: string,
  score: number,
  coinsCollected: number,
  distanceTraveled: number,
  gameDurationSeconds: number,
  obstaclesAvoided: number,
  deathReason?: string
): Promise<GameSession> {
  const { data: session, error } = await getSupabase()
    .from('game_sessions')
    .insert([
      {
        player_id: playerId,
        score,
        coins_collected: coinsCollected,
        distance_traveled: distanceTraveled,
        game_duration_seconds: gameDurationSeconds,
        obstacles_avoided: obstaclesAvoided,
        death_reason: deathReason,
        completed: score > 0,
      },
    ])
    .select()
    .single()

  if (error) throw error
  return session
}

export async function getLeaderboard(): Promise<any[]> {
  const { data, error } = await getSupabase()
    .from('leaderboard')
    .select('*')
    .limit(20)

  if (error) throw error
  return data || []
}

export async function getPlayerStats(playerId: string): Promise<Player> {
  const { data, error } = await getSupabase()
    .from('players')
    .select('*')
    .eq('id', playerId)
    .single()

  if (error) throw error
  return data
}

export async function getPlayerSessions(playerId: string): Promise<GameSession[]> {
  const { data, error } = await getSupabase()
    .from('game_sessions')
    .select('*')
    .eq('player_id', playerId)
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) throw error
  return data || []
}
