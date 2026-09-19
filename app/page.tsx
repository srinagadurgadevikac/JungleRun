'use client'

import { useCallback, useEffect, useState } from 'react'
import { IntroOverlay } from '@/components/IntroOverlay'
import { MenuScreen } from '@/components/MenuScreen'
import { GameCanvas, type GameStats } from '@/components/GameCanvas'
import { GameHUD } from '@/components/GameHUD'
import { GameOverScreen } from '@/components/GameOverScreen'
import { PauseMenu } from '@/components/PauseMenu'
import { LeaderboardScreen } from '@/components/LeaderboardScreen'
import { StatsScreen } from '@/components/StatsScreen'
import {
  createGameSession,
  getCurrentAuthUser,
  getLeaderboard,
  getOrCreatePlayer,
  getOrCreatePlayerForUser,
  getPlayerSessions,
  getPlayerStats,
  getSupabase,
  isSupabaseConfigured,
  signInWithGoogle,
  updatePlayerStats,
  type GameSession,
  type Player,
} from '@/lib/supabase-client'

const EMPTY_STATS = { highScore: 0, totalCoins: 0, gamesPlayed: 0, totalDistance: 0 }
const GUEST_KEY = 'jungle-run-guest-stats'
type Screen = 'intro' | 'menu' | 'playing' | 'paused' | 'gameOver' | 'leaderboard' | 'stats'

function readGuestStats() {
  try { return { ...EMPTY_STATS, ...JSON.parse(localStorage.getItem(GUEST_KEY) || '{}') } } catch { return EMPTY_STATS }
}
function saveGuestStats(stats: typeof EMPTY_STATS) { localStorage.setItem(GUEST_KEY, JSON.stringify(stats)) }

export default function Page() {
  const [screen, setScreen] = useState<Screen>('intro')
  const [player, setPlayer] = useState<Player | null>(null)
  const [isGuest, setIsGuest] = useState(false)
  const [playerStats, setPlayerStats] = useState(EMPTY_STATS)
  const [recentSessions, setRecentSessions] = useState<GameSession[]>([])
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [lastStats, setLastStats] = useState<GameStats | null>(null)
  const [deathReason, setDeathReason] = useState('')
  const [isNewHighScore, setIsNewHighScore] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)
  const [error, setError] = useState('')

  const refreshPlayerData = useCallback(async (playerId: string) => {
    const [stats, sessions] = await Promise.all([getPlayerStats(playerId), getPlayerSessions(playerId)])
    setPlayerStats({ highScore: stats.high_score, totalCoins: stats.total_coins, gamesPlayed: stats.games_played, totalDistance: stats.total_distance })
    setRecentSessions(sessions)
  }, [])

  const startGuest = (name = 'Guest Runner') => {
    const guestStats = readGuestStats()
    setIsGuest(true)
    setPlayer({ id: 'guest', name, high_score: guestStats.highScore, total_coins: guestStats.totalCoins, games_played: guestStats.gamesPlayed, total_distance: guestStats.totalDistance, created_at: new Date().toISOString() })
    setPlayerStats(guestStats)
    setScreen('menu')
  }

  const handleGoogleSignIn = async () => {
    setAuthLoading(true); setError('')
    try { await signInWithGoogle() } catch (err) { setError('Google sign-in could not start. Check the Supabase Google provider setup.'); console.error('[v0] Google sign-in failed:', err); setAuthLoading(false) }
  }

  const handleStart = async (name: string) => {
    if (name === 'Guest Runner') return startGuest(name)
    setIsLoading(true); setError('')
    try { const nextPlayer = await getOrCreatePlayer(name.trim()); setPlayer(nextPlayer); setIsGuest(false); await refreshPlayerData(nextPlayer.id); setScreen('menu') }
    catch (err) { setError('Sign in with Google to save scores, or use guest mode.'); console.error('[v0] Player creation failed:', err) }
    finally { setIsLoading(false) }
  }

  useEffect(() => {
    let active = true
    if (!isSupabaseConfigured) {
      return () => { active = false }
    }

    getCurrentAuthUser().then(async (user) => {
      if (!active || !user) return
      try { const nextPlayer = await getOrCreatePlayerForUser(user); setPlayer(nextPlayer); setIsGuest(false); await refreshPlayerData(nextPlayer.id); setScreen('menu') }
      catch (err) { console.error('[v0] Authenticated player setup failed:', err) }
    }).catch((err) => console.error('[v0] Auth session check failed:', err))
    const { data } = getSupabase().auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') { setPlayer(null); setScreen('intro') }
      if (event === 'SIGNED_IN' && session?.user) window.location.reload()
    })
    return () => { active = false; data.subscription.unsubscribe() }
  }, [refreshPlayerData])

  const handleGameOver = useCallback(async (reason: string, stats: GameStats) => {
    if (!player) return
    setLastStats(stats); setDeathReason(reason); setIsNewHighScore(stats.score > playerStats.highScore); setScreen('gameOver')
    if (isGuest) {
      const next = { highScore: Math.max(playerStats.highScore, stats.score), totalCoins: playerStats.totalCoins + stats.coins, gamesPlayed: playerStats.gamesPlayed + 1, totalDistance: playerStats.totalDistance + stats.distance }
      saveGuestStats(next); setPlayerStats(next); setPlayer({ ...player, high_score: next.highScore, total_coins: next.totalCoins, games_played: next.gamesPlayed, total_distance: next.totalDistance }); return
    }
    try { await Promise.all([createGameSession(player.id, stats.score, stats.coins, stats.distance, stats.time, stats.obstaclesAvoided, reason), updatePlayerStats(player.id, stats.score, stats.coins, stats.distance)]); await refreshPlayerData(player.id) }
    catch (err) { console.error('[v0] Could not save game session:', err); setError('Your run ended, but the score could not be saved.') }
  }, [player, playerStats, isGuest, refreshPlayerData])

  const openLeaderboard = async () => { setIsLoading(true); try { setLeaderboard(await getLeaderboard()); setScreen('leaderboard') } catch (err) { setError('Leaderboard is unavailable until the Supabase schema is installed.'); console.error('[v0] Leaderboard failed:', err) } finally { setIsLoading(false) } }
  useEffect(() => { if (!error) return; const timer = window.setTimeout(() => setError(''), 5000); return () => window.clearTimeout(timer) }, [error])
  const gameStats = lastStats || { score: 0, coins: 0, distance: 0, time: 0, obstaclesAvoided: 0 }

  return <main className="jungle-app"><div className="jungle-frame"><div className="jungle-brand">JUNGLE <span>RUN</span></div><div className="jungle-frame__caption">A survival sprint through the wild</div><div className="game-stage">
    {screen === 'playing' && <><GameCanvas isActive isPaused={false} onGameOver={handleGameOver} /><GameHUD score={gameStats.score} coins={gameStats.coins} distance={gameStats.distance} time={gameStats.time} speed={1} isPaused={false} onPause={() => setScreen('paused')} /></>}
    {screen === 'paused' && <><GameCanvas isActive isPaused onGameOver={handleGameOver} /><PauseMenu onResume={() => setScreen('playing')} onQuit={() => setScreen('menu')} /></>}
  </div></div>
    {screen === 'intro' && <IntroOverlay onStart={handleStart} onGoogleSignIn={handleGoogleSignIn} onGuestStart={() => startGuest()} isLoading={isLoading} authLoading={authLoading} authError={error} />}
    {screen === 'menu' && player && <MenuScreen playerName={player.name} playerStats={playerStats} onPlay={() => setScreen('playing')} onLeaderboard={openLeaderboard} onStats={() => setScreen('stats')} isLoading={isLoading} />}
    {screen === 'gameOver' && <GameOverScreen {...gameStats} deathReason={deathReason} isNewHighScore={isNewHighScore} onRestart={() => setScreen('playing')} onMenu={() => setScreen('menu')} isLoading={isLoading} />}
    {screen === 'leaderboard' && <LeaderboardScreen entries={leaderboard} onBack={() => setScreen('menu')} isLoading={isLoading} />}
    {screen === 'stats' && player && <StatsScreen playerName={player.name} stats={playerStats} recentSessions={recentSessions} onBack={() => setScreen('menu')} isLoading={isLoading} />}
    {error && screen !== 'intro' && <div className="error-toast" role="alert">{error}</div>}
  </main>
}
