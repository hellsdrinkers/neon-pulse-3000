import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../../store/gameStore';
import * as THREE from 'three';

export function CameraFollow() {
  const speed = useGameStore((state) => state.speed);

  useFrame((state) => {
    // Dynamic FOV based on speed
    const maxSpeed = 300;
    const speedRatio = Math.min(speed / maxSpeed, 1.0);
    const targetFov = 75 + (speedRatio * 30);
    
    // Smoothly interpolate FOV
    const camera = state.camera as THREE.PerspectiveCamera;
    camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, 0.1);
    camera.updateProjectionMatrix();

    // Camera chasing Ship
    const shipPos = useGameStore.getState().shipPosition;
    const shipRot = useGameStore.getState().shipRotation;
    
    const shipQuat = new THREE.Quaternion(...shipRot);
    const sPos = new THREE.Vector3(...shipPos);

    // Calculate ideal offset behind and above the ship
    const offset = new THREE.Vector3(0, 3, 10).applyQuaternion(shipQuat);
    const targetCameraPos = sPos.clone().add(offset);

    // Smoothly move camera to target position
    state.camera.position.lerp(targetCameraPos, 0.1);
    
    // Look ahead of the ship
    const lookAtTarget = sPos.clone().add(new THREE.Vector3(0, 1.5, -10).applyQuaternion(shipQuat));
    
    // Smoothly look at target
    const currentLookAt = new THREE.Vector3(0, 0, -1).applyQuaternion(state.camera.quaternion).add(state.camera.position);
    currentLookAt.lerp(lookAtTarget, 0.1);
    state.camera.lookAt(currentLookAt);
  });

  return null;
}
