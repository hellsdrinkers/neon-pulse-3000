// src/main.js
import * as THREE from 'three';
import { ShipController } from './ShipController.js';
import { TrackBuilder } from './TrackBuilder.js';
import { AudioManager } from './AudioManager.js';

class GameEngine {
    constructor() {
        this.container = document.getElementById('canvas-container');
        this.debugMode = false;

        // Relógio e FPS Counter
        this.clock = new THREE.Clock();
        this.frameCount = 0;
        this.lastFpsUpdate = 0;

        this._initScene();
        this._initComponents();
        this._setupEvents();

        // Start Game Loop
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    _initScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x030308);
        this.scene.fog = new THREE.FogExp2(0x030308, 0.002);

        // Câmera Principal
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            2000
        );

        // Renderer WebGL de Alta Performance
        this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.container.appendChild(this.renderer.domElement);

        // Iluminação Cyberpunk
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        this.scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0x00ffff, 1.5);
        dirLight.position.set(100, 300, 100);
        this.scene.add(dirLight);
    }

    _initComponents() {
        this.audioManager = new AudioManager();

        // Pista
        this.trackBuilder = new TrackBuilder(this.scene);
        const { trackMesh } = this.trackBuilder.buildTrack();

        // Nave do Jogador
        this.ship = new ShipController(this.scene, [trackMesh]);

        // Rig de Câmera (Suave de Terceira Pessoa)
        this.cameraOffset = new THREE.Vector3(0, 5, 12);
    }

    _setupEvents() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Clique inicial para inicializar o áudio da Web API
        window.addEventListener('click', () => {
            this.audioManager.init();
        }, { once: true });

        // Tecla F3 para ativar/desativar modo Debug
        window.addEventListener('keydown', (e) => {
            if (e.code === 'F3') {
                e.preventDefault();
                this.debugMode = !this.debugMode;
                document.getElementById('debug-overlay').classList.toggle('hidden', !this.debugMode);
            }
        });
    }

    _updateCamera(deltaTime) {
        // Posição ideal atrás da nave
        const relativeOffset = this.cameraOffset.clone().applyQuaternion(this.ship.mesh.quaternion);
        const targetCameraPos = this.ship.mesh.position.clone().add(relativeOffset);

        // Smooth Camera Lag (Interpolação de Posição)
        this.camera.position.lerp(targetCameraPos, 12.0 * deltaTime);
        this.camera.lookAt(this.ship.mesh.position.clone().add(new THREE.Vector3(0, 1.5, 0)));

        // Sensação de Velocidade: FOV Dinâmico
        const speedRatio = this.ship.currentSpeed / this.ship.maxSpeed;
        const targetFOV = 75 + (speedRatio * 30); // Aumenta o campo de visão em alta velocidade
        this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, targetFOV, 5.0 * deltaTime);
        this.camera.updateProjectionMatrix();
    }

    _updateUI() {
        // Atualiza Barra de Energia
        const energyBar = document.getElementById('energy-bar');
        const percentage = (this.ship.energy / this.ship.maxEnergy) * 100;
        energyBar.style.width = `${percentage}%`;

        // Velocidade Real Formatada
        const speedText = document.getElementById('speed-text');
        const kmh = Math.floor(this.ship.currentSpeed * 4.2); // Fator de escala estético
        speedText.innerText = String(kmh).padStart(3, '0');

        // Atualização dos Dados do Painel F3
        if (this.debugMode) {
            document.getElementById('debug-fps').innerText = this.fps || 60;
            document.getElementById('debug-speed').innerText = kmh;
            const pos = this.ship.mesh.position;
            document.getElementById('debug-pos').innerText = `${pos.x.toFixed(1)}, ${pos.y.toFixed(1)}, ${pos.z.toFixed(1)}`;
            document.getElementById('debug-hover').innerText = this.ship.verticalVelocity.toFixed(2);
            document.getElementById('debug-state').innerText = this.ship.isBoosting ? "BOOSTING" : "NORMAL";
        }
    }

    _checkZoneCollisions() {
        const shipPos = this.ship.mesh.position;

        // Pit Zones (Recarga de Energia)
        this.trackBuilder.pitZones.forEach((pit) => {
            if (shipPos.distanceTo(pit.position) < 15.0) {
                this.ship.rechargeEnergy(15.0 * this.deltaTime);
            }
        });

        // Boost Pads
        this.trackBuilder.boostPads.forEach((pad) => {
            if (shipPos.distanceTo(pad.position) < 6.0) {
                this.ship.currentSpeed = this.ship.boostSpeed;
                this.audioManager.playBoostSound();
            }
        });
    }

    animate() {
        requestAnimationFrame(this.animate);

        this.deltaTime = this.clock.getDelta();
        const elapsedTime = this.clock.getElapsedTime();

        // Cálculo Simples de FPS
        this.frameCount++;
        if (elapsedTime - this.lastFpsUpdate > 1.0) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastFpsUpdate = elapsedTime;
        }

        // Loops de Atualização
        this.ship.update(this.deltaTime, this.audioManager);
        this.trackBuilder.update(this.deltaTime);
        this._checkZoneCollisions();
        this._updateCamera(this.deltaTime);
        this._updateUI();

        // Renderização da Cena
        this.renderer.render(this.scene, this.camera);
    }
}

// Inicializa a Engine do Jogo
new GameEngine();