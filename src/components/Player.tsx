import { useRef, useEffect, useState, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useGame } from '../context/GameContext'

interface PlayerProps {
  platforms: Array<{
    position: [number, number, number]
    size: [number, number, number]
    type: string
    color: string
  }>
}

export default function Player({ platforms }: PlayerProps) {
  const ref = useRef<THREE.Group>(null!)
  const { camera } = useThree()
  const { isPlaying, startGame, endGame, addScore, gameOver, resetGame, setVelocity } = useGame()

  const [position, setPosition] = useState(new THREE.Vector3(0, 3, 0))
  const [velocity, setVel] = useState(new THREE.Vector3(0, 0, 0))
  const [onGround, setOnGround] = useState(false)
  const [canDoubleJump, setCanDoubleJump] = useState(true)
  const [currentPlatform, setCurrentPlatform] = useState(0)

  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false
  })

  // Touch controls state
  const touchRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    jumpTap: false
  })

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying && !gameOver) {
        startGame()
      }
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keys.current.forward = true
          break
        case 'KeyS':
        case 'ArrowDown':
          keys.current.backward = true
          break
        case 'KeyA':
        case 'ArrowLeft':
          keys.current.left = true
          break
        case 'KeyD':
        case 'ArrowRight':
          keys.current.right = true
          break
        case 'Space':
          keys.current.jump = true
          break
        case 'KeyR':
          if (gameOver) {
            resetGame()
            setPosition(new THREE.Vector3(0, 3, 0))
            setVel(new THREE.Vector3(0, 0, 0))
          }
          break
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keys.current.forward = false
          break
        case 'KeyS':
        case 'ArrowDown':
          keys.current.backward = false
          break
        case 'KeyA':
        case 'ArrowLeft':
          keys.current.left = false
          break
        case 'KeyD':
        case 'ArrowRight':
          keys.current.right = false
          break
        case 'Space':
          keys.current.jump = false
          break
      }
    }

    // Touch controls
    const handleTouchStart = (e: TouchEvent) => {
      if (!isPlaying && !gameOver) {
        startGame()
      }
      if (gameOver) {
        resetGame()
        setPosition(new THREE.Vector3(0, 3, 0))
        setVel(new THREE.Vector3(0, 0, 0))
        return
      }

      const touch = e.touches[0]
      touchRef.current.active = true
      touchRef.current.startX = touch.clientX
      touchRef.current.startY = touch.clientY
      touchRef.current.currentX = touch.clientX
      touchRef.current.currentY = touch.clientY

      // Tap in upper half = jump
      if (touch.clientY < window.innerHeight * 0.5) {
        touchRef.current.jumpTap = true
        keys.current.jump = true
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchRef.current.active) return
      const touch = e.touches[0]
      touchRef.current.currentX = touch.clientX
      touchRef.current.currentY = touch.clientY

      const dx = touchRef.current.currentX - touchRef.current.startX
      const dy = touchRef.current.currentY - touchRef.current.startY

      // Horizontal movement
      keys.current.left = dx < -30
      keys.current.right = dx > 30

      // Vertical movement (swipe down = backward)
      keys.current.forward = dy < -30
      keys.current.backward = dy > 30
    }

    const handleTouchEnd = () => {
      touchRef.current.active = false
      touchRef.current.jumpTap = false
      keys.current.forward = false
      keys.current.backward = false
      keys.current.left = false
      keys.current.right = false
      keys.current.jump = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchmove', handleTouchMove)
    window.addEventListener('touchend', handleTouchEnd)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isPlaying, gameOver, startGame, resetGame])

  useFrame((state, delta) => {
    if (!ref.current || gameOver) return

    const speed = 12
    const jumpForce = 12
    const gravity = -30
    const airControl = 0.3

    // Calculate movement direction
    const moveDir = new THREE.Vector3()
    if (keys.current.forward) moveDir.x += 1
    if (keys.current.backward) moveDir.x -= 1
    if (keys.current.left) moveDir.z -= 1
    if (keys.current.right) moveDir.z += 1

    // Apply movement
    const control = onGround ? 1 : airControl
    if (moveDir.length() > 0) {
      moveDir.normalize()
      velocity.x += moveDir.x * speed * control * delta * 10
      velocity.z += moveDir.z * speed * control * delta * 10
    }

    // Apply friction
    const friction = onGround ? 0.9 : 0.98
    velocity.x *= friction
    velocity.z *= friction

    // Clamp horizontal velocity
    const maxSpeed = 15
    velocity.x = Math.max(-maxSpeed, Math.min(maxSpeed, velocity.x))
    velocity.z = Math.max(-maxSpeed, Math.min(maxSpeed, velocity.z))

    // Jump
    if (keys.current.jump) {
      if (onGround) {
        velocity.y = jumpForce
        setOnGround(false)
        setCanDoubleJump(true)
      } else if (canDoubleJump) {
        velocity.y = jumpForce * 0.85
        setCanDoubleJump(false)
        addScore(10) // Bonus for wall jump
      }
      keys.current.jump = false
    }

    // Apply gravity
    velocity.y += gravity * delta

    // Update position
    const newPos = position.clone()
    newPos.x += velocity.x * delta
    newPos.y += velocity.y * delta
    newPos.z += velocity.z * delta

    // Platform collision
    let grounded = false
    for (let i = 0; i < platforms.length; i++) {
      const plat = platforms[i]
      const px = plat.position[0]
      const py = plat.position[1]
      const pz = plat.position[2]
      const hw = plat.size[0] / 2
      const hh = plat.size[1] / 2
      const hd = plat.size[2] / 2

      // Check if player is above platform and within bounds
      if (
        newPos.x >= px - hw - 0.5 &&
        newPos.x <= px + hw + 0.5 &&
        newPos.z >= pz - hd - 0.5 &&
        newPos.z <= pz + hd + 0.5
      ) {
        // Top collision
        if (
          position.y >= py + hh &&
          newPos.y <= py + hh + 1 &&
          velocity.y <= 0
        ) {
          newPos.y = py + hh + 1
          velocity.y = 0
          grounded = true

          // Score for reaching new platform
          if (i > currentPlatform) {
            addScore(100 * (i - currentPlatform))
            setCurrentPlatform(i)
          }

          // Jump pad
          if (plat.type === 'jump') {
            velocity.y = jumpForce * 1.8
            grounded = false
          }
          break
        }
      }
    }

    setOnGround(grounded)

    // Death check
    if (newPos.y < -15) {
      endGame()
      return
    }

    // Update state
    setPosition(newPos)
    setVel(velocity.clone())
    setVelocity({ x: velocity.x, y: velocity.y, z: velocity.z })

    // Update mesh position
    ref.current.position.copy(newPos)

    // Camera follow
    const targetCam = new THREE.Vector3(
      newPos.x - 8,
      newPos.y + 5,
      newPos.z + 8
    )
    camera.position.lerp(targetCam, 0.05)
    camera.lookAt(newPos.x + 5, newPos.y, newPos.z)
  })

  return (
    <group ref={ref} position={[0, 3, 0]}>
      {/* Body */}
      <mesh castShadow>
        <capsuleGeometry args={[0.3, 1, 8, 16]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Glow ring */}
      <mesh position={[0, -0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.4, 0.05, 8, 32]} />
        <meshStandardMaterial
          color="#ff00ff"
          emissive="#ff00ff"
          emissiveIntensity={2}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Trail effect */}
      <pointLight color="#00ffff" intensity={2} distance={5} />
    </group>
  )
}
