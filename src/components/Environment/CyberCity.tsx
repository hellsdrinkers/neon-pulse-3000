import { useMemo, useRef } from 'react';
import * as THREE from 'three';

export function CyberCity() {
  const cityGroup = useRef<THREE.Group>(null);

  const buildings = useMemo(() => {
    const b = [];
    const boxGeo = new THREE.BoxGeometry(1, 1, 1);
    const cylGeo = new THREE.CylinderGeometry(0.5, 0.5, 1, 16);
    
    const buildingMat = new THREE.MeshStandardMaterial({
      color: 0x333345,
      roughness: 0.9,
      metalness: 0.3,
    });
    
    // Neon materials
    const windowMatCyan = new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 2 });
    const windowMatMagenta = new THREE.MeshStandardMaterial({ color: 0xff0055, emissive: 0xff0055, emissiveIntensity: 2 });
    const windowMatPurple = new THREE.MeshStandardMaterial({ color: 0x8800ff, emissive: 0x8800ff, emissiveIntensity: 2 });
    const mats = [windowMatCyan, windowMatMagenta, windowMatPurple];

    for (let i = 0; i < 400; i++) {
      const side = Math.random() > 0.5 ? 1 : -1;
      const x = side * (60 + Math.random() * 300); // Leave 120 width clear in center
      const z = (Math.random() - 0.5) * 5000;
      
      const isCylinder = Math.random() > 0.7;
      const geo = isCylinder ? cylGeo : boxGeo;
      
      const width = 20 + Math.random() * 40;
      const depth = isCylinder ? width : 20 + Math.random() * 40;
      const height = 150 + Math.random() * 600;
      
      const hasNeon = Math.random() > 0.4;
      const neonMat = mats[Math.floor(Math.random() * mats.length)];

      b.push(
        <group key={i} position={[x, height / 2 - 10, z]}>
          <mesh castShadow receiveShadow geometry={geo} material={buildingMat} scale={[width, height, depth]} />
          
          {hasNeon && !isCylinder && (
            <mesh 
              position={[side * (width/2 + 0.1), height * (Math.random() - 0.5) * 0.7, 0]} 
              geometry={boxGeo} 
              material={neonMat} 
              scale={[0.5, height * (0.1 + Math.random() * 0.3), depth * 0.8]} 
            />
          )}

          {hasNeon && isCylinder && (
            <mesh 
              position={[0, height * (Math.random() - 0.5) * 0.7, 0]} 
              geometry={cylGeo} 
              material={neonMat} 
              scale={[width + 0.5, height * 0.05, depth + 0.5]} 
            />
          )}
        </group>
      );
    }
    return b;
  }, []);

  return (
    <group ref={cityGroup}>
      {buildings}
    </group>
  );
}
