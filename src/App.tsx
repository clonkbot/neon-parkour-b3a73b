import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import Game from './components/Game'
import HUD from './components/HUD'
import { GameProvider } from './context/GameContext'

export default function App() {
  return (
    <GameProvider>
      <div className="w-screen h-screen bg-black overflow-hidden relative">
        {/* Scanline overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-10 opacity-[0.03]"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.1) 2px, rgba(0,255,255,0.1) 4px)'
          }}
        />

        <Canvas
          shadows
          camera={{ position: [0, 5, 10], fov: 75 }}
          className="touch-none"
        >
          <Suspense fallback={null}>
            <Game />
          </Suspense>
        </Canvas>

        <HUD />

        {/* Footer */}
        <footer className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 z-20">
          <p className="text-[10px] md:text-xs text-cyan-400/40 font-mono tracking-widest">
            Requested by @brandonn2221 · Built by @clonkbot
          </p>
        </footer>
      </div>
    </GameProvider>
  )
}
