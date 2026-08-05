import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { KeyboardControls } from '@react-three/drei';
import { CyberCity } from './components/Environment/CyberCity';
import { Track } from './components/Track/Track';
import { Ship } from './components/Ship/Ship';
import { PostProcessingEffects } from './components/Effects/PostProcessing';
import { HUD } from './components/UI/HUD';
import { CameraFollow } from './components/Camera/CameraFollow';

const keyboardMap = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
  { name: 'boost', keys: ['Shift', 'Space'] },
];

function App() {
  return (
    <KeyboardControls map={keyboardMap}>
      <HUD />
      <Canvas 
        shadows 
        camera={{ position: [0, 5, 15], fov: 75 }} 
        gl={{ powerPreference: "high-performance", antialias: false }}
      >
        <color attach="background" args={['#1a1025']} />
        
        {/* Real Lighting */}
        <ambientLight intensity={3.5} color={0xffffff} />
        <directionalLight 
          castShadow 
          position={[100, 200, 100]} 
          intensity={4.0} 
          color={0xffffff} 
          shadow-mapSize={[2048, 2048]} 
          shadow-camera-left={-100}
          shadow-camera-right={100}
          shadow-camera-top={100}
          shadow-camera-bottom={-100}
        />
        
        <fogExp2 attach="fog" args={['#1a1025', 0.0008]} />

        <Suspense fallback={null}>
          <CyberCity />
          <Track />
          
          {/* Player Ship */}
          <Ship isPlayer={true} startPosition={[0, 1, 0]} color={0x111111} neonColor={0x00f0ff} />
          
          {/* AI Opponents */}
          <Ship isPlayer={false} startPosition={[-15, 1, -100]} color={0x221133} neonColor={0xff0055} />
          <Ship isPlayer={false} startPosition={[15, 1, -200]} color={0x331111} neonColor={0xffaa00} />
          <Ship isPlayer={false} startPosition={[-25, 1, -300]} color={0x112211} neonColor={0x00ff00} />
          
          <PostProcessingEffects />
          <CameraFollow />
        </Suspense>
      </Canvas>
    </KeyboardControls>
  );
}

export default App;
