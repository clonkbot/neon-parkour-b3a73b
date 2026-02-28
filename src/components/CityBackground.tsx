import { useMemo } from 'react'
import * as THREE from 'three'

export default function CityBackground() {
  const buildings = useMemo(() => {
    const builds: Array<{
      position: [number, number, number]
      size: [number, number, number]
      color: string
    }> = []

    // Generate background city
    for (let x = -50; x < 150; x += 8) {
      for (let z = -60; z < -20; z += 8) {
        const height = 10 + Math.random() * 40
        const width = 4 + Math.random() * 4
        const depth = 4 + Math.random() * 4

        const colors = ['#0a0a2a', '#0a1a2a', '#1a0a2a', '#0a0a3a']
        const color = colors[Math.floor(Math.random() * colors.length)]

        builds.push({
          position: [x + Math.random() * 4, height / 2, z + Math.random() * 4],
          size: [width, height, depth],
          color
        })
      }
    }

    return builds
  }, [])

  const windows = useMemo(() => {
    const wins: Array<{
      position: [number, number, number]
      color: string
    }> = []

    buildings.forEach((building) => {
      const numWindows = Math.floor(building.size[1] / 3)
      for (let i = 0; i < numWindows; i++) {
        if (Math.random() > 0.6) {
          const colors = ['#00ffff', '#ff00ff', '#ffff00', '#ffffff']
          wins.push({
            position: [
              building.position[0] + (Math.random() - 0.5) * building.size[0] * 0.8,
              building.position[1] - building.size[1] / 2 + i * 3 + 2,
              building.position[2] + building.size[2] / 2 + 0.1
            ],
            color: colors[Math.floor(Math.random() * colors.length)]
          })
        }
      }
    })

    return wins
  }, [buildings])

  return (
    <group>
      {/* Buildings */}
      {buildings.map((building, i) => (
        <mesh key={i} position={building.position} receiveShadow>
          <boxGeometry args={building.size} />
          <meshStandardMaterial
            color={building.color}
            metalness={0.5}
            roughness={0.5}
          />
        </mesh>
      ))}

      {/* Windows */}
      {windows.map((win, i) => (
        <mesh key={`win-${i}`} position={win.position}>
          <boxGeometry args={[0.8, 1.2, 0.1]} />
          <meshStandardMaterial
            color={win.color}
            emissive={win.color}
            emissiveIntensity={Math.random() * 0.5 + 0.5}
          />
        </mesh>
      ))}

      {/* Ground plane */}
      <mesh position={[40, -0.5, -40]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[300, 100]} />
        <meshStandardMaterial
          color="#050510"
          metalness={0.9}
          roughness={0.3}
        />
      </mesh>

      {/* Grid lines on ground */}
      <gridHelper
        args={[300, 60, '#00ffff', '#00ffff']}
        position={[40, 0.01, -40]}
        rotation={[0, 0, 0]}
      >
        <meshBasicMaterial transparent opacity={0.1} />
      </gridHelper>
    </group>
  )
}
