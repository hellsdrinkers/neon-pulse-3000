import { RigidBody } from '@react-three/rapier';
import { useGameStore } from '../../store/gameStore';

interface PowerPadProps {
  position: [number, number, number];
  rotation?: [number, number, number];
}

export function PowerPad({ position, rotation = [-Math.PI / 2, 0, 0] }: PowerPadProps) {
  const increaseIntegrity = useGameStore((state) => state.increaseIntegrity);

  const handleIntersect = () => {
    increaseIntegrity(20);
    // Visual effect or sound could be triggered here
  };

  return (
    <RigidBody type="fixed" colliders="cuboid" sensor onIntersectionEnter={handleIntersect}>
      <mesh position={position} rotation={rotation}>
        <planeGeometry args={[10, 15]} />
        <meshBasicMaterial color={0x00f0ff} transparent opacity={0.8} />
      </mesh>
    </RigidBody>
  );
}
