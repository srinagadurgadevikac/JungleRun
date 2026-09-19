'use client'

interface PauseMenuProps {
  onResume: () => void
  onQuit: () => void
}

export function PauseMenu({ onResume, onQuit }: PauseMenuProps) {
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl p-8 w-full max-w-sm border-4 border-amber-600 text-center">
        <h2 className="text-4xl font-bold text-amber-100 mb-8">PAUSED</h2>

        <div className="flex flex-col gap-4">
          <button
            onClick={onResume}
            className="py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-lg text-lg transition-all"
          >
            RESUME GAME
          </button>

          <button
            onClick={onQuit}
            className="py-4 px-6 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-lg transition-all"
          >
            QUIT TO MENU
          </button>
        </div>

        <p className="text-gray-400 text-sm mt-6">Use arrow keys or swipe to move</p>
      </div>
    </div>
  )
}
