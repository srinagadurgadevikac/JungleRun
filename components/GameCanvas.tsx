'use client'

import { useRef, useEffect, useState } from 'react'
import { GAME_CONFIG, LANES } from '@/lib/game-constants'
import {
  calculateLanePosition,
  checkCollision,
  getRandomLane,
  getRandomInRange,
  getNextGameSpeed,
  calculateScore,
  getLionPosition,
} from '@/lib/game-utils'

interface GameCanvasProps {
  isActive: boolean
  isPaused: boolean
  onGameOver: (deathReason: string, stats: GameStats) => void
}

export interface GameStats {
  score: number
  coins: number
  distance: number
  time: number
  obstaclesAvoided: number
}

interface GameObject {
  id: string
  x: number
  y: number
  type: 'obstacle' | 'coin'
  lane?: number
}

export function GameCanvas({ isActive, isPaused, onGameOver }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [currentLane, setCurrentLane] = useState(LANES.CENTER)
  const gameStateRef = useRef({
    distance: 0,
    coins: 0,
    time: 0,
    obstaclesAvoided: 0,
    speed: 1,
    gameObjects: [] as GameObject[],
    nextObstacleTime: 0,
    nextCoinTime: 0,
    lionDistance: 300,
  })

  // Handle keyboard controls
  useEffect(() => {
    if (!isActive || isPaused) return

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setCurrentLane((prev) => Math.max(0, prev - 1))
      } else if (e.key === 'ArrowRight') {
        setCurrentLane((prev) => Math.min(GAME_CONFIG.LANE_COUNT - 1, prev + 1))
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isActive, isPaused])

  // Handle touch controls for mobile
  useEffect(() => {
    if (!isActive || isPaused) return

    let touchStartX = 0
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX
      const diff = touchStartX - touchEndX

      if (Math.abs(diff) > 30) {
        if (diff > 0) {
          // Swiped left
          setCurrentLane((prev) => Math.min(GAME_CONFIG.LANE_COUNT - 1, prev + 1))
        } else {
          // Swiped right
          setCurrentLane((prev) => Math.max(0, prev - 1))
        }
      }
    }

    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchend', handleTouchEnd)
    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isActive, isPaused])

  // Main game loop
  useEffect(() => {
    if (!isActive || isPaused || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let lastTimeStamp = Date.now()

    const gameLoop = () => {
      const currentTime = Date.now()
      const deltaTime = (currentTime - lastTimeStamp) / 1000
      lastTimeStamp = currentTime

      // Update game state
      gameStateRef.current.distance += gameStateRef.current.speed * 100 * deltaTime
      gameStateRef.current.time += deltaTime
      gameStateRef.current.lionDistance = getLionPosition(gameStateRef.current.distance)

      // Spawn obstacles
      if (currentTime > gameStateRef.current.nextObstacleTime) {
        const lane = getRandomLane()
        gameStateRef.current.gameObjects.push({
          id: `obs-${currentTime}-${Math.random()}`,
          x: calculateLanePosition(lane, { width: canvas.width, height: canvas.height }),
          y: -GAME_CONFIG.OBSTACLE_HEIGHT,
          type: 'obstacle',
          lane,
        })
        gameStateRef.current.nextObstacleTime =
          currentTime + GAME_CONFIG.OBSTACLE_SPAWN_RATE / gameStateRef.current.speed
      }

      // Spawn coins
      if (currentTime > gameStateRef.current.nextCoinTime) {
        const lane = getRandomLane()
        gameStateRef.current.gameObjects.push({
          id: `coin-${currentTime}-${Math.random()}`,
          x: calculateLanePosition(lane, { width: canvas.width, height: canvas.height }),
          y: -GAME_CONFIG.COIN_HEIGHT,
          type: 'coin',
          lane,
        })
        gameStateRef.current.nextCoinTime =
          currentTime + GAME_CONFIG.COIN_SPAWN_RATE / gameStateRef.current.speed
      }

      // Update game objects
      const playerX = calculateLanePosition(currentLane, { width: canvas.width, height: canvas.height })
      const playerY = canvas.height - 100

      gameStateRef.current.gameObjects = gameStateRef.current.gameObjects.filter((obj) => {
        obj.y += gameStateRef.current.speed * GAME_CONFIG.OBSTACLE_SPEED * deltaTime * 60

        // Check collision
        if (obj.type === 'obstacle') {
          if (
            checkCollision(
              { x: playerX, y: playerY, width: GAME_CONFIG.PLAYER_WIDTH, height: GAME_CONFIG.PLAYER_HEIGHT },
              { x: obj.x, y: obj.y, width: GAME_CONFIG.OBSTACLE_WIDTH, height: GAME_CONFIG.OBSTACLE_HEIGHT }
            )
          ) {
            onGameOver('HIT BY AN OBSTACLE!', {
              score: calculateScore(
                gameStateRef.current.distance,
                gameStateRef.current.coins,
                gameStateRef.current.obstaclesAvoided
              ),
              coins: gameStateRef.current.coins,
              distance: gameStateRef.current.distance,
              time: Math.floor(gameStateRef.current.time),
              obstaclesAvoided: gameStateRef.current.obstaclesAvoided,
            })
            return false
          }
        }

        // Check coin collection
        if (obj.type === 'coin') {
          if (
            checkCollision(
              { x: playerX, y: playerY, width: GAME_CONFIG.PLAYER_WIDTH, height: GAME_CONFIG.PLAYER_HEIGHT },
              { x: obj.x, y: obj.y, width: GAME_CONFIG.COIN_WIDTH, height: GAME_CONFIG.COIN_HEIGHT }
            )
          ) {
            gameStateRef.current.coins += 1
            return false
          }
        }

        // Count avoided obstacles
        if (obj.type === 'obstacle' && obj.y > playerY + GAME_CONFIG.PLAYER_HEIGHT) {
          gameStateRef.current.obstaclesAvoided += 1
          return false
        }

        return obj.y < canvas.height + 100
      })

      // Increase speed gradually
      gameStateRef.current.speed = getNextGameSpeed(
        gameStateRef.current.speed,
        gameStateRef.current.distance
      )

      // Render
      ctx.fillStyle = '#1a1a1a'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw background
      const groundY = 0
      ctx.fillStyle = '#2d5016'
      ctx.fillRect(0, groundY, canvas.width, canvas.height)

      // Draw road
      ctx.fillStyle = '#4a5f2f'
      for (let i = 0; i < GAME_CONFIG.LANE_COUNT; i++) {
        const laneX = (canvas.width / GAME_CONFIG.LANE_COUNT) * i
        ctx.strokeStyle = '#7a8f5f'
        ctx.lineWidth = 2
        ctx.setLineDash([10, 10])
        ctx.beginPath()
        ctx.moveTo(laneX + canvas.width / GAME_CONFIG.LANE_COUNT / 2, 0)
        ctx.lineTo(laneX + canvas.width / GAME_CONFIG.LANE_COUNT / 2, canvas.height)
        ctx.stroke()
        ctx.setLineDash([])
      }

      // Draw lion chasing
      const lionY = playerY - gameStateRef.current.lionDistance
      ctx.font = '40px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('🦁', playerX + GAME_CONFIG.PLAYER_WIDTH / 2, lionY)

      // Draw player
      ctx.font = '40px Arial'
      ctx.fillText('🏃', playerX + GAME_CONFIG.PLAYER_WIDTH / 2, playerY)

      // Draw game objects (obstacles and coins)
      gameStateRef.current.gameObjects.forEach((obj) => {
        if (obj.type === 'obstacle') {
          ctx.font = '30px Arial'
          ctx.fillText('🌳', obj.x + GAME_CONFIG.OBSTACLE_WIDTH / 2, obj.y + GAME_CONFIG.OBSTACLE_HEIGHT / 2)
        } else if (obj.type === 'coin') {
          ctx.font = '20px Arial'
          ctx.fillText('🪙', obj.x + GAME_CONFIG.COIN_WIDTH / 2, obj.y + GAME_CONFIG.COIN_HEIGHT / 2)
        }
      })

      animationFrameId = requestAnimationFrame(gameLoop)
    }

    animationFrameId = requestAnimationFrame(gameLoop)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [isActive, isPaused, currentLane, onGameOver])

  return (
    <canvas
      ref={canvasRef}
      width={360}
      height={600}
      className="w-full h-full bg-gradient-to-b from-emerald-900 to-gray-900"
    />
  )
}
