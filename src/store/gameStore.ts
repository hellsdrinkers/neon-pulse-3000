import { create } from 'zustand';

interface GameState {
  coreIntegrity: number;
  speed: number;
  gameState: 'playing' | 'gameover' | 'cleared' | 'menu';
  activePowerUp: string | null;
  shipPosition: [number, number, number];
  shipRotation: [number, number, number, number];
  setCoreIntegrity: (val: number) => void;
  decreaseIntegrity: (amount: number) => void;
  increaseIntegrity: (amount: number) => void;
  setSpeed: (speed: number) => void;
  setGameState: (state: 'playing' | 'gameover' | 'cleared' | 'menu') => void;
  setShipTransform: (pos: [number, number, number], rot: [number, number, number, number]) => void;
}

export const useGameStore = create<GameState>((set) => ({
  coreIntegrity: 100,
  speed: 0,
  gameState: 'playing',
  activePowerUp: null,
  shipPosition: [0, 5, 0],
  shipRotation: [0, 0, 0, 1],

  setCoreIntegrity: (val) => set({ coreIntegrity: Math.max(0, Math.min(100, val)) }),
  
  decreaseIntegrity: (amount) => set((state) => ({
    coreIntegrity: Math.max(0, state.coreIntegrity - amount),
  })),

  increaseIntegrity: (amount) => set((state) => ({
    coreIntegrity: Math.min(100, state.coreIntegrity + amount),
  })),

  setSpeed: (speed) => set({ speed }),
  setGameState: (state) => set({ gameState: state }),
  setShipTransform: (pos, rot) => set({ shipPosition: pos, shipRotation: rot }),
}));
