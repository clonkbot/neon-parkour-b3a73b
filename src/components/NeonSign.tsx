import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Float } from '@react-three/drei'
import * as THREE from 'three'

interface NeonSignProps {
  position: [number, number, number]
  text: string
  color: string
}

export default function NeonSign({ position, text, color }: NeonSignProps) {
  const ref = useRef<THREE.Group>(null!)

  useFrame((state) => {
    if (ref.current) {
      // Subtle flicker
      const flicker = Math.sin(state.clock.elapsedTime * 10) > 0.95 ? 0.5 : 1
      ref.current.children.forEach((child) => {
        if ((child as THREE.Mesh).material) {
          const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial
          if (mat.emissiveIntensity !== undefined) {
            mat.emissiveIntensity = 2 * flicker
          }
        }
      })
    }
  })

  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.5}>
      <group ref={ref} position={position}>
        <Text
          font="https://fonts.gstatic.com/s/orbitron/v31/yMJRMIlzdpvBhQQL_Qq7dys.woff"
          fontSize={3}
          color={color}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.1}
          outlineColor={color}
        >
          {text}
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={2}
            toneMapped={false}
          />
        </Text>

        {/* Glow backdrop */}
        <mesh position={[0, 0, -0.5]}>
          <planeGeometry args={[text.length * 2.5, 4]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.1}
          />
        </mesh>

        {/* Point light for glow effect */}
        <pointLight color={color} intensity={10} distance={20} />
      </group>
    </Float>
  )
}
