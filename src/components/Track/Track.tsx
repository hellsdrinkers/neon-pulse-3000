import { useMemo } from 'react';
import * as THREE from 'three';
import { MeshReflectorMaterial, Text3D, Center } from '@react-three/drei';

function createAsphaltTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext('2d');
  if (context) {
    context.fillStyle = '#111';
    context.fillRect(0, 0, 512, 512);
    // Add noise
    for (let i = 0; i < 20000; i++) {
      context.fillStyle = Math.random() > 0.5 ? '#1a1a1a' : '#0a0a0a';
      context.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 250);
  return texture;
}

export function Track() {
  const asphaltTexture = useMemo(() => createAsphaltTexture(), []);

  return (
    <group>
      {/* Holographic Title */}
      <Center position={[0, 8, -50]}>
        <Text3D
          font="https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_bold.typeface.json"
          size={12}
          height={2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.5}
          bevelSize={0.2}
          bevelOffset={0}
          bevelSegments={5}
        >
          NEON PULSE 3000
          <meshStandardMaterial color={0x00f0ff} emissive={0x00f0ff} emissiveIntensity={3} />
        </Text3D>
      </Center>

      {/* Solid Asphalt Track with Real-time Reflection */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[80, 5000]} />
        <MeshReflectorMaterial
          blur={[400, 100]} // Blur ground reflections (width, height)
          resolution={512} // Decrease resolution for performance, since it's 5000m long!
          mixBlur={1.5}
          mixStrength={10}
          roughness={0.2}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#333333"
          metalness={0.8}
          roughnessMap={asphaltTexture}
          mirror={1}
        />
      </mesh>

      {/* Embedded Neon Rails on the Track */}
      {/* Left cyan rail */}
      <mesh position={[-15, 0.05, 0]}>
        <boxGeometry args={[0.5, 0.1, 5000]} />
        <meshStandardMaterial color={0x00f0ff} emissive={0x00f0ff} emissiveIntensity={2} />
      </mesh>
      {/* Right magenta rail */}
      <mesh position={[15, 0.05, 0]}>
        <boxGeometry args={[0.5, 0.1, 5000]} />
        <meshStandardMaterial color={0xff0055} emissive={0xff0055} emissiveIntensity={2} />
      </mesh>

      {/* Side Barriers */}
      <mesh position={[-40, 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[2, 4, 5000]} />
        <meshStandardMaterial color={0x222222} roughness={0.5} metalness={0.8} />
      </mesh>
      
      {/* Plasma Barrier Glow (Left) */}
      <mesh position={[-39, 3, 0]}>
        <boxGeometry args={[0.5, 1, 5000]} />
        <meshStandardMaterial color={0xff0055} emissive={0xff0055} emissiveIntensity={2} />
      </mesh>

      <mesh position={[40, 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[2, 4, 5000]} />
        <meshStandardMaterial color={0x222222} roughness={0.5} metalness={0.8} />
      </mesh>

      {/* Plasma Barrier Glow (Right) */}
      <mesh position={[39, 3, 0]}>
        <boxGeometry args={[0.5, 1, 5000]} />
        <meshStandardMaterial color={0x00f0ff} emissive={0x00f0ff} emissiveIntensity={2} />
      </mesh>

      {/* Grid Lines on Track (Removed old wireframe entirely, replaced with rails) */}

      {/* Finish Line (Neon Gate) at Z = -2400 */}
      <group position={[0, 0, -2400]}>
        <mesh position={[-38, 10, 0]}>
          <boxGeometry args={[4, 20, 2]} />
          <meshStandardMaterial color={0x111} metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[-38, 10, 0]}>
          <boxGeometry args={[4.2, 18, 2.2]} />
          <meshBasicMaterial color={0x00f0ff} wireframe />
        </mesh>
        <mesh position={[38, 10, 0]}>
          <boxGeometry args={[4, 20, 2]} />
          <meshStandardMaterial color={0x111} metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[38, 10, 0]}>
          <boxGeometry args={[4.2, 18, 2.2]} />
          <meshBasicMaterial color={0x00f0ff} wireframe />
        </mesh>
        <mesh position={[0, 21, 0]}>
          <boxGeometry args={[80, 4, 2]} />
          <meshStandardMaterial color={0x111} metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 15, 0]}>
          <planeGeometry args={[70, 8]} />
          <meshBasicMaterial color={0xff0055} transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
        <pointLight position={[0, 15, 0]} color={0xff0055} intensity={5} distance={100} />
      </group>
    </group>
  );
}
