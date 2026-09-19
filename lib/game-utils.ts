import { GAME_CONFIG, LANES } from './game-constants'

export function getRandomLane(): number {
  return Math.floor(Math.random() * GAME_CONFIG.LANE_COUNT)
}

export function getRandomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

export function calculateLanePosition(lane: number, viewport: { width: number; height: number }): number {
  const laneWidth = viewport.width / GAME_CONFIG.LANE_COUNT
  return (lane * laneWidth) + (laneWidth - GAME_CONFIG.PLAYER_WIDTH) / 2
}

export function getDeviceType(width: number): 'mobile' | 'tablet' | 'desktop' {
  if (width < 640) return 'mobile'
  if (width < 1024) return 'tablet'
  return 'desktop'
}

export function calculateDistance(distance: number): string {
  if (distance < 1000) {
    return `${Math.floor(distance)}m`
  }
  return `${(distance / 1000).toFixed(2)}km`
}

export function calculateScore(baseDistance: number, coinsCollected: number, obstaclesAvoided: number): number {
  return Math.floor(baseDistance / 10) + (coinsCollected * GAME_CONFIG.COIN_VALUE) + (obstaclesAvoided * 5)
}

export function checkCollision(
  rect1: { x: number; y: number; width: number; height: number },
  rect2: { x: number; y: number; width: number; height: number }
): boolean {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  )
}

export function getNextGameSpeed(currentSpeed: number, speedMultiplier: number): number {
  return Math.min(currentSpeed + GAME_CONFIG.BASE_SPEED_INCREMENT, GAME_CONFIG.MAX_SPEED_MULTIPLIER)
}

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

export function getLionPosition(distance: number): number {
  // Lion gets closer as distance increases
  const maxDistance = 500
  const closestDistance = 120
  return Math.max(closestDistance, maxDistance - distance / 5)
}

export function getGameDifficulty(distance: number): 'easy' | 'normal' | 'hard' | 'extreme' {
  if (distance < 1000) return 'easy'
  if (distance < 3000) return 'normal'
  if (distance < 6000) return 'hard'
  return 'extreme'
}
