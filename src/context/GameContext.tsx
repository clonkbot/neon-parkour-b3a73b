import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface GameState {
  score: number
  isPlaying: boolean
  gameOver: boolean
  checkpoint: number
  velocity: { x: number; y: number; z: number }
}

interface GameContextType extends GameState {
  startGame: () => void
  endGame: () => void
  addScore: (points: number) => void
  setCheckpoint: (cp: number) => void
  resetGame: () => void
  setVelocity: (v: { x: number; y: number; z: number }) => void
}

const GameContext = createContext<GameContextType | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>({
    score: 0,
    isPlaying: false,
    gameOver: false,
    checkpoint: 0,
    velocity: { x: 0, y: 0, z: 0 }
  })

  const startGame = useCallback(() => {
    setState(s => ({ ...s, isPlaying: true, gameOver: false, score: 0, checkpoint: 0 }))
  }, [])

  const endGame = useCallback(() => {
    setState(s => ({ ...s, isPlaying: false, gameOver: true }))
  }, [])

  const addScore = useCallback((points: number) => {
    setState(s => ({ ...s, score: s.score + points }))
  }, [])

  const setCheckpoint = useCallback((cp: number) => {
    setState(s => ({ ...s, checkpoint: cp }))
  }, [])

  const resetGame = useCallback(() => {
    setState({
      score: 0,
      isPlaying: false,
      gameOver: false,
      checkpoint: 0,
      velocity: { x: 0, y: 0, z: 0 }
    })
  }, [])

  const setVelocity = useCallback((v: { x: number; y: number; z: number }) => {
    setState(s => ({ ...s, velocity: v }))
  }, [])

  return (
    <GameContext.Provider value={{ ...state, startGame, endGame, addScore, setCheckpoint, resetGame, setVelocity }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within GameProvider')
  return ctx
}
