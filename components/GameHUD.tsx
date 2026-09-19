'use client'

import { calculateDistance, formatTime } from '@/lib/game-utils'

interface GameHUDProps {
  score: number
  coins: number
  distance: number
  time: number
  speed: number
  isPaused: boolean
  onPause: () => void
}

export function GameHUD({ score, coins, distance, time, speed, isPaused, onPause }: GameHUDProps) {
  return (
    <div className="absolute top-0 left-0 right-0 z-40 bg-gradient-to-b from-black/80 to-transparent p-4 text-white">
      <div className="flex justify-between items-start mb-3">
        {/* Left stats */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎯</span>
            <span className="text-lg font-bold">{score}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🪙</span>
            <span className="text-lg font-bold">{coins}</span>
          </div>
        </div>

        {/* Center - Distance and time */}
        <div className="text-center">
          <div className="text-2xl font-bold text-amber-400">{calculateDistance(distance)}</div>
          <div className="text-sm text-gray-300">{formatTime(time)}</div>
        </div>

        {/* Right - Pause button */}
        <button
          onClick={onPause}
          className={`px-3 py-2 rounded-lg font-bold transition-colors ${
            isPaused
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          {isPaused ? 'RESUME' : 'PAUSE'}
        </button>
      </div>

      {/* Speed indicator */}
      <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
        <span>SPEED:</span>
        <div className="w-24 h-1 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all"
            style={{ width: `${Math.min(speed * 33, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}
