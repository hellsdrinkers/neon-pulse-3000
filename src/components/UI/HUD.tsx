import { useGameStore } from '../../store/gameStore';

export function HUD() {
  const coreIntegrity = useGameStore((state) => state.coreIntegrity);
  const speed = useGameStore((state) => state.speed);
  const activePowerUp = useGameStore((state) => state.activePowerUp);
  const gameState = useGameStore((state) => state.gameState);

  return (
    <>
      <div className="hud-container">
        {/* Top Left: Core Integrity */}
        <div className="hud-panel top-left">
        <div className="hud-title">SISTEMA DE ENERGIA / BOOST</div>
        <div className="hud-bar-bg">
          <div 
            className="hud-bar-fill" 
            style={{ 
              width: `${coreIntegrity}%`, 
              backgroundColor: coreIntegrity < 20 ? '#ff0055' : '#00f0ff' 
            }} 
          />
        </div>
        <div className="hud-value">CORE INTEGRITY: {Math.floor(coreIntegrity)}%</div>
      </div>

      {/* Top Right: Speedometer */}
      <div className="hud-panel top-right">
        <div className="speed-value">{Math.floor(speed).toString().padStart(3, '0')}</div>
        <div className="speed-unit">KM/H</div>
      </div>

      {/* Bottom Left: Active Power-up */}
      <div className="hud-panel bottom-left">
        <div className="hud-title">MODULO ATIVO</div>
        <div className="powerup-slot">
          {activePowerUp || "NENHUM"}
        </div>
        </div>
      </div>

      {/* Game Over / Stage Cleared Modal */}
      {gameState === 'cleared' && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h1>STAGE CLEARED</h1>
            <p>FASE CONCLUÍDA COM SUCESSO</p>
          </div>
        </div>
      )}
    </>
  );
}
