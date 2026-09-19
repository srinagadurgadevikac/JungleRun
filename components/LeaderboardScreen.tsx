'use client'

interface LeaderboardEntry {
  id: string
  rank: number
  name: string
  high_score: number
  total_coins: number
}

interface LeaderboardScreenProps {
  entries: LeaderboardEntry[]
  onBack: () => void
  isLoading?: boolean
}

export function LeaderboardScreen({ entries, onBack, isLoading = false }: LeaderboardScreenProps) {
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 px-4">
      <div className="bg-gray-900 rounded-xl p-8 w-full max-w-md border-4 border-amber-600 max-h-96 overflow-y-auto">
        <h2 className="text-3xl font-bold text-amber-100 mb-6 text-center">🏆 LEADERBOARD</h2>

        {entries.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <p>No scores yet. Be the first to play!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className={`p-4 rounded-lg flex items-center justify-between ${
                  entry.rank === 1
                    ? 'bg-gradient-to-r from-yellow-600 to-amber-600 border-2 border-yellow-400'
                    : entry.rank === 2
                      ? 'bg-gradient-to-r from-gray-400 to-gray-500 border-2 border-gray-300'
                      : entry.rank === 3
                        ? 'bg-gradient-to-r from-orange-700 to-orange-800 border-2 border-orange-500'
                        : 'bg-gray-800 border border-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-white min-w-8">
                    {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : entry.rank}
                  </span>
                  <div>
                    <p className="font-bold text-white">{entry.name}</p>
                    <p className="text-xs text-gray-200 opacity-75">🪙 {entry.total_coins}</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-white">{entry.high_score}</span>
              </div>
            ))}
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
