import { useRef, useEffect, useState, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Environment, Sky, Stars, Float } from '@react-three/drei'
import * as THREE from 'three'
import { useGame } from '../context/GameContext'
import Player from './Player'
import Platform from './Platform'
import NeonSign from './NeonSign'
import CityBackground from './CityBackground'

export default function Game() {
  const { isPlaying, startGame, gameOver } = useGame()

  // Generate procedural level
  const platforms = useMemo(() => {
    const plats: Array<{
      position: [number, number, number]
      size: [number, number, number]
      type: 'normal' | 'jump' | 'slide' | 'moving' | 'crumbling'
      color: string
    }> = []

    let x = 0
    let y = 2
    let z = 0

    // Start platform
    plats.push({
      position: [0, 0, 0],
      size: [8, 1, 8],
      type: 'normal',
      color: '#00ffff'
    })

    // Generate parkour course
    for (let i = 0; i < 30; i++) {
      const rand = Math.random()
      const gap = 2 + Math.random() * 3
      const heightChange = (Math.random() - 0.3) * 3

      x += gap
      y = Math.max(0.5, y + heightChange)
      z += (Math.random() - 0.5) * 4

      let type: 'normal' | 'jump' | 'slide' | 'moving' | 'crumbling' = 'normal'
      let color = '#00ffff'

      if (rand < 0.2) {
        type = 'jump'
        color = '#ff00ff'
      } else if (rand < 0.35) {
        type = 'moving'
        color = '#ffff00'
      } else if (rand < 0.5) {
        type = 'crumbling'
        color = '#ff4444'
      }

      const width = 2 + Math.random() * 3
      const depth = 2 + Math.random() * 3

      plats.push({
        position: [x, y, z],
        size: [width, 0.5, depth],
        type,
        color
      })
    }

    // End platform
    plats.push({
      position: [x + 5, y, z],
      size: [10, 1, 10],
      type: 'normal',
      color: '#00ff00'
    })

    return plats
  }, [])

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <directionalLight
        position={[50, 100, 50]}
        intensity={0.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={200}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      <pointLight position={[0, 10, 0]} color="#00ffff" intensity={2} distance={50} />
      <pointLight position={[30, 15, 0]} color="#ff00ff" intensity={2} distance={50} />
      <pointLight position={[60, 10, 0]} color="#ffff00" intensity={2} distance={50} />

      {/* Sky & Environment */}
      <Sky
        distance={450000}
        sunPosition={[0, -1, 0]}
        inclination={0}
        azimuth={0.25}
      />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <fog attach="fog" args={['#0a0a1a', 30, 150]} />

      {/* City Background */}
      <CityBackground />

      {/* Neon Signs */}
      <NeonSign position={[-5, 8, -10]} text="RUN" color="#ff00ff" />
      <NeonSign position={[25, 12, -15]} text="JUMP" color="#00ffff" />
      <NeonSign position={[50, 10, -12]} text="FLOW" color="#ffff00" />

      {/* Ground plane (death zone) */}
      <mesh position={[40, -20, 0]} receiveShadow>
        <boxGeometry args={[200, 1, 100]} />
        <meshStandardMaterial color="#0a0a1a" />
      </mesh>

      {/* Platforms */}
      {platforms.map((plat, i) => (
        <Platform key={i} {...plat} index={i} />
      ))}

      {/* Player */}
      <Player platforms={platforms} />

      {/* Floating particles */}
      <FloatingParticles />
    </>
  )
}

function FloatingParticles() {
  const count = 100
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 100
      pos[i * 3 + 1] = Math.random() * 30
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50
    }
    return pos
  }, [])

  const ref = useRef<THREE.Points>(null!)

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#00ffff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}
