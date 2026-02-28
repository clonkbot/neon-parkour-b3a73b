import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface PlatformProps {
  position: [number, number, number]
  size: [number, number, number]
  type: 'normal' | 'jump' | 'slide' | 'moving' | 'crumbling'
  color: string
  index: number
}

export default function Platform({ position, size, type, color, index }: PlatformProps) {
  const ref = useRef<THREE.Mesh>(null!)
  const edgeRef = useRef<THREE.LineSegments>(null!)
  const [hovered, setHovered] = useState(false)

  const originalY = position[1]
  const originalZ = position[2]

  useFrame((state) => {
    if (!ref.current) return

    // Moving platform
    if (type === 'moving') {
      ref.current.position.y = originalY + Math.sin(state.clock.elapsedTime * 2 + index) * 2
    }

    // Add subtle pulse to all platforms
    const scale = 1 + Math.sin(state.clock.elapsedTime * 3 + index * 0.5) * 0.01
    ref.current.scale.setScalar(scale)
  })

  const getEmissiveIntensity = () => {
    switch (type) {
      case 'jump': return 0.8
      case 'moving': return 0.6
      case 'crumbling': return 0.4
      default: return 0.3
    }
  }

  return (
    <group position={position}>
      {/* Main platform */}
      <mesh
        ref={ref}
        castShadow
        receiveShadow
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={size} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 1 : getEmissiveIntensity()}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Glowing edges */}
      <lineSegments ref={edgeRef}>
        <edgesGeometry args={[new THREE.BoxGeometry(...size)]} />
        <lineBasicMaterial color={color} linewidth={2} transparent opacity={0.8} />
      </lineSegments>

      {/* Platform type indicators */}
      {type === 'jump' && (
        <group position={[0, size[1] / 2 + 0.1, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.3, 0.5, 6]} />
            <meshStandardMaterial
              color="#ff00ff"
              emissive="#ff00ff"
              emissiveIntensity={2}
              side={THREE.DoubleSide}
            />
          </mesh>
          <pointLight color="#ff00ff" intensity={3} distance={8} />
        </group>
      )}

      {type === 'moving' && (
        <group position={[0, size[1] / 2 + 0.1, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.4, 0.08, 8, 32]} />
            <meshStandardMaterial
              color="#ffff00"
              emissive="#ffff00"
              emissiveIntensity={2}
            />
          </mesh>
          <pointLight color="#ffff00" intensity={2} distance={6} />
        </group>
      )}

      {type === 'crumbling' && (
        <>
          {[...Array(5)].map((_, i) => (
            <mesh
              key={i}
              position={[
                (Math.random() - 0.5) * size[0] * 0.8,
                size[1] / 2 + 0.05,
                (Math.random() - 0.5) * size[2] * 0.8
              ]}
            >
              <boxGeometry args={[0.2, 0.1, 0.2]} />
              <meshStandardMaterial
                color="#ff4444"
                emissive="#ff4444"
                emissiveIntensity={1}
              />
            </mesh>
          ))}
        </>
      )}

      {/* Underglow */}
      <mesh position={[0, -size[1] / 2 - 0.5, 0]}>
        <planeGeometry args={[size[0] * 1.5, size[2] * 1.5]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}
