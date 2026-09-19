// Game physics and constants
export const GAME_CONFIG = {
  // Player movement
  PLAYER_SPEED: 8,
  PLAYER_WIDTH: 40,
  PLAYER_HEIGHT: 50,
  
  // Lane system
  LANE_COUNT: 3,
  LANE_WIDTH: 80,
  
  // Obstacles
  OBSTACLE_WIDTH: 70,
  OBSTACLE_HEIGHT: 60,
  OBSTACLE_SPEED: 6,
  OBSTACLE_SPAWN_RATE: 2500, // ms
  
  // Coins
  COIN_WIDTH: 20,
  COIN_HEIGHT: 20,
  COIN_SPAWN_RATE: 3000, // ms
  COIN_VALUE: 10,
  
  // Lion (chaser)
  LION_WIDTH: 80,
  LION_HEIGHT: 60,
  LION_SPEED: 5, // slightly slower than obstacles
  LION_CATCH_DISTANCE: 50, // pixels
  
  // Game speed
  BASE_SPEED_INCREMENT: 0.0005,
  MAX_SPEED_MULTIPLIER: 3,
  
  // Camera/viewport
  VIEWPORT_HEIGHT: 600,
  VIEWPORT_WIDTH: 360,
  
  // Mobile responsive
  MOBILE_VIEWPORT_WIDTH: 280,
  MOBILE_VIEWPORT_HEIGHT: 600,
}

export const LANES = {
  LEFT: 0,
  CENTER: 1,
  RIGHT: 2,
}

export const GAME_STATES = {
  INTRO: 'intro',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'gameOver',
  HIGH_SCORE: 'highScore',
}

export const DEVICE_TYPES = {
  MOBILE: 'mobile',
  TABLET: 'tablet',
  DESKTOP: 'desktop',
}
