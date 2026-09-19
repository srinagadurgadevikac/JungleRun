'use client'

import { calculateDistance, formatTime } from '@/lib/game-utils'

interface GameOverScreenProps {
  score: number
  coins: number
  distance: number
  time: number
  deathReason: string
  isNewHighScore: boolean
  onRestart: () => void
  onMenu: () => void
  isLoading?: boolean
}

export function GameOverScreen({
  score,
  coins,
  distance,
  time,
  deathReason,
  isNewHighScore,
  onRestart,
  onMenu,
  isLoading = false,
}: GameOverScreenProps) {
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 px-4">
      <div className="bg-gray-900 rounded-xl p-8 w-full max-w-sm border-4 border-red-600 text-center">
        {/* Death message */}
        <div className="mb-6">
          <div className="text-4xl mb-3">💀</div>
          <h2 className="text-3xl font-bold text-red-500 mb-2">GAME OVER</h2>
          <p className="text-gray-300">{deathReason}</p>
        </div>

        {/* High score banner */}
        {isNewHighScore && (
          <div className="mb-6 p-4 bg-gradient-to-r from-yellow-600 to-amber-600 rounded-lg border-2 border-yellow-400">
            <p className="text-yellow-100 font-bold text-lg">🏆 NEW HIGH SCORE! 🏆</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8 p-4 bg-gray-800 rounded-lg">
          <div>
            <p className="text-gray-400 text-sm">SCORE</p>
            <p className="text-2xl font-bold text-amber-400">{score}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">COINS</p>
            <p className="text-2xl font-bold text-amber-400">{coins}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">DISTANCE</p>
            <p className="text-2xl font-bold text-emerald-400">{calculateDistance(distance)}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">TIME</p>
            <p className="text-2xl font-bold text-blue-400">{formatTime(time)}</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onRestart}
            disabled={isLoading}
            className="flex-1 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 disabled:opacity-50 text-white font-bold rounded-lg transition-all"
          >
            {isLoading ? 'Loading...' : 'RESTART'}
          </button>
          <button
            onClick={onMenu}
            disabled={isLoading}
            className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white font-bold rounded-lg transition-all"
          >
            MENU
          </button>
        </div>
      </div>
    </div>
  )
}
