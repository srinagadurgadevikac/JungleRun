'use client'

import { useState } from 'react'

interface IntroOverlayProps {
  onStart: (playerName: string) => void
  onGoogleSignIn: () => void
  onGuestStart: () => void
  isLoading?: boolean
  authLoading?: boolean
  authError?: string
}

export function IntroOverlay({ onStart, onGoogleSignIn, onGuestStart, isLoading = false, authLoading = false, authError = '' }: IntroOverlayProps) {
  const [playerName, setPlayerName] = useState('')
  const [showVideo, setShowVideo] = useState(true)

  const handleStart = () => {
    if (playerName.trim()) {
      onStart(playerName)
    }
  }

  if (showVideo) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
        <div className="w-full h-full bg-gradient-to-b from-gray-900 via-gray-800 to-black flex flex-col items-center justify-center px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-amber-100 mb-4">JUNGLE RUN</h1>
            <p className="text-gray-300 text-lg">An Endless Runner Adventure</p>
          </div>

          {/* Video simulation - showing a scene description */}
          <div className="w-full max-w-md aspect-video bg-gradient-to-b from-emerald-900 to-gray-900 rounded-lg overflow-hidden mb-8 border-4 border-amber-700">
            <div className="w-full h-full flex flex-col items-center justify-center relative">
              {/* Forest background */}
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-700 via-emerald-900 to-gray-900 opacity-80"></div>
              
              {/* Animated trees */}
              <div className="absolute inset-0 flex items-end justify-between px-4 opacity-60">
                <div className="text-5xl">🌳</div>
                <div className="text-6xl">🌴</div>
                <div className="text-5xl">🌳</div>
              </div>

              {/* Scene text */}
              <div className="relative z-10 text-center">
                <div className="text-6xl mb-4">🦁</div>
                <p className="text-amber-100 font-bold text-lg">A MOTHER LION SPOTTED YOU!</p>
                <p className="text-emerald-200 text-sm mt-2">GET READY TO RUN FOR YOUR LIFE!</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowVideo(false)}
            className="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors"
          >
            START GAME
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
      <div className="bg-gray-900 rounded-lg p-8 w-full max-w-sm border-2 border-amber-600">
        <h2 className="text-2xl font-bold text-amber-100 mb-2 text-center">Choose how to play</h2>
        <p className="text-sm text-gray-400 text-center mb-6">Sign in to save your score across devices, or play as a guest.</p>

        <button
          onClick={onGoogleSignIn}
          disabled={authLoading || isLoading}
          className="w-full py-3 mb-4 bg-white hover:bg-gray-100 disabled:opacity-50 text-gray-900 font-bold rounded-lg transition-colors"
        >
          {authLoading ? 'Connecting to Google...' : 'Continue with Google'}
        </button>

        <div className="flex items-center gap-3 mb-4 text-gray-500 text-xs uppercase tracking-wider">
          <span className="h-px bg-gray-700 flex-1" /> or guest mode <span className="h-px bg-gray-700 flex-1" />
        </div>

        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleStart()}
          placeholder="Your name here..."
          maxLength={20}
          disabled={isLoading}
          className="w-full px-4 py-3 bg-gray-800 text-white border-2 border-gray-600 rounded-lg focus:border-amber-500 focus:outline-none mb-6 placeholder-gray-500"
        />

        <button
          onClick={handleStart}
          disabled={!playerName.trim() || isLoading}
          className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 disabled:opacity-50 text-white font-bold rounded-lg transition-all"
        >
          {isLoading ? 'Starting...' : 'START GUEST RUN'}
        </button>
        {authError && <p className="mt-4 text-center text-sm text-red-300" role="alert">{authError}</p>}
        <button
          onClick={() => onStart('Guest Runner')}
          disabled={isLoading || authLoading}
          className="w-full mt-3 py-2 text-gray-400 hover:text-amber-200 text-sm transition-colors"
        >
          Play as guest without saving
        </button>
      </div>
    </div>
  )
}
