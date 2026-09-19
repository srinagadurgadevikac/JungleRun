'use client'

interface MenuScreenProps {
  playerName: string
  playerStats?: {
    highScore: number
    totalCoins: number
    gamesPlayed: number
  }
  onPlay: () => void
  onLeaderboard: () => void
  onStats: () => void
  isLoading?: boolean
}

export function MenuScreen({
  playerName,
  playerStats,
  onPlay,
  onLeaderboard,
  onStats,
  isLoading = false,
}: MenuScreenProps) {
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-black flex flex-col items-center justify-center z-50 px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-bold text-amber-100 mb-2">JUNGLE RUN</h1>
        <p className="text-emerald-300 text-lg font-semibold">Endless Runner Adventure</p>
      </div>

      {/* Welcome message */}
      <div className="text-center mb-8">
        <p className="text-2xl text-amber-200 font-bold mb-2">Welcome, {playerName}!</p>
        {playerStats && (
          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-800/50 rounded-lg border border-amber-700">
            <div>
              <p className="text-gray-400 text-sm">HIGH SCORE</p>
              <p className="text-2xl font-bold text-amber-400">{playerStats.highScore}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">TOTAL COINS</p>
              <p className="text-2xl font-bold text-amber-400">{playerStats.totalCoins}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">GAMES</p>
              <p className="text-2xl font-bold text-amber-400">{playerStats.gamesPlayed}</p>
            </div>
          </div>
        )}
      </div>

      {/* Main menu buttons */}
      <div className="w-full max-w-sm space-y-4 mb-8">
        <button
          onClick={onPlay}
          disabled={isLoading}
          className="w-full py-4 px-6 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 disabled:opacity-50 text-white font-bold rounded-lg text-lg transition-all transform hover:scale-105"
        >
          {isLoading ? 'STARTING...' : 'PLAY'}
        </button>

        <button
          onClick={onLeaderboard}
          disabled={isLoading}
          className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-50 text-white font-bold rounded-lg text-lg transition-all"
        >
          LEADERBOARD
        </button>

        <button
          onClick={onStats}
          disabled={isLoading}
          className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 text-white font-bold rounded-lg text-lg transition-all"
        >
          MY STATS
        </button>
      </div>

      {/* Instructions */}
      <div className="w-full max-w-sm text-center text-gray-400 text-sm">
        <p className="mb-2">🎮 <strong>CONTROLS</strong></p>
        <p>← → Arrow Keys or Swipe to move</p>
        <p>Collect coins 🪙 and avoid obstacles 🌳</p>
        <p>Escape the lion 🦁 for as long as possible!</p>
      </div>
    </div>
  )
}
