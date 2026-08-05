import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls, Trail } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../../store/gameStore';

interface ShipProps {
  isPlayer?: boolean;
  startPosition?: [number, number, number];
  color?: number;
  neonColor?: number;
}

export function Ship({ isPlayer = true, startPosition = [0, 1, 0], color = 0x222222, neonColor = 0x00f0ff }: ShipProps) {
  const groupRef = useRef<THREE.Group>(null);
  const visualsRef = useRef<THREE.Group>(null);
  const [, get] = useKeyboardControls();
  
  const setSpeed = useGameStore((state) => state.setSpeed);
  const decreaseIntegrity = useGameStore((state) => state.decreaseIntegrity);
  const coreIntegrity = useGameStore((state) => state.coreIntegrity);
  const setShipTransform = useGameStore((state) => state.setShipTransform);
  const gameState = useGameStore((state) => state.gameState);
  const setGameState = useGameStore((state) => state.setGameState);

  // Kinematic state
  const velocity = useRef(new THREE.Vector3());
  const maxSpeed = isPlayer ? 150.0 : 130.0 + Math.random() * 30; // AI varies speed
  const boostSpeed = 250.0;
  const accel = 80.0;
  const decel = 40.0;
  const turnSpeed = 2.0;

  // AI random offset
  const aiOffsetTarget = useRef((Math.random() - 0.5) * 60);
  const aiTimer = useRef(0);

  useFrame((state, delta) => {
    if (!groupRef.current || !visualsRef.current) return;
    const group = groupRef.current;
    const visuals = visualsRef.current;
    const time = state.clock.elapsedTime;

    // Hover Animation
    visuals.position.y = Math.sin(time * 4 + startPosition[0]) * 0.2; // Offset sine by x pos so they don't hover sync

    let forward = false;
    let backward = false;
    let left = false;
    let right = false;
    let boost = false;

    if (isPlayer) {
      const keys = get();
      forward = keys.forward;
      backward = keys.backward;
      left = keys.left;
      right = keys.right;
      boost = keys.boost;
    } else {
      // Basic AI logic
      forward = true;
      aiTimer.current -= delta;
      if (aiTimer.current <= 0) {
        aiTimer.current = 2 + Math.random() * 3;
        aiOffsetTarget.current = (Math.random() - 0.5) * 70; // new target X
      }
      
      const distToTarget = aiOffsetTarget.current - group.position.x;
      if (distToTarget > 2) right = true;
      if (distToTarget < -2) left = true;
    }
    
    // Check if stage is cleared
    const isCleared = group.position.z <= -2400;
    if (isPlayer && isCleared && gameState !== 'cleared') {
      setGameState('cleared');
    }

    let currentMaxSpeed = boost && coreIntegrity > 0 && !isCleared ? boostSpeed : maxSpeed;
    if (isPlayer && boost && coreIntegrity > 0 && !isCleared) decreaseIntegrity(15 * delta);

    // Acceleration
    if (forward && !isCleared) {
      velocity.current.z -= accel * delta;
    } else if (backward && !isCleared) {
      velocity.current.z += accel * delta;
    } else {
      const currentDecel = isCleared ? decel * 2 : decel;
      if (velocity.current.z < 0) velocity.current.z += currentDecel * delta;
      if (velocity.current.z > 0) velocity.current.z -= currentDecel * delta;
      if (Math.abs(velocity.current.z) < 1) velocity.current.z = 0;
    }

    // Clamp Speed
    velocity.current.z = Math.max(-currentMaxSpeed, Math.min(velocity.current.z, currentMaxSpeed));

    // Steering
    let turnAmt = 0;
    if (!isCleared) {
      if (left) turnAmt = 1;
      if (right) turnAmt = -1;
    }

    const speedRatio = Math.min(Math.abs(velocity.current.z) / maxSpeed, 1.0);
    group.rotation.y += turnAmt * turnSpeed * speedRatio * delta;

    // Visual Drift (Z Rotation)
    visuals.rotation.z = THREE.MathUtils.lerp(visuals.rotation.z, turnAmt * 0.5, 5 * delta);

    // Move forward locally
    const direction = new THREE.Vector3(0, 0, 1).applyQuaternion(group.quaternion);
    group.position.addScaledVector(direction, velocity.current.z * delta);

    // Track Bounds Collision
    if (group.position.x > 38) {
      group.position.x = 38;
      velocity.current.z *= 0.9;
      if (isPlayer) decreaseIntegrity(5 * delta);
    }
    if (group.position.x < -38) {
      group.position.x = -38;
      velocity.current.z *= 0.9;
      if (isPlayer) decreaseIntegrity(5 * delta);
    }
    
    // Invisible barrier at end
    if (group.position.z < -2450) {
      group.position.z = -2450;
      velocity.current.z = 0;
    }

    // Update Store if player
    if (isPlayer) {
      const currentKmh = Math.abs(velocity.current.z) * 3.6;
      setSpeed(currentKmh);
      setShipTransform([group.position.x, group.position.y, group.position.z], [group.quaternion.x, group.quaternion.y, group.quaternion.z, group.quaternion.w]);
    }
  });

  return (
    <group ref={groupRef} position={startPosition}>
      <group ref={visualsRef}>
        
        {/* Main Body (Capsule) */}
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <capsuleGeometry args={[1, 2, 8, 16]} />
          <meshPhysicalMaterial color={color} metalness={0.9} roughness={0.1} clearcoat={1} />
        </mesh>

        {/* Cockpit (Glass Bubble) */}
        <mesh position={[0, 0.8, -0.5]} castShadow>
          <sphereGeometry args={[0.7, 16, 16]} />
          <meshPhysicalMaterial color={0x000000} metalness={1} roughness={0} transparent opacity={0.8} />
        </mesh>

        {/* Neon Side Strips */}
        <mesh position={[-0.95, 0.1, 0]}>
          <boxGeometry args={[0.1, 0.1, 2.5]} />
          <meshStandardMaterial color={neonColor} emissive={neonColor} emissiveIntensity={3} />
        </mesh>
        <mesh position={[0.95, 0.1, 0]}>
          <boxGeometry args={[0.1, 0.1, 2.5]} />
          <meshStandardMaterial color={neonColor} emissive={neonColor} emissiveIntensity={3} />
        </mesh>

        {/* Thrusters & Light Trails */}
        <group position={[-0.6, 0, 1.5]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.4, 0.3, 0.6]} />
            <meshStandardMaterial color={0x111111} metalness={0.8} roughness={0.2} />
          </mesh>
          <Trail width={1.5} color={neonColor} length={40} decay={2} attenuation={(width) => width}>
            <mesh position={[0, 0, 0.3]}>
              <sphereGeometry args={[0.3]} />
              <meshStandardMaterial color={neonColor} emissive={neonColor} emissiveIntensity={4} />
            </mesh>
          </Trail>
        </group>

        <group position={[0.6, 0, 1.5]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.4, 0.3, 0.6]} />
            <meshStandardMaterial color={0x111111} metalness={0.8} roughness={0.2} />
          </mesh>
          <Trail width={1.5} color={neonColor} length={40} decay={2} attenuation={(width) => width}>
            <mesh position={[0, 0, 0.3]}>
              <sphereGeometry args={[0.3]} />
              <meshStandardMaterial color={neonColor} emissive={neonColor} emissiveIntensity={4} />
            </mesh>
          </Trail>
        </group>

      </group>
    </group>
  );
}
