import { useGame } from '../context/GameContext'

export default function HUD() {
  const { score, isPlaying, gameOver, velocity } = useGame()

  return (
    <>
      {/* Top HUD */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 md:p-6">
        <div className="flex justify-between items-start max-w-7xl mx-auto">
          {/* Score */}
          <div className="bg-black/60 backdrop-blur-md border border-cyan-500/30 rounded-lg p-3 md:p-4">
            <div className="text-[10px] md:text-xs text-cyan-400/60 font-mono uppercase tracking-[0.3em]">
              Score
            </div>
            <div className="text-2xl md:text-4xl font-bold text-cyan-400 font-mono tabular-nums">
              {score.toString().padStart(6, '0')}
            </div>
          </div>

          {/* Speed indicator */}
          <div className="bg-black/60 backdrop-blur-md border border-magenta-500/30 rounded-lg p-3 md:p-4">
            <div className="text-[10px] md:text-xs text-fuchsia-400/60 font-mono uppercase tracking-[0.3em]">
              Velocity
            </div>
            <div className="flex gap-2 md:gap-4 text-fuchsia-400 font-mono text-sm md:text-base">
              <span>X:{Math.abs(velocity.x).toFixed(1)}</span>
              <span>Y:{velocity.y.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Start Screen */}
      {!isPlaying && !gameOver && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="text-center p-6 md:p-8 max-w-md mx-4">
            <h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 tracking-tight"
              style={{
                background: 'linear-gradient(135deg, #00ffff 0%, #ff00ff 50%, #ffff00 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 40px rgba(0, 255, 255, 0.5)'
              }}
            >
              NEON<br />PARKOUR
            </h1>

            <p className="text-cyan-400/70 text-sm md:text-base mb-6 md:mb-8 font-mono">
              Navigate the cyberpunk rooftops.<br />
              Don't fall into the void.
            </p>

            <div className="space-y-4">
              <div className="bg-black/60 border border-cyan-500/30 rounded-lg p-4 text-left">
                <div className="text-[10px] md:text-xs text-cyan-400/60 font-mono uppercase tracking-[0.3em] mb-3">
                  Controls
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs md:text-sm text-cyan-400/80 font-mono">
                  <span className="text-fuchsia-400">WASD / Arrows</span>
                  <span>Move</span>
                  <span className="text-fuchsia-400">SPACE</span>
                  <span>Jump / Double Jump</span>
                  <span className="text-fuchsia-400">Touch</span>
                  <span>Swipe + Tap Top</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 justify-center text-xs font-mono">
                <span className="px-3 py-1 bg-cyan-400/20 text-cyan-400 rounded border border-cyan-400/30">
                  Cyan = Normal
                </span>
                <span className="px-3 py-1 bg-fuchsia-400/20 text-fuchsia-400 rounded border border-fuchsia-400/30">
                  Pink = Jump Pad
                </span>
                <span className="px-3 py-1 bg-yellow-400/20 text-yellow-400 rounded border border-yellow-400/30">
                  Yellow = Moving
                </span>
                <span className="px-3 py-1 bg-red-400/20 text-red-400 rounded border border-red-400/30">
                  Red = Unstable
                </span>
              </div>
            </div>

            <div className="mt-6 md:mt-8 animate-pulse">
              <p className="text-cyan-400 font-mono text-sm md:text-base">
                [ PRESS ANY KEY OR TAP TO START ]
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Game Over Screen */}
      {gameOver && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="text-center p-6 md:p-8 max-w-md mx-4">
            <h2
              className="text-4xl md:text-6xl font-bold mb-4 md:mb-6"
              style={{
                background: 'linear-gradient(135deg, #ff0000 0%, #ff00ff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 40px rgba(255, 0, 255, 0.5)'
              }}
            >
              SYSTEM<br />FAILURE
            </h2>

            <p className="text-fuchsia-400/70 text-sm md:text-base mb-4 font-mono">
              Connection terminated.
            </p>

            <div className="bg-black/60 border border-fuchsia-500/30 rounded-lg p-4 mb-6">
              <div className="text-[10px] md:text-xs text-fuchsia-400/60 font-mono uppercase tracking-[0.3em] mb-2">
                Final Score
              </div>
              <div className="text-3xl md:text-5xl font-bold text-fuchsia-400 font-mono">
                {score.toString().padStart(6, '0')}
              </div>
            </div>

            <div className="animate-pulse">
              <p className="text-fuchsia-400 font-mono text-sm md:text-base">
                [ PRESS R OR TAP TO RESTART ]
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Controls hint during gameplay */}
      {isPlaying && !gameOver && (
        <div className="absolute bottom-12 md:bottom-16 left-4 md:left-6 z-20 opacity-50 hover:opacity-100 transition-opacity">
          <div className="text-[10px] md:text-xs text-cyan-400/60 font-mono">
            <span className="hidden md:inline">WASD/Arrows + Space</span>
            <span className="md:hidden">Swipe to move · Tap top to jump</span>
          </div>
        </div>
      )}
    </>
  )
}
