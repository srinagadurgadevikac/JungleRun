'use client'

import { calculateDistance } from '@/lib/game-utils'

interface GameSessionData {
  score: number
  coins_collected: number
  distance_traveled: number
  game_duration_seconds: number
}

interface StatsScreenProps {
  playerName: string
  stats: {
    highScore: number
    totalCoins: number
    gamesPlayed: number
    totalDistance: number
  }
  recentSessions: GameSessionData[]
  onBack: () => void
  isLoading?: boolean
}

export function StatsScreen({ playerName, stats, recentSessions, onBack, isLoading = false }: StatsScreenProps) {
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 px-4">
      <div className="bg-gray-900 rounded-xl p-8 w-full max-w-md border-4 border-blue-600 max-h-96 overflow-y-auto">
        <h2 className="text-3xl font-bold text-blue-100 mb-6 text-center">📊 {playerName}&apos;s STATS</h2>

        {/* Overall stats */}
        <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-800 rounded-lg">
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">HIGH SCORE</p>
            <p className="text-2xl font-bold text-amber-400">{stats.highScore}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">TOTAL COINS</p>
            <p className="text-2xl font-bold text-yellow-400">{stats.totalCoins}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">GAMES PLAYED</p>
            <p className="text-2xl font-bold text-green-400">{stats.gamesPlayed}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">TOTAL DISTANCE</p>
            <p className="text-2xl font-bold text-blue-400">{calculateDistance(stats.totalDistance)}</p>
          </div>
        </div>

        {/* Recent sessions */}
        {recentSessions.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-gray-300 mb-3">Recent Sessions</h3>
            <div className="space-y-2">
              {recentSessions.map((session, idx) => (
                <div key={idx} className="p-3 bg-gray-800 rounded border border-gray-700 text-sm">
                  <p className="font-semibold text-white mb-1">Score: {session.score}</p>
                  <p className="text-gray-400">
                    🪙 {session.coins_collected} • 📏 {calculateDistance(session.distance_traveled)} • ⏱️{' '}
                    {session.game_duration_seconds}s
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onBack}
          disabled={isLoading}
          className="w-full mt-6 py-3 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white font-bold rounded-lg transition-all"
        >
          BACK
        </button>
      </div>
    </div>
  )
}
